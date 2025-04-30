from rest_framework import viewsets, status
from rest_framework.parsers import FileUploadParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_gis.filters import InBBoxFilter
from django.core.serializers import serialize
from django.core.files.storage import default_storage
from django.contrib.gis.db.models import PointField
from django.contrib.gis.geos import GEOSGeometry
from django.http import HttpResponse
from django.contrib.gis import gdal
from maps.scripts.grid_guard import validate_cells
from datetime import datetime

import magic
import subprocess
from . import models
from . import serializers

import time
from django.contrib.gis.geos import GEOSGeometry
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


class IndicatorsViewset(viewsets.ModelViewSet):
    """
    Conjunto de vistas para el modelo Indicators.

    Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en los indicadores.
    Actualmente solo implementa Crear (POST), Leer (GET) y Eliminar (DELETE).

    """

    queryset = models.Indicators.objects.all()
    serializer_class = serializers.IndicatorsSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        """
        Obtiene el conjunto de indicadores con filtros opcionales.

        Parámetros de consulta:
            - id (int): Identificador único del indicador.

        Returns:
            - Conjunto de indicadores filtrados.

        """
        queryset = models.Indicators.objects.all()
        # Filtro por ID
        id_request = self.request.query_params.get("id", None)
        if id_request is not None:
            queryset = queryset.filter(id=id_request)
        return queryset

    def create(self, request):
        """
        Crea un nuevo indicador.

        Args:
            request: contiene los datos para crear un indicador.

        Returns:
            - Datos del indicador creado.

        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            new_indicator = serializer.save()
            return Response(
                {"indicator_id": new_indicator.id}, status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {"message": "Datos no válidos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def destroy(self, request, pk=None):
        try:
            indicator = models.Indicators.objects.get(pk=pk)
            models.Pixels.objects.filter(indicator=indicator).delete()
            models.OriginalPixels.objects.filter(indicator=indicator).delete()
            models.Metadata.objects.filter(indicator=indicator).delete()
            models.ProjectIndicator.objects.filter(indicator=indicator).delete()

            if indicator.layer:
                try:
                    indicator.layer.delete(save=False)
                except Exception as e:
                    print(f"Error borrando archivo de capa: {e}")
            indicator.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except models.Indicators.DoesNotExist:
            return Response(
                {"detail": "No Indicators matches the given query."},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["get"])
    def download(self, request):
        """
        Descarga datos de Indicadores como CSV.

        Parámetros de consulta:
            - indicator_id (int): Identificador único del indicador.

        Returns:
            - CSV de la capa del indicador.

        """
        queryset = self.queryset
        # Filtro por indicador
        id_request = self.request.query_params.get("id", None)
        if id_request is not None:
            try:
                queryset = queryset.filter(id=id_request)
                indicator_object = queryset.first()
                file_path = indicator_object.layer.path
                with open(file_path, "rb") as file:
                    response = HttpResponse(file.read(), content_type="text/csv")
                    response[
                        "Content-Disposition"
                    ] = f'attachment; filename="{indicator_object.layer.name}"'
                    return response
            except Exception as e:
                return HttpResponse(
                    {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(
                {"message": "id es requerido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["post"])
    def adder(self, request):
        """
        Realiza un procesamiento de imágenes TIFF e indicadores.
        """
        serializer = serializers.AdderSerializer(data=request.data)
        if serializer.is_valid():
            file_path = serializer.validated_data["file_path"]
            indicator_id = serializer.validated_data["indicator_id"]
            try:
                command = f'python3 ./maps/scripts/indicator_adder_runner.py --raster_path "/home/proyecto/atlas/atlas_back/media/{file_path}" --indicator_id "{indicator_id}"'
                print(command)
                result = subprocess.run(
                    command,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                )
                import time

                time.sleep(10)
                if result.returncode == 0:
                    return Response(
                        {
                            "status": "success",
                            "message": "Imagen procesada correctamente. Indicador generado.",
                        }
                    )
                else:
                    return Response(
                        {
                            "status": "error",
                            "message": result.stderr,
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            except Exception as e:
                return Response(
                    {
                        "status": "error",
                        "message": str(e),
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {
                    "status": "error",
                    "message": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["post"])
    def analyzer(self, request):
        """
        Realiza un análisis sobre capas (indicadores).
        """
        serializer = serializers.AnalyzeSerializer(data=request.data)
        if serializer.is_valid():
            # Format name with an id if it already exists
            name = serializer.validated_data["name"]
            name = name.strip()

            max_length = 29
            if len(name) > max_length:
                name = name[:max_length]

            final_name = name
            contador = 1

            while models.Indicators.objects.filter(name=final_name).exists():
                sufijo = f" ({contador})"
                recorte = max_length - len(sufijo)
                final_name = f"{name[:recorte]}{sufijo}"
                contador += 1

            new_indicator = models.Indicators.objects.create(
                name=final_name,
                units_id=1
            )

            # Create the new indicator and save it to the database
            indicator_id = new_indicator.id
            cell_size = serializer.validated_data["cell_size"]
            extent = serializer.validated_data["extent"]
            selected_ids = serializer.validated_data["selected_ids"]
            weights = serializer.validated_data["weights"]
            relations = serializer.validated_data["relations"]

            # Validate if the proposed analysis is too large, if so, block it
            num_capas = len([i for i in selected_ids.split(",") if i.strip().isdigit()])
            block, info = validate_cells(extent, cell_size, num_capas)

            if block:
                new_indicator.delete()
                return Response({
                    "status": "error",
                    "code": "grid_too_large",
                    "message": (
                        f"El análisis fue bloqueado porque generaría {info['total_operaciones']:,} operaciones, "
                        f"excediendo el límite de {info['limite']:,}. "
                        "Por favor reduce el área o aumenta el tamaño de celda."
                    )
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                command = f'python3 ./maps/scripts/analysis_runner.py -n "{final_name}" -c "{cell_size}" -i "{selected_ids}" -r "{relations}" -w "{weights}" -k "{extent}"'
                print(command)
                result = subprocess.run(
                    command,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                )
                if result.returncode == 0:
                    return Response(
                        {
                            "status": "success",
                            "message": "Análisis completado correctamente",
                            "indicator_id": indicator_id
                        }
                    )
                else:
                    self.destroy(request, pk=indicator_id)
                    return Response(
                        {
                            "status": "error",
                            "message": result.stderr,
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            except Exception as e:
                self.destroy(request, pk=indicator_id)
                return Response(
                    {
                        "status": "error",
                        "message": str(e),
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {
                    "status": "error",
                    "message": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class OriginalPixelsViewset(viewsets.ModelViewSet):
    """
    Conjunto de vistas para el modelo OriginalPixels.

    Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

    Acciones personalizadas:
        - draw: Retorna datos de píxeles como GeoJSON.

    """

    queryset = models.OriginalPixels.objects.all()
    serializer_class = serializers.OriginalPixelsSerializer
    filter_backends = (InBBoxFilter,)

    @action(detail=False, methods=["post"])
    def draw(self, request):
        """
        Obtiene el conjunto de píxeles con filtros opcionales.

        Parámetros de consulta:
            - indicator_id (int): Identificador único del indicador.
            - in (str): Extensión geográfica en formato GeoJSON.

        Returns:
            - Conjunto de píxeles filtrados.

        """

        start = time.time()

        qs = models.OriginalPixels.objects.all()

        # 1) Filtrar por indicador
        indicator_id = request.data.get("indicator_id")
        if indicator_id is not None:
            qs = qs.filter(indicator_id=indicator_id)

        # 2) Filtrar por área: bbox rápido + within exacto
        geojson_in = request.data.get("in")
        if geojson_in:
            area = GEOSGeometry(geojson_in)
            # bounding-box overlap (usa índice GiST)
            qs = qs.filter(location__bboverlaps=area.envelope)
            # filtro exacto dentro del polígono
            qs = qs.filter(location__within=area)

        # 3) Solo traer campos necesarios
        qs = qs.values("location", "value")

        # 4) Montar FeatureCollection manualmente
        features = []
        for row in qs:
            pt = row["location"]
            val = row["value"]
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [pt.x, pt.y],
                },
                "properties": {"value": val},
            })

        geojson = {
            "type": "FeatureCollection",
            "features": features,
        }

        elapsed = time.time() - start
        print(f"[OriginalPixelsViewset.draw] demoró {elapsed:.2f} s")

        return Response(geojson, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def add_layer(self, request):
        """
        Realiza un procesamiento sobre un archivo TIFF.
        """
        indicator_id_request = request.data.get("indicator_id", None)
        filename_request = request.data.get("filename", None)
        if indicator_id_request and filename_request:
            try:
                command = f'python3 ./maps/scripts/indicator_adder_runner.py --raster_path "{filename_request}" --indicator_id "{indicator_id_request}"'
                result = subprocess.run(
                    command,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                )
                if result.returncode == 0:
                    return Response(
                        {
                            "status": "success",
                            "message": "Script ejecutado correctamente",
                        }
                    )
                else:
                    return Response(
                        {
                            "status": "error",
                            "message": result.stderr,
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            except Exception as e:
                return Response(
                    {
                        "status": "error",
                        "message": str(e),
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {
                    "status": "error",
                    "message": "'indicator_id' y 'filepath' requeridos.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

class FileUploadViewSet(viewsets.ViewSet):
    """
    Conjunto de vistas para la carga de archivos.

    Permite cargar archivos en el servidor.

    """

    serializer_class = serializers.FileUploadSerializer

    def create(self, request):
        """
        Carga un archivo en el servidor.

        Args:
            request: contiene la estructura de datos para cargar el archivo.

        Returns:
            - Mensaje de éxito si el archivo se carga correctamente.

        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            file_obj = serializer.validated_data["file"]
            mime_type = magic.Magic(mime=True)
            detected_type = mime_type.from_buffer(file_obj.read())

            if detected_type != "image/tiff":
                return Response(
                    {
                        "message": f"Solo se permiten archivos .tif. Extensión detectada: {detected_type}"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            file_obj.seek(0)
            file_path = default_storage.save("uploads/" + file_obj.name, file_obj)
            return Response({"file_path": file_path})
        else:
            return Response(
                {"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )


class MetadataViewset(viewsets.ModelViewSet):
    """
    Conjunto de vistas para el modelo Metadata.

    Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en los metadatos.
    Actualmente solo implementa Leer (GET).

    """

    queryset = models.Metadata.objects.all()
    serializer_class = serializers.MetadataSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de metadatos con filtros opcionales.

        Parámetros de consulta:
            - id (int): Identificador único del indicador.

        Returns:
            - Conjunto de metadatos filtrados.

        """
        queryset = models.Metadata.objects.all()
        # Filtro por ID
        id_request = self.request.query_params.get("id", None)
        if id_request is not None:
            queryset = queryset.filter(indicator=id_request)
        return queryset


class UnitsViewset(viewsets.ModelViewSet):
    """
    Conjunto de vistas para el modelo Units.

    Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en unidades.
    Actualmente solo implementa Leer (GET).

    """

    queryset = models.Units.objects.all()
    serializer_class = serializers.UnitsSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de unidades con filtros opcionales.

        Parámetros de consulta:
            - id (int): Identificador único de la unidad.

        Returns:
            - Conjunto de unidades filtrado.

        """
        queryset = models.Units.objects.all()
        # Filtro por abbreviation
        id_request = self.request.query_params.get("id", None)
        if id_request is not None:
            queryset = queryset.filter(id=id_request)
        return queryset


class PixelsViewset(viewsets.ModelViewSet):
    """
    Conjunto de vistas para el modelo Pixels.

    Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

    Acciones personalizadas:
        - draw: Retorna datos de píxeles como GeoJSON.

    """

    queryset = models.Pixels.objects.all()
    serializer_class = serializers.PixelsSerializer
    filter_backends = (InBBoxFilter,)

    @action(detail=False, methods=["post"])
    def draw(self, request):
        """
        Obtiene el conjunto de píxeles con filtros opcionales.

        Parámetros de consulta:
            - indicator_id (int): Identificador único del indicador.
            - in (str): Extensión geográfica en formato GeoJSON.

        Returns:
            - Conjunto de píxeles filtrados.

        """
        queryset = models.Pixels.objects.all()
        # Filtro por indicador
        indicator_id_request = request.data.get("indicator_id", None)
        if indicator_id_request is not None:
            queryset = queryset.filter(indicator_id=indicator_id_request)
        # Filtro por área
        in_request = request.data.get("in", None)
        if in_request:
            area_geometry = GEOSGeometry(in_request)
            queryset = queryset.filter(location__within=area_geometry)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

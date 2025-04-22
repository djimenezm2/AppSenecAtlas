from rest_framework import viewsets, status
from django.contrib.gis.geos import Point
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import action

from . import models
from . import serializers
import joblib

class MunicipioViewset(viewsets.ModelViewSet):
    """
    Conjunto de vistas para el modelo Municipio.
    Actualmente solo implementa acciones personalizadas.

    Acciones personalizadas:
        - crops_by_point: Obtiene cultivos en un punto geográfico específico.

    """
    queryset = models.Municipio.objects.all()
    serializer_class = serializers.MunicipioSerializer

    @action(detail=False, methods=['get'])
    def crops_by_point(self, request):
        """
        Obtiene los cultivos en un punto geográfico específico.

        Parámetros de consulta:
            - point (str): Coordenadas de latitud y longitud en formato 'latitud,longitud'.
            - cultivo (int): Identificador del cultivo a filtrar.

        Returns:
            - JSON con información del municipio y los cultivos en el punto especificado.

        """
        queryset = self.queryset
        # Búsqueda por punto
        point_request = self.request.query_params.get('point', None)
        # Filtro por cultivo
        cultivo_request = self.request.query_params.get('cultivo', None)

        if point_request and cultivo_request:
            latitude, longitude = map(float, point_request.split(','))
            municipio_queryset = queryset.filter(polygon__contains=Point(latitude, longitude))

            if municipio_queryset:
                municipio_instance = municipio_queryset.first()
                cultivos_queryset = models.HistCultivo.objects.filter(municipio=municipio_instance)
                cultivos_queryset = cultivos_queryset.filter(cultivo=cultivo_request).order_by('anio').values()
                cultivos_serializer = serializers.HistCultivoSerializer(cultivos_queryset, many=True)
                municipio_serializer = self.serializer_class(municipio_instance, many=False)
                return Response({"municipio": municipio_serializer.data, "cultivos": cultivos_serializer.data})
            return Response({"error": "no data in point"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "cultivo and point is required."}, status=status.HTTP_400_BAD_REQUEST)

class HistCultivoViewset(viewsets.ModelViewSet):
    """
    Conjunto de vistas para el modelo HistCultivo.

    Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en los registros históricos.
    
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.HistCultivo.objects.all()
    serializer_class = serializers.HistCultivoSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de registros cultivos con filtros opcionales.

        Parámetros de consulta:
            - codmun (str): Código DANE del municipio para filtrar registros.
            - nombre (str): Nombre del cultivo a filtrar.
            - cultivo (int): Identificador del Cultivo en el atlas.

        Returns:
            - Conjunto de registros de cultivos filtrados.

        """
        queryset = self.queryset
        # Filtro por codmun
        codmun_request = self.request.query_params.get('codmun', None)
        # Filtro por nombre
        nombre_request = self.request.query_params.get('nombre', None)
        # Filtro por cultivo
        cultivo_request = self.request.query_params.get('cultivo', None)
        if codmun_request is not None:
            queryset = queryset.filter(municipio=codmun_request).order_by('anio').values()
        if nombre_request is not None:
            queryset = queryset.filter(nombre_cultivo=nombre_request).order_by('anio').values()
        if cultivo_request is not None:
            queryset = queryset.filter(cultivo=cultivo_request).order_by('anio').values()
        return queryset
    
class CultivoViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo Cultivo.

    Esta vista permite realizar operaciones CRUD en objetos Cultivo.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.Cultivo.objects.all()
    serializer_class = serializers.CultivoSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de objetos Cultivo con filtros opcionales.

        Parámetros de consulta:
            - id (int): Identificador único.

        Returns:
            - Conjunto de objetos Cultivo filtrados.

        """
        queryset = self.queryset
        # Filtro por Identificador
        id_request = self.request.query_params.get('id', None)

        if id_request:
            queryset = queryset.filter(id=id_request)
        return queryset
    
class ResiduoViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo Residuo.

    Esta vista permite realizar operaciones CRUD en objetos Residuo.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.Residuo.objects.all()
    serializer_class = serializers.ResiduoSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de objetos Residuo con filtros opcionales.

        Parámetros de consulta:
            - id (int): Identificador único.
            - cultivo (int): Identificador único del cultivo.

        Returns:
            - Conjunto de objetos Residuo filtrados.

        """
        queryset = self.queryset
        # Filtro por Identificador
        id_request = self.request.query_params.get('id', None)
        # Filtro por Cultivo
        cultivo_request = self.request.query_params.get('cultivo', None)

        if id_request:
            queryset = queryset.filter(id=id_request)
        if cultivo_request:
            queryset = queryset.filter(cultivo=cultivo_request)
        return queryset
    
class TecnologiaViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo Tecnologia.

    Esta vista permite realizar operaciones CRUD en objetos Tecnologia.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.Tecnologia.objects.all()
    serializer_class = serializers.TecnologiaSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de objetos Tecnologia con filtros opcionales.

        Parámetros de consulta:
            - id (int): Identificador único.

        Returns:
            - Conjunto de objetos Tecnologia filtrados.

        """
        queryset = self.queryset
        # Filtro por Identificador
        id_request = self.request.query_params.get('id', None)

        if id_request:
            queryset = queryset.filter(id=id_request)
        return queryset
    
class VariableViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo Variable.

    Esta vista permite realizar operaciones CRUD en objetos Variable.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.Variable.objects.all()
    serializer_class = serializers.VariableSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de objetos Variable con filtros opcionales.

        Parámetros de consulta:
            - id (int): Identificador único.
            - tecnologia (int): Identificador único de la tecnologia.

        Returns:
            - Conjunto de objetos Variable filtrados.

        """
        queryset = self.queryset
        # Filtro por Identificador
        id_request = self.request.query_params.get('id', None)
        # Filtro por Tecnologia
        tecnologia_request = self.request.query_params.get('tecnologia', None)

        if id_request:
            queryset = queryset.filter(id=id_request)
        if tecnologia_request:
            queryset = queryset.filter(tecnologia=tecnologia_request)
        return queryset
    
class CropRegressionViewset(viewsets.ModelViewSet):
    """
    Conjunto de vistas para el modelo CropRegressionModel.

    Actualmente solo implementa acciones personalizadas.

    Acciones personalizadas:
        - production: Permite realizar inferencias sobre el modelo que predice producción con base en área sembrada.

    """
    queryset = models.CropRegressionModel.objects.all()
    serializer_class = serializers.CropRegressionSerializer

    @action(detail=False, methods=['post'])
    def production(self, request):
        """
        Calcula la producción de cultivos en toneladas utilizando modelos de regresión.

        Parámetros de consulta:
            - cultivo (int): Identificador del cultivo del atlas.
            - area (float): Área cultivada para la predicción.

        Returns:
            - JSON con la predicción de producción.

        Errores:
            - HTTP 400 Bad Request: Si los parámetros 'cultivo' y 'area' no se proporcionan.
            - HTTP 400 Bad Request: Si los datos de entrada para los parámetros del modelo son inválidos.
            - HTTP 500 Internal Server Error: Si falla la carga del modelo.

        """
        # ID del cultivo
        cultivo_request = self.request.query_params.get('cultivo', None)
        # Valor de producción
        area_request = self.request.query_params.get('area', None)

        if area_request and cultivo_request:
            try:
                model = self.queryset.get(cultivo=cultivo_request)
                area_value = float(area_request)
                # Carga del modelo
                model_object = joblib.load(f'./media/{model.object}')
                prediction = model_object.predict([[area_value]])[0]
                return JsonResponse({'prediction': prediction if prediction > 0 else 0})
            except ValueError:
                return Response({"error": "Invalid input data for model parameters."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception:
                return Response({"error": "Failed to load model."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "'cultivo' and 'area' are required."}, status=status.HTTP_400_BAD_REQUEST)
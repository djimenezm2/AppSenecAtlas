from django.conf import settings
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    FileField,
    CharField,
    IntegerField,
)
from .models import (
    Projects,
    Indicators,
    ProjectIndicator,
    OriginalPixels,
    Pixels,
    Units,
    Metadata,
)


class ProjectsSerializer(GeoFeatureModelSerializer):
    """
    Serializador para el modelo Projects.

    Este serializador convierte objetos Projects en representaciones GeoJSON.

    Campos:
        extent (PolygonField): Campo geográfico que almacena la extensión geográfica del proyecto.
        pixel_size (IntegerField): Tamaño de píxel del proyecto.

    """

    class Meta:
        model = Projects
        # If all fields: fields = '__all__'
        fields = ("extent", "pixel_size")
        geo_field = "extent"


class UnitsSerializer(ModelSerializer):
    """
    Serializador para el modelo Units.

    Este serializador convierte objetos Units en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """

    class Meta:
        model = Units
        fields = "__all__"


class IndicatorsSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    layer = serializers.SerializerMethodField()

    class Meta:
        model = Indicators
        fields = "__all__"

    def get_thumbnail(self, obj):
        request = self.context.get('request')
        if request:
            if settings.DEBUG:
                # Desarrollo: devolver URL absoluta
                return request.build_absolute_uri(obj.thumbnail.url)
            else:
                # Producción: devolver ruta relativa
                return obj.thumbnail.url
        return obj.thumbnail.url

    def get_layer(self, obj):
        request = self.context.get('request')
        if request and obj.layer:
            if settings.DEBUG:
                return request.build_absolute_uri(obj.layer.url)
            else:
                return obj.layer.url
        return obj.layer.url if obj.layer else None


class ProjectIndicatorSerializer(ModelSerializer):
    """
    Serializador para el modelo ProjectIndicator.

    Este serializador convierte objetos ProjectIndicator en representaciones JSON.

    Campos:
        weight (IntegerField): Peso de la relación.
        project (ForeignKey): Relación con el proyecto asociado.
        indicator (ForeignKey): Relación con el indicador asociado.

    """

    class Meta:
        model = ProjectIndicator
        fields = ("weight", "project", "indicator")


class OriginalPixelsSerializer(GeoFeatureModelSerializer):
    """
    Serializador para el modelo OriginalPixels.

    Este serializador convierte objetos OriginalPixels en representaciones GeoJSON.

    Campos:
        location (PointField): Campo geográfico que almacena la ubicación geográfica del píxel.
        value (FloatField): Valor del píxel.

    """

    class Meta:
        model = OriginalPixels
        fields = ("location", "value")
        geo_field = "location"


class PixelsSerializer(GeoFeatureModelSerializer):
    """
    Serializador para el modelo Pixels.

    Este serializador convierte objetos Pixels en representaciones GeoJSON.

    Campos:
        location (PointField): Campo geográfico que almacena la ubicación geográfica del píxel.
        value (FloatField): Valor del píxel.

    """

    class Meta:
        model = Pixels
        fields = ("location", "value")
        geo_field = "location"


class MetadataSerializer(ModelSerializer):
    """
    Serializador para el modelo Metadata.

    Este serializador convierte objetos Metadata en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """

    class Meta:
        model = Metadata
        fields = "__all__"


class FileUploadSerializer(Serializer):
    """
    Serializador para la carga de archivos.

    Este serializador se utiliza para cargar archivos TIFF y procesarlos con QGIS.

    Campos:
        file (FileField): Campo para cargar un archivo.

    """

    file = FileField()


class AdderSerializer(Serializer):
    """
    Serializador para el procesamiento de imágenes TIFF.

    Este serializador se utiliza para procesar las capas correspondientes con QGIS.

    Campos:
        file_path (CharField): Ubicación del archivo en servidor.
        indicator_id (IntegerField): Identificador único del nuevo indicador

    """

    file_path = CharField()
    indicator_id = IntegerField()


class AnalyzeSerializer(Serializer):
    """
    Serializador para el análisis de capas.

    Este serializador se utiliza para cargar un formulario y
    procesar las capas correspondientes con QGIS.

    Campos:
        indicator_id (IntegerField): Identificador del indicador.
        name (CharField): Nombre del análisis
        cell_size (IntegerField): Tamaño de celda para el análisis
        extent (CharField): Extensión del análisis en formato WKT
        selected_ids (CharField): Lista separada por comas de identificadores de indicadores
        weights (CharField): Lista separada por comas de pesos por indicador
        relations (CharField): Lista separada por comas de relación de cada indicador (0:directa, 1:inversa)

    """

    #indicator_id = IntegerField() # Ya no es necesario, se obtiene automáticamente en el backend
    name = CharField()
    cell_size = IntegerField()
    extent = CharField()
    selected_ids = CharField()
    weights = CharField()
    relations = CharField()

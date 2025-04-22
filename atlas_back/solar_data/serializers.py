from rest_framework.serializers import ModelSerializer
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import HistDay, HistHour, HistMonth, HistYear, Elevation, Limits

class HistDaySerializer(ModelSerializer):
    """
    Serializador para el modelo HistDay.

    Este serializador convierte objetos HistDay en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = HistDay
        fields = '__all__'

class HistHourSerializer(ModelSerializer):
    """
    Serializador para el modelo HistHour.

    Este serializador convierte objetos HistHour en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = HistHour
        fields = '__all__'

class HistMonthSerializer(ModelSerializer):
    """
    Serializador para el modelo HistMonth.

    Este serializador convierte objetos HistMonth en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = HistMonth
        fields = '__all__'

class HistYearSerializer(ModelSerializer):
    """
    Serializador para el modelo HistYear.

    Este serializador convierte objetos HistYear en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = HistYear
        fields = '__all__'

class HistYearPixelsSerializer(GeoFeatureModelSerializer):
    """
    Serializador para el modelo HistYear con representación geoespacial.

    Este serializador convierte objetos HistYear en representaciones GeoJSON.

    Campos:
        Todos los campos del modelo (todas las variables metereológicas).

    """
    class Meta:
        model = HistYear
        fields = '__all__'
        geo_field = 'location'

class ElevationSerializer(ModelSerializer):
    """
    Serializador para el modelo Elevation.

    Este serializador convierte objetos Elevation en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = Elevation
        fields = '__all__'

class LimitsSerializer(ModelSerializer):
    """
    Serializador para el modelo Limits.

    Este serializador convierte objetos Limits en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = Limits
        fields = '__all__'
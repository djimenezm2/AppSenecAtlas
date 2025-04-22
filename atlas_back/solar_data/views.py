from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.gis.geos import Point
from rest_framework_gis.filters import InBBoxFilter
from django.contrib.gis.geos import GEOSGeometry

from . import models
from . import serializers

class HistDayViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo HistDay.

    Esta vista permite realizar operaciones CRUD en objetos HistDay.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.HistDay.objects.all()
    serializer_class = serializers.HistDaySerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de datos históricos diarios con filtros opcionales.

        Parámetros de consulta:
            - point (str): Coordenadas geográficas en formato "latitud,longitud".
            - year (int): Año.
            - day (int): Día del año.
        
        Returns:
            - Conjunto de datos históricos por día filtrados.

        """
        queryset = self.queryset
        # Búsqueda por punto
        point_request = self.request.query_params.get('point', None)
        # Filtro por anio
        year_request = self.request.query_params.get('year', None)
        # Filtro por dia
        day_request = self.request.query_params.get('day', None)

        if point_request:
            latitude, longitude = map(float, point_request.split(','))
            queryset = queryset.filter(location=Point(latitude, longitude))
        if year_request:
            queryset = queryset.filter(year=year_request).order_by('day').values()
        if day_request:
            queryset = queryset.filter(day=day_request).order_by('day').values()
        return queryset
        
class HistHourViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo HistHour.

    Esta vista permite realizar operaciones CRUD en objetos HistHour.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.HistHour.objects.all()
    serializer_class = serializers.HistHourSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de datos históricos por hora con filtros opcionales.

        Parámetros de consulta:
            - point (str): Coordenadas geográficas en formato "latitud,longitud".
            - year (int): Año.
            - hour (int): Hora del día (0 a 23).

        Returns:
            - Conjunto de datos históricos por hora filtrados.

        """
        queryset = self.queryset
        # Búsqueda por punto
        point_request = self.request.query_params.get('point', None)
        # Filtro por anio
        year_request = self.request.query_params.get('year', None)
        # Filtro por hora
        hour_request = self.request.query_params.get('hour', None)

        if point_request: 
            latitude, longitude = map(float, point_request.split(','))
            queryset = queryset.filter(location=Point(latitude, longitude))
        if year_request:
            queryset = queryset.filter(year=year_request).order_by('hour').values()
        if hour_request:
            queryset = queryset.filter(hour=hour_request).order_by('hour').values()
        return queryset

class HistMonthViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo HistMonth.

    Esta vista permite realizar operaciones CRUD en objetos HistMonth.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.HistMonth.objects.all()
    serializer_class = serializers.HistMonthSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de datos históricos por mes con filtros opcionales.

        Parámetros de consulta:
            - point (str): Coordenadas geográficas en formato "latitud,longitud".
            - year (int): Año.
            - month (int): Mes del año.

        Returns:
            - Conjunto de datos históricos por mes filtrados.

        """
        queryset = self.queryset
        # Búsqueda por punto
        point_request = self.request.query_params.get('point', None)
        # Filtro por anio
        year_request = self.request.query_params.get('year', None)
        # Filtro por mes
        month_request = self.request.query_params.get('month', None)

        if point_request:
            latitude, longitude = map(float, point_request.split(','))
            queryset = queryset.filter(location=Point(latitude, longitude))
        if year_request:
            queryset = queryset.filter(year=year_request).order_by('month').values()
        if month_request:
            queryset = queryset.filter(month=month_request).order_by('month').values()
        return queryset

class HistYearViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo HistYear.

    Esta vista permite realizar operaciones CRUD en objetos HistYear.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.HistYear.objects.all()
    serializer_class = serializers.HistYearSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de datos históricos anuales con filtros opcionales.

        Parámetros de consulta:
            - point (str): Coordenadas geográficas en formato "latitud,longitud".
            - year (int): Año.

        Returns:
            - Conjunto de datos históricos anuales filtrados.

        """
        queryset = self.queryset
        # Búsqueda por punto
        point_request = self.request.query_params.get('point', None)
        # Filtro por anio
        year_request = self.request.query_params.get('year', None)

        if point_request:
            latitude, longitude = map(float, point_request.split(','))
            queryset = queryset.filter(location=Point(latitude, longitude)).order_by('year').values()
        if year_request:
            queryset = queryset.filter(year=year_request)
        return queryset
        
class HistYearPixelsViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo HistYear con representación geoespacial.

    Esta vista permite realizar operaciones CRUD en objetos HistYear con información geoespacial.
    Acciones personalizadas:
        - draw: Retorna datos de píxeles como GeoJSON.

    """
    queryset = models.HistYear.objects.all()
    serializer_class = serializers.HistYearPixelsSerializer
    filter_backends = (InBBoxFilter,)
    
    @action(detail=False, methods=["post"])
    def draw(self, request):
        """
        Obtiene el conjunto de datos históricos anuales con filtros opcionales.

        Parámetros de consulta:
            - year (int): Año de registro.
            - in (str): Coordenadas geográficas en formato GeoJSON.

        Returns:
            - Conjunto de datos históricos anuales filtrados, en formato GeoJSON.

        """
        queryset = self.queryset
        # Filtro por anio
        year_request = request.data.get("year", None)
        if year_request is not None:
            queryset = queryset.filter(year=year_request)
        # Filtro por área
        in_request = request.data.get("in", None)
        if in_request:
            area_geometry = GEOSGeometry(in_request)
            queryset = queryset.filter(location__within=area_geometry)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class ElevationViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo Elevation.

    Esta vista permite realizar operaciones CRUD en objetos Elevation.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.Elevation.objects.all()
    serializer_class = serializers.ElevationSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de datos de elevación con filtros opcionales.

        Parámetros de consulta:
            - point (str): Coordenadas geográficas en formato "latitud,longitud".

        Returns:
            - Conjunto de datos de elevación filtrados.

        """
        queryset = self.queryset
        # Búsqueda por punto
        point_request = self.request.query_params.get('point', None)

        if point_request:
            latitude, longitude = map(float, point_request.split(','))
            queryset = queryset.filter(location=Point(latitude, longitude)).order_by('year').values()
        return queryset
        
class LimitsViewset(viewsets.ModelViewSet):
    """
    Vista para el modelo Limits.

    Esta vista permite realizar operaciones CRUD en objetos Limits.
    Actualmente solo implementa Leer (GET).

    """
    queryset = models.Limits.objects.all()
    serializer_class = serializers.LimitsSerializer

    def get_queryset(self):
        """
        Obtiene el conjunto de datos de límites con filtros opcionales.

        Parámetros de consulta:
            - year (int): Año.

        Returns:
            - Conjunto de datos de límites filtrados.

        """
        queryset = self.queryset
        # Filtro por anio
        year_request = self.request.query_params.get('year', None)

        if year_request:
            queryset = queryset.filter(year=year_request)
        return queryset

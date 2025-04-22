from django.contrib.gis.db import models

class HistDay(models.Model):
    """
    Modelo que representa datos históricos diarios de irradiación solar y clima.

    Attributes:
        ghi (FloatField): irradiación global horizontal.
        dhi (FloatField): irradiación difusa horizontal.
        dni (FloatField): irradiación directa normal.
        wind_speed (FloatField): Velocidad del viento.
        temperature (FloatField): Temperatura.
        solar_zenith_angle (FloatField): Ángulo cenital solar.
        year (IntegerField): Año.
        day (IntegerField): Día del año.
        location (PointField): Coordenadas geográficas.

    """
    ghi = models.FloatField(primary_key=True)
    dhi = models.FloatField()
    dni = models.FloatField()
    wind_speed = models.FloatField()
    temperature = models.FloatField()
    solar_zenith_angle = models.FloatField()
    year = models.IntegerField()
    day = models.IntegerField()
    location = models.PointField(geography=True, srid=4326)

    class Meta:
        managed = False
        db_table = u'"solar\".\"hist_day"'

class HistHour(models.Model):
    """
    Modelo que representa datos históricos por hora de irradiación solar y clima.

    Attributes:
        id (IntegerField): Identificador único.
        ghi (FloatField): irradiación global horizontal.
        dhi (FloatField): irradiación difusa horizontal.
        dni (FloatField): irradiación directa normal.
        wind_speed (FloatField): Velocidad del viento.
        temperature (FloatField): Temperatura.
        solar_zenith_angle (FloatField): Ángulo cenital solar.
        year (IntegerField): Año.
        hour (IntegerField): Hora del día.
        location (PointField): Coordenadas geográficas.

    """
    id = models.IntegerField(primary_key=True)
    ghi = models.FloatField()
    dhi = models.FloatField()
    dni = models.FloatField()
    wind_speed = models.FloatField()
    temperature = models.FloatField()
    solar_zenith_angle = models.FloatField()
    year = models.IntegerField()
    hour = models.IntegerField()
    location = models.PointField(geography=True, srid=4326)

    class Meta:
        managed = False
        db_table = u'"solar\".\"hist_hour"'

class HistMonth(models.Model):
    """
    Modelo que representa datos históricos mensuales de irradiación solar y clima.

    Attributes:
        id (IntegerField): Identificador único.
        ghi (FloatField): irradiación global horizontal.
        dhi (FloatField): irradiación difusa horizontal.
        dni (FloatField): irradiación directa normal.
        wind_speed (FloatField): Velocidad del viento.
        temperature (FloatField): Temperatura.
        solar_zenith_angle (FloatField): Ángulo cenital solar.
        year (IntegerField): Año.
        month (IntegerField): Mes del año.
        location (PointField): Coordenadas geográficas.

    """
    id = models.IntegerField(primary_key=True)
    ghi = models.FloatField()
    dhi = models.FloatField()
    dni = models.FloatField()
    wind_speed = models.FloatField()
    temperature = models.FloatField()
    solar_zenith_angle = models.FloatField()
    year = models.IntegerField()
    month = models.IntegerField()
    location = models.PointField(geography=True, srid=4326)

    class Meta:
        managed = False
        db_table = u'"solar\".\"hist_month"'

class HistYear(models.Model):
    """
    Modelo que representa datos históricos anuales de irradiación solar y clima.

    Attributes:
        id (IntegerField): Identificador único.
        ghi (FloatField): irradiación global horizontal.
        dhi (FloatField): irradiación difusa horizontal.
        dni (FloatField): irradiación directa normal.
        wind_speed (FloatField): Velocidad del viento.
        temperature (FloatField): Temperatura.
        solar_zenith_angle (FloatField): Ángulo cenital solar.
        year (IntegerField): Año.
        location (PointField): Coordenadas geográficas.

    """
    id = models.IntegerField(primary_key=True)
    ghi = models.FloatField()
    dhi = models.FloatField()
    dni = models.FloatField()
    wind_speed = models.FloatField()
    temperature = models.FloatField()
    solar_zenith_angle = models.FloatField()
    year = models.IntegerField()
    location = models.PointField(geography=True, srid=4326)

    class Meta:
        managed = False
        db_table = u'"solar\".\"hist_year"'

class Elevation(models.Model):
    """
    Modelo que representa datos de elevación geográfica.

    Attributes:
        id (IntegerField): Identificador único.
        location (PointField): Coordenadas geográficas.
        elevation (FloatField): Elevación geográfica.

    """
    id = models.IntegerField(primary_key=True)
    location = models.PointField(geography=True, srid=4326)
    elevation = models.FloatField()

    class Meta:
        managed = False
        db_table = u'"solar\".\"elevation"'

class Limits(models.Model):
    """
    Modelo que representa límites mínimos y máximos por variable para datos históricos.

    Attributes:
        id (IntegerField): Identificador único.
        year (IntegerField): Año de los límites.
        ghi_min (FloatField): Valor mínimo de irradiación global horizontal.
        ghi_max (FloatField): Valor máximo de irradiación global horizontal.
        dhi_min (FloatField): Valor mínimo de irradiación difusa horizontal.
        dhi_max (FloatField): Valor máximo de irradiación difusa horizontal.
        dni_min (FloatField): Valor mínimo de irradiación directa normal.
        dni_max (FloatField): Valor máximo de irradiación directa normal.
        temperature_min (FloatField): Temperatura mínima.
        temperature_max (FloatField): Temperatura máxima.
        wind_speed_min (FloatField): Velocidad del viento mínima.
        wind_speed_max (FloatField): Velocidad del viento máxima.
        solar_zenith_angle_min (FloatField): Ángulo cenital solar mínimo.
        solar_zenith_angle_max (FloatField): Ángulo cenital solar máximo.

    """
    id = models.IntegerField(primary_key=True)
    year = models.IntegerField()
    ghi_min = models.FloatField()
    ghi_max = models.FloatField()
    dhi_min = models.FloatField()
    dhi_max = models.FloatField()
    dni_min = models.FloatField()
    dni_max = models.FloatField()
    temperature_min = models.FloatField()
    temperature_max = models.FloatField()
    wind_speed_min = models.FloatField()
    wind_speed_max = models.FloatField()
    solar_zenith_angle_min = models.FloatField()
    solar_zenith_angle_max = models.FloatField()

    class Meta:
        managed = False
        db_table = u'"solar\".\"limits"'
from django.contrib.gis.db import models

class Municipio(models.Model):
    """
    Modelo que representa municipios de Colombia.

    Attributes:
        id (AutoField): Identificador único del municipio. Corresponde al código DANE.
        departamento (TextField): Nombre del departamento al que pertenece el municipio.
        municipio (TextField): Nombre del municipio.
        polygon (PolygonField): Campo geográfico que almacena la extensión del municipio.

    """
    id = models.BigAutoField(primary_key=True)
    departamento = models.TextField()
    municipio = models.TextField()
    polygon = models.PolygonField(geography=True, srid=4326)

    class Meta:
        managed = False
        db_table = u'"biomass\".\"municipio"'

class Cultivo(models.Model):
    """
    Modelo que representa cultivos en el atlas.

    Attributes:
        id (AutoField): Identificador único del cultivo.
        nombre (TextField): Nombre del cultivo.

    """
    id = models.BigAutoField(primary_key=True)
    nombre = models.TextField()

    class Meta:
        managed = True
        db_table = u'"biomass\".\"cultivo"'

class HistCultivo(models.Model):
    """
    Modelo que representa información histórica sobre cultivos en un municipio.

    Attributes:
        id (AutoField): Identificador único del registro histórico.
        cultivo (ForeignKey): Relación con el cultivo del atlas.
        municipio (ForeignKey): Relación con el municipio al que pertenece el cultivo.
        grupo_cultivo (TextField): Grupo al que pertenece el cultivo.
        subgrupo (TextField): Subgrupo del cultivo.
        nombre_cultivo (TextField): Nombre del cultivo.
        des_cultivo (TextField): Desagregación del cultivo.
        anio (IntegerField): Año del registro del cultivo.
        periodo (TextField): Período del registro del cultivo.
        area_sembrada (FloatField): Área sembrada en hectáreas.
        area_cosechada (FloatField): Área cosechada en hectáreas.
        produccion (FloatField): Producción del cultivo en toneladas.
        rendimiento (FloatField): Rendimiento del cultivo en toneladas.
        ciclo (TextField): Ciclo de cultivo.

    """
    id = models.BigAutoField(primary_key=True)
    cultivo = models.ForeignKey(Cultivo, models.DO_NOTHING)
    municipio = models.ForeignKey(Municipio, models.DO_NOTHING)
    grupo_cultivo = models.TextField()
    subgrupo = models.TextField()
    nombre_cultivo = models.TextField()
    des_cultivo = models.TextField()
    anio = models.IntegerField()
    periodo = models.TextField()
    area_sembrada = models.FloatField()
    area_cosechada = models.FloatField()
    produccion = models.FloatField()
    rendimiento = models.FloatField()
    ciclo = models.TextField()

    class Meta:
        managed = False
        db_table = u'"biomass\".\"hist_cultivo"'

class Residuo(models.Model):
    """
    Modelo que representa residuos del cultivo.

    Attributes:
        id (AutoField): Identificador único del residuo.
        cultivo (ForeignKey): Relación con el cultivo al que pertenece el residuo.
        nombre (TextField): Nombre del residuo.
        c (FloatField): Fracción másica en base seca de Carbono.
        h (FloatField): Fracción másica en base seca de Hidrógeno.
        o (FloatField): Fracción másica en base seca de Oxígeno.
        n (FloatField): Fracción másica en base seca de Nitrógeno.
        s (FloatField): Fracción másica en base seca de Azufre.
        ceniza (FloatField): Fracción másica en base seca de ceniza.
        humedad (FloatField): contenido de humedad.
        fraccion (FloatField): Fracción másica del residuo.

    """
    id = models.BigAutoField(primary_key=True)
    cultivo = models.ForeignKey(Cultivo, models.DO_NOTHING)
    nombre = models.TextField()
    c = models.FloatField()
    h = models.FloatField()
    o = models.FloatField()
    n = models.FloatField()
    s = models.FloatField()
    ceniza = models.FloatField()
    humedad = models.FloatField()
    fraccion = models.FloatField()

    class Meta:
        managed = True
        db_table = u'"biomass\".\"residuo"'

class Tecnologia(models.Model):
    """
    Modelo que representa tecnologías de transformación de residuos.

    Attributes:
        id (AutoField): Identificador único de la tecnología.
        nombre (TextField): Nombre de la tecnología.

    """
    id = models.BigAutoField(primary_key=True)
    nombre = models.TextField()

    class Meta:
        managed = True
        db_table = u'"biomass\".\"tecnologia"'

class Variable(models.Model):
    """
    Modelo que representa variables usadas en tecnologías de transformación de residuos.

    Attributes:
        id (AutoField): Identificador único de la variable.
        tecnologia (ForeignKey): Relación con la tecnología en la que se usa la variable.
        nombre (TextField): Nombre de la variable.
        descripcion (TextField): Descripción de la variable.
        min_value (FloatField): Valor mínimo de la variable.
        max_value (FloatField): Valor máximo de la variable.
        unidad (TextField): Unidades de la variable.

    """
    id = models.BigAutoField(primary_key=True)
    tecnologia = models.ForeignKey(Tecnologia, models.DO_NOTHING)
    nombre = models.TextField()
    descripcion = models.TextField()
    min_value = models.FloatField()
    max_value = models.FloatField()
    unidades = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = u'"biomass\".\"variable"'

class CropRegressionModel(models.Model):
    """
    Modelo que representa modelos entrenados de regresión.

    Attributes:
        id (BigAutoField): Identificador único del modelo de regresión.
        cultivo(ForeignKey): Identificador del cultivo del atlas.
        name (CharField): Nombre del modelo de regresión.
        object (FileField): Campo para almacenar la ruta del archivo del modelo.

    """
    id = models.BigAutoField(primary_key=True)
    cultivo = models.ForeignKey(Cultivo, models.DO_NOTHING)
    name = models.CharField(max_length=100)
    object = models.FileField(upload_to='models')

    class Meta:
        managed = True
        db_table = u'"biomass\".\"regression_model"'
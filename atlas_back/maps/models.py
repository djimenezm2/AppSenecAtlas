from django.contrib.gis.db import models


class Projects(models.Model):
    """
    Modelo que representa proyectos.

    Attributes:
        id (BigAutoField): Identificador único del proyecto.
        extent (PolygonField): Campo geográfico que almacena la extensión geográfica del proyecto.
        pixel_size (IntegerField): Tamaño de píxel del proyecto.

    """

    id = models.BigAutoField(primary_key=True)
    extent = models.PolygonField(geography=True, srid=4326)
    pixel_size = models.IntegerField()

    class Meta:
        managed = False
        db_table = "Projects"


class Units(models.Model):
    """
    Modelo que representa unidades de capas de indicadores.

    Attributes:
        id (BigAutoField): Identificador único de la unidad.
        abbreviation (TextField): Abreviación de la unidad.
        name (TextField): Nombre completo de la unidad

    """

    id = models.BigAutoField(primary_key=True)
    abbreviation = models.TextField()
    name = models.TextField()

    class Meta:
        managed = False
        db_table = "Units"


class Indicators(models.Model):
    """
    Modelo que representa indicadores.

    Attributes:
        id (BigAutoField): Identificador único del indicador.
        name (TextField): Nombre del indicador.
        units (ForeignKey): Unidades del indicador.
        thumbnail (ImageField): Campo para almacenar la ruta de la miniatura del indicador.
        min (FloatField): Valor mínimo del indicador.
        max (FloatField): Valor máximo del indicador.
        palette (TextField): Paleta de colores del indicador.
        pixel_size (FloatField): Valor que relaciona resolución espacial y tamaño de píxel para renderizado en Leaflet.

    """

    id = models.BigAutoField(primary_key=True)
    name = models.TextField()
    units = models.ForeignKey(Units, models.DO_NOTHING)
    thumbnail = models.ImageField(upload_to="images/", default="images/default.png")
    layer = models.FileField(upload_to="layers/", null=True, blank=True)
    min = models.FloatField(null=True, blank=True)
    max = models.FloatField(null=True, blank=True)
    palette = models.TextField(null=True, blank=True)
    pixel_size = models.FloatField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "Indicators"


class ProjectIndicator(models.Model):
    """
    Modelo que representa la relación entre proyectos e indicadores.

    Attributes:
        id (BigAutoField): Identificador único de la relación proyecto-indicador.
        weight (IntegerField): Peso de la relación.
        project (ForeignKey): Relación con el proyecto asociado.
        indicator (ForeignKey): Relación con el indicador asociado.

    """

    id = models.BigAutoField(primary_key=True)
    weight = models.IntegerField()
    project = models.ForeignKey(Projects, models.DO_NOTHING)
    indicator = models.ForeignKey(Indicators, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "ProjectIndicator"


class OriginalPixels(models.Model):
    """
    Modelo que representa píxeles de capas base de Integral.

    Attributes:
        id (BigAutoField): Identificador único del píxel.
        location (PointField): Campo geográfico que almacena la ubicación geográfica del píxel.
        value (FloatField): Valor del píxel.
        indicator (ForeignKey): Relación con el indicador asociado.

    """

    id = models.BigAutoField(primary_key=True)
    location = models.PointField(geography=True, srid=4326)
    value = models.FloatField()
    indicator = models.ForeignKey(Indicators, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "OriginalPixels"


class Pixels(models.Model):
    """
    Modelo que representa píxeles subidos por proveedores.

    Attributes:
        id (BigAutoField): Identificador único del píxel.
        location (PointField): Campo geográfico que almacena la ubicación geográfica del píxel.
        value (FloatField): Valor del píxel.
        indicator (ForeignKey): Relación con el indicador asociado.

    """

    id = models.BigAutoField(primary_key=True)
    location = models.PointField(geography=True, srid=4326)
    value = models.FloatField()
    indicator = models.ForeignKey(Indicators, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "pixels"


class Metadata(models.Model):
    """
    Modelo que representa metadatos de los indicadores.

    Attributes:
        id (BigAutoField): Identificador único de metadatos.
        description (TextField): descripción del indicador asociado.
        authors (TextField): autores del indicador asociado.
        institution (TextField): institución del indicador asociado.
        size (TextField): tamaño del indicador asociado.
        resolution (TextField): resolución del indicador asociado.
        attributes (TextField): atributos del indicador asociado.
        sources (TextField): fuentes del indicador asociado.
        date (DateField): fecha del indicador asociado.
        place (TextField): lugar del indicador asociado.
        indicator (ForeignKey): indicador del indicador asociado.

    """

    id = models.BigAutoField(primary_key=True)
    description = models.TextField()
    authors = models.TextField()
    institution = models.TextField()
    size = models.TextField()
    resolution = models.TextField()
    attributes = models.TextField()
    sources = models.TextField()
    date = models.DateField()
    place = models.TextField()
    indicator = models.ForeignKey(Indicators, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "Metadata"

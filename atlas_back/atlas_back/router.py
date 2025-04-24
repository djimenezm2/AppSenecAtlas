from maps.views import (
    IndicatorsViewset,
    OriginalPixelsViewset,
    PixelsViewset,
    MetadataViewset,
    UnitsViewset,
    FileUploadViewSet,
)
from biomass_data.views import (
    MunicipioViewset,
    HistCultivoViewset,
    CultivoViewset,
    ResiduoViewset,
    TecnologiaViewset,
    VariableViewset,
    CropRegressionViewset,
)
from solar_data.views import (
    HistDayViewset,
    HistHourViewset,
    HistMonthViewset,
    HistYearViewset,
    HistYearPixelsViewset,
    ElevationViewset,
    LimitsViewset,
)
from rest_framework import routers

router = routers.DefaultRouter()
# Integral
router.register("originalpixels", OriginalPixelsViewset)
router.register("pixels", PixelsViewset)
router.register("indicators", IndicatorsViewset)
router.register("metadata", MetadataViewset)
router.register("units", UnitsViewset)
router.register("upload", FileUploadViewSet, basename="file-upload")
# Biomasa
router.register("biomasa/municipios", MunicipioViewset)
router.register("biomasa/cultivos/hist", HistCultivoViewset)
router.register("biomasa/cultivos", CultivoViewset)
router.register("biomasa/residuos", ResiduoViewset)
router.register("biomasa/tecnologias", TecnologiaViewset)
router.register("biomasa/variables", VariableViewset)
router.register("biomasa/inference", CropRegressionViewset)
# Solar
router.register("solar/d", HistDayViewset)
router.register("solar/h", HistHourViewset)
router.register("solar/m", HistMonthViewset)
router.register("solar/y", HistYearViewset, basename="hist_year")
router.register("solar/pixels", HistYearPixelsViewset, basename="hist_year_pixels")
router.register("solar/elevation", ElevationViewset)
router.register("solar/limits", LimitsViewset)

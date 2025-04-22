"""
Model exported as python.
Name : IndicatorAdder_v2
Group : Integral
With QGIS : 33202
"""

import random
from qgis.core import QgsProcessing
from qgis.core import QgsProcessingAlgorithm
from qgis.core import QgsProcessingMultiStepFeedback
from qgis.core import QgsProcessingParameterRasterLayer
from qgis.core import QgsProcessingParameterNumber
from qgis.core import QgsProcessingParameterVectorLayer
from qgis.core import QgsCoordinateReferenceSystem
from qgis.core import (
    QgsDataSourceUri,
    QgsProviderRegistry
)
import processing


class indicator_adder2(QgsProcessingAlgorithm):

    def initAlgorithm(self, config=None):
        self.addParameter(QgsProcessingParameterRasterLayer('input_layer', 'Input layer'))
        self.addParameter(QgsProcessingParameterNumber('indicator_id', 'indicator_id', type=QgsProcessingParameterNumber.Integer, defaultValue=None))
        self.addParameter(QgsProcessingParameterVectorLayer('study_area', 'study area', types=[QgsProcessing.TypeVectorPolygon], defaultValue=None))

    def processAlgorithm(self, parameters, context, model_feedback):
        # Setting database connection
        print("Setting database...")
        uri = QgsDataSourceUri()
        uri.setConnection("localhost", "5432", "Atlas", "proyecto", "integral")
        config = {
            "saveUsername": True,
            "savePassword": True,
            "estimatedMetadata": True,
            "metadataInDatabase": True,
        }

        metadata = QgsProviderRegistry.instance().providerMetadata('postgres')
        connection = metadata.createConnection(uri.uri(), config)
        connection.store("integral")
        print("Setting database... done.")

        # Use a multi-step feedback, so that individual child algorithm progress reports are adjusted for the
        # overall progress through the model
        feedback = QgsProcessingMultiStepFeedback(5, model_feedback)
        results = {}
        outputs = {}

        # Reproject to Pseudo-mercator
        print("Reproject...")
        alg_params = {
            'DATA_TYPE': 0,  # Use Input Layer Data Type
            'EXTRA': '',
            'INPUT': parameters['input_layer'],
            'MULTITHREADING': False,
            'NODATA': None,
            'OPTIONS': '',
            'RESAMPLING': 0,  # Nearest Neighbour
            'SOURCE_CRS': None,
            'TARGET_CRS': QgsCoordinateReferenceSystem('EPSG:4326'),
            'TARGET_EXTENT': None,
            'TARGET_EXTENT_CRS': None,
            'TARGET_RESOLUTION': None,
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['ReprojectToPseudomercator'] = processing.run('gdal:warpreproject', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Reproject... done.")

        feedback.setCurrentStep(1)
        if feedback.isCanceled():
            return {}

        # Clip to study area
        print("Clip...")
        alg_params = {
            'ALPHA_BAND': False,
            'CROP_TO_CUTLINE': True,
            'DATA_TYPE': 0,  # Use Input Layer Data Type
            'EXTRA': '',
            'INPUT': outputs['ReprojectToPseudomercator']['OUTPUT'],
            'KEEP_RESOLUTION': False,
            'MASK': parameters['study_area'],
            'MULTITHREADING': False,
            'NODATA': None,
            'OPTIONS': '',
            'SET_RESOLUTION': False,
            'SOURCE_CRS': None,
            'TARGET_CRS': None,
            'TARGET_EXTENT': None,
            'X_RESOLUTION': None,
            'Y_RESOLUTION': None,
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['ClipToStudyArea'] = processing.run('gdal:cliprasterbymasklayer', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Clip... done.")

        feedback.setCurrentStep(2)
        if feedback.isCanceled():
            return {}

        # Raster pixels to points
        print("To points...")
        alg_params = {
            'FIELD_NAME': 'VALUE',
            'INPUT_RASTER': outputs['ClipToStudyArea']['OUTPUT'],
            'RASTER_BAND': 1,
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['RasterPixelsToPoints'] = processing.run('native:pixelstopoints', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("To points... done.")

        feedback.setCurrentStep(3)
        if feedback.isCanceled():
            return {}

        # add project_indicator_id
        print("Indicator_id...")
        alg_params = {
            'FIELD_LENGTH': 10,
            'FIELD_NAME': 'indicator_id',
            'FIELD_PRECISION': 0,
            'FIELD_TYPE': 1,  # Integer (32 bit)
            'FORMULA': parameters['indicator_id'],
            'INPUT': outputs['RasterPixelsToPoints']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['AddProject_indicator_id'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Indicator_id... done.")

        feedback.setCurrentStep(4)
        if feedback.isCanceled():
            return {}

        # Export to PostGIS
        print("Postigis...")
        alg_params = {
            'ADDFIELDS': False,
            'APPEND': True,
            'A_SRS': None,
            'CLIP': False,
            'DATABASE': 'integral',
            'DIM': 0,  # 2
            'GEOCOLUMN': 'location',
            'GT': '',
            'GTYPE': 3,  # POINT
            'INDEX': False,
            'INPUT': outputs['AddProject_indicator_id']['OUTPUT'],
            'LAUNDER': False,
            'OPTIONS': '',
            'OVERWRITE': False,
            'PK': '',
            'PRECISION': True,
            'PRIMARY_KEY': 'id',
            'PROMOTETOMULTI': True,
            'SCHEMA': 'public',
            'SEGMENTIZE': '',
            'SHAPE_ENCODING': '',
            'SIMPLIFY': '',
            'SKIPFAILURES': False,
            'SPAT': None,
            'S_SRS': None,
            'TABLE': 'pixels',
            'T_SRS': None,
            'WHERE': ''
        }
        outputs['ExportToPostgis'] = processing.run('gdal:importvectorintopostgisdatabaseavailableconnections', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Postigis... done.")

        print("Update Indicators table...")
        indicator_id = parameters['indicator_id']
        min = connection.execSql('SELECT min(value) FROM pixels WHERE indicator_id = {}'.format(indicator_id)).nextRow()[0]
        max = connection.execSql('SELECT max(value) FROM pixels WHERE indicator_id = {}'.format(indicator_id)).nextRow()[0]
        pal = connection.execSql('SELECT code FROM palette WHERE id = {}'.format(random.randint(1, 5))).nextRow()[0]
        sql = 'UPDATE public."Indicators" SET min = {}, max = {}, palette = \'{}\', pixel_size = 0.05 WHERE id = {}'.format(min, max, pal, indicator_id)
        connection.execSql(sql)
        print("Update Indicators table... done.")

        return results

    def name(self):
        return 'indicator_adder2'

    def displayName(self):
        return 'indicator_adder2'

    def group(self):
        return 'Integral'

    def groupId(self):
        return 'Integral'

    def createInstance(self):
        return indicator_adder2()

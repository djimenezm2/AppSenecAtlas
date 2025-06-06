"""
Model exported as python.
Name : Fuzzier
Group : Integral
With QGIS : 33203
"""

from qgis.core import QgsProcessing
from qgis.core import QgsProcessingAlgorithm
from qgis.core import QgsProcessingMultiStepFeedback
from qgis.core import QgsProcessingParameterNumber
from qgis.core import QgsProcessingParameterString
from qgis.core import QgsProcessingParameterGeometry
from qgis.core import QgsCoordinateReferenceSystem
from qgis.core import (
    QgsDataSourceUri,
    QgsProviderRegistry
)

import processing


class Fuzzifier(QgsProcessingAlgorithm):

    def initAlgorithm(self, config=None):
        self.addParameter(QgsProcessingParameterNumber('cellsize', 'cellsize', type=QgsProcessingParameterNumber.Double, minValue=10, maxValue=5000, defaultValue=2000))
        self.addParameter(QgsProcessingParameterNumber('indicator_id', 'indicator_id', type=QgsProcessingParameterNumber.Integer, minValue=0, maxValue=99, defaultValue=1))
        self.addParameter(QgsProcessingParameterNumber('relationship', 'relationship', type=QgsProcessingParameterNumber.Integer, minValue=0, maxValue=1, defaultValue=1))
        self.addParameter(QgsProcessingParameterString('table', 'table', multiLine=False, defaultValue='OriginalPixels'))
        self.addParameter(QgsProcessingParameterString('sql', 'sql', multiLine=False, defaultValue='SELECT * FROM pixels WHERE indicator_id = '))
        self.addParameter(QgsProcessingParameterString('select', 'select', multiLine=False, defaultValue="SELECT 1 AS id, ST_GeomFromText('"))
        self.addParameter(QgsProcessingParameterGeometry('wkt', 'wkt', defaultValue='POLYGON ((-73.329191 9.988462, -73.397491 9.937064, -73.327132 9.85251, -73.241352 9.945687, -73.329191 9.988462))'))
        self.addParameter(QgsProcessingParameterString('end', 'end', multiLine=False, defaultValue="', 4326) AS geom"))

    def processAlgorithm(self, parameters, context, model_feedback):
        # Setting database connection...
        print("Setting database connection...")
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
        print("Setting database connection... done.")

        # Use a multi-step feedback, so that individual child algorithm progress reports are adjusted for the
        # overall progress through the model
        feedback = QgsProcessingMultiStepFeedback(10, model_feedback)
        results = {}
        outputs = {}

        # Create geometry
        print("Create geometry...")
        alg_params = {
            'DATABASE': 'integral',
            'GEOMETRY_FIELD': 'geom',
            'ID_FIELD': 'id',
            'SQL': "SELECT 1 AS id, ST_GeomFromText('{}', 4326) AS geom".format(parameters['wkt']) #QgsExpression('concat(@select, @wkt, @end)').evaluate()
        }
        outputs['CreateGeometry'] = processing.run('qgis:postgisexecuteandloadsql', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Create geometry... done.")

        feedback.setCurrentStep(1)
        if feedback.isCanceled():
            return {}

        # Extract extent
        print("Extract extent...")
        alg_params = {
            'INPUT': outputs['CreateGeometry']['OUTPUT'],
            'ROUND_TO': 0,
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['ExtractExtent'] = processing.run('native:polygonfromlayerextent', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Extract extent... done.")

        feedback.setCurrentStep(2)
        if feedback.isCanceled():
            return {}

        # Read indicator
        print("Read indicator...")
        print("SELECT * FROM {} WHERE indicator_id = {}".format(parameters['table'], parameters['indicator_id']))
        alg_params = {
            'DATABASE': 'integral',
            'GEOMETRY_FIELD': 'location',
            'ID_FIELD': 'id',
            'SQL': "SELECT * FROM {} WHERE indicator_id = {}".format(parameters['table'], parameters['indicator_id'])
        }
        outputs['ReadIndicator'] = processing.run('qgis:postgisexecuteandloadsql', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Read indicator... done.")

        feedback.setCurrentStep(3)
        if feedback.isCanceled():
            return {}

        # Create grid
        print("Create grid...")
        alg_params = {
            'CRS': QgsCoordinateReferenceSystem('EPSG:3857'),
            'EXTENT': outputs['ExtractExtent']['OUTPUT'],
            'HOVERLAY': 0,
            'HSPACING': parameters['cellsize'],
            'TYPE': 2,  # Rectangle (Polygon)
            'VOVERLAY': 0,
            'VSPACING': parameters['cellsize'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['CreateGrid'] = processing.run('native:creategrid', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Create grid... done")

        feedback.setCurrentStep(4)
        if feedback.isCanceled():
            return {}

        # Feed grid
        print("Feed grid...")
        alg_params = {
            'DISCARD_NONMATCHING': True,
            'FIELDS_TO_COPY': ['value'],
            'INPUT': outputs['CreateGrid']['OUTPUT'],
            'INPUT_2': outputs['ReadIndicator']['OUTPUT'],
            'MAX_DISTANCE': parameters['cellsize'],
            'NEIGHBORS': 1,
            'PREFIX': '',
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['FeedGrid'] = processing.run('native:joinbynearest', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Feed grid... done.")

        feedback.setCurrentStep(5)
        if feedback.isCanceled():
            return {}

        # Rasterize grid
        alg_params = {
            'BURN': 0,
            'DATA_TYPE': 5,  # Float32
            'EXTENT': None,
            'EXTRA': '',
            'FIELD': 'value',
            'HEIGHT': parameters['cellsize'],
            'INIT': None,
            'INPUT': outputs['FeedGrid']['OUTPUT'],
            'INVERT': False,
            'NODATA': 0,
            'OPTIONS': '',
            'UNITS': 1,  # Georeferenced units
            'USE_Z': False,
            'WIDTH': parameters['cellsize'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['RasterizeGrid'] = processing.run('gdal:rasterize', alg_params, context=context, feedback=feedback, is_child_algorithm=True)

        feedback.setCurrentStep(6)
        if feedback.isCanceled():
            return {}

        # Fuzzifier
        print("Fuzzifier...")
        min = connection.execSql('SELECT min FROM public."Indicators" WHERE id = {}'.format(parameters['indicator_id'])).nextRow()[0]
        max = connection.execSql('SELECT max FROM public."Indicators" WHERE id = {}'.format(parameters['indicator_id'])).nextRow()[0]
        print("{} and {}".format(min, max))

        if(parameters['relationship'] == 1):
            # Direct fuzzifier
            print("Direct fuzzifier...")
            alg_params = {
                'BAND': 1,
                'FUZZYHIGHBOUND': max,
                'FUZZYLOWBOUND':  min,
                'INPUT': outputs['RasterizeGrid']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
        else:
            # Inverse fuzzifier
            print("Inverse fuzzifier...")
            alg_params = {
                'BAND': 1,
                'FUZZYHIGHBOUND': min,
                'FUZZYLOWBOUND':  max,
                'INPUT': outputs['RasterizeGrid']['OUTPUT'],
                'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
            }
        outputs['DirectFuzzifier'] = processing.run('native:fuzzifyrasterlinearmembership', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Fuzzifier... done")

        feedback.setCurrentStep(7)
        if feedback.isCanceled():
            return {}

        # Raster pixels to points
        print("Raster pixels to points...")
        alg_params = {
            'FIELD_NAME': 'value',
            'INPUT_RASTER': outputs['DirectFuzzifier']['OUTPUT'],
            'RASTER_BAND': 1,
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['RasterPixelsToPoints'] = processing.run('native:pixelstopoints', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Raster pixels to points... done.")

        feedback.setCurrentStep(8)
        if feedback.isCanceled():
            return {}

        # Add indicator_id
        print("Add indicator_id...")
        alg_params = {
            'FIELD_LENGTH': 10,
            'FIELD_NAME': 'indicator_id',
            'FIELD_PRECISION': 0,
            'FIELD_TYPE': 1,  # Integer (32 bit)
            'FORMULA': parameters['indicator_id'],
            'INPUT': outputs['RasterPixelsToPoints']['OUTPUT'],
            'OUTPUT': QgsProcessing.TEMPORARY_OUTPUT
        }
        outputs['AddIndicator_id'] = processing.run('native:fieldcalculator', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Add indicator_id... done.")

        feedback.setCurrentStep(9)
        if feedback.isCanceled():
            return {}

        # Export to PostGIS
        print("Export to PostGIS...")
        alg_params = {
            'ADDFIELDS': False,
            'APPEND': True,
            'CLIP': False,
            'A_SRS': None,
            'DATABASE': 'integral',
            'DIM': 0,  # 2
            'GEOCOLUMN': 'location',
            'GT': '',
            'GTYPE': 3,  # POINT
            'INDEX': False,
            'INPUT': outputs['AddIndicator_id']['OUTPUT'],
            'LAUNDER': False,
            'OPTIONS': '',
            'OVERWRITE': False,
            'PK': 'id',
            'PRECISION': True,
            'PRIMARY_KEY': '',
            'PROMOTETOMULTI': True,
            'SCHEMA': 'public',
            'SEGMENTIZE': '',
            'SHAPE_ENCODING': '',
            'SIMPLIFY': '',
            'SKIPFAILURES': False,
            'SPAT': None,
            'S_SRS': QgsCoordinateReferenceSystem('EPSG:3857'),
            'TABLE': 'fuzzy_view',
            'T_SRS': QgsCoordinateReferenceSystem('EPSG:4326'),
            'WHERE': ''
        }
        outputs['ExportToPostgis'] = processing.run('gdal:importvectorintopostgisdatabaseavailableconnections', alg_params, context=context, feedback=feedback, is_child_algorithm=True)
        print("Export to PostGIS... done.")

        return results

    def name(self):
        return 'fuzzifier'

    def displayName(self):
        return 'fuzzifier'

    def group(self):
        return 'Integral'

    def groupId(self):
        return 'Integral'

    def createInstance(self):
        return Fuzzifier()

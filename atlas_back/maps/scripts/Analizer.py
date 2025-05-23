"""
Model exported as python.
Name : Integral
Group : ProjectAdder
With QGIS : 33203
"""

from qgis.core import QgsProcessingAlgorithm
from qgis.core import QgsProcessingParameterNumber
from qgis.core import QgsProcessingParameterString
from qgis.core import QgsProcessingMultiStepFeedback
from qgis.core import QgsCoordinateReferenceSystem
from qgis.core import (
    QgsDataSourceUri,
    QgsProviderRegistry
)
import processing


class Analizer(QgsProcessingAlgorithm):

    def initAlgorithm(self, config=None):
        self.addParameter(QgsProcessingParameterNumber('cellsize', 'cellsize', type=QgsProcessingParameterNumber.Double, minValue=10, maxValue=5000, defaultValue=2000))
        self.addParameter(QgsProcessingParameterString('wkt',  'wkt',  multiLine=False, defaultValue=''))
        self.addParameter(QgsProcessingParameterString('name', 'name', multiLine=False, defaultValue=''))
        self.addParameter(QgsProcessingParameterString('indicators',    'indicators',    multiLine=False, defaultValue=''))
        self.addParameter(QgsProcessingParameterString('weights',        'weights',        multiLine=False, defaultValue=''))
        self.addParameter(QgsProcessingParameterString('relationships', 'relationships', multiLine=False, defaultValue=''))

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

        feedback = QgsProcessingMultiStepFeedback(1, model_feedback)
        outputs = {}

        # Save project data
        print("Save project data...")
        wkt         = parameters['wkt']
        pixel_size  = parameters['cellsize']
        name        = parameters['name']
        connection.execSql('INSERT INTO public."Projects" (extent, pixel_size, name) VALUES (\'{}\', {}, \'{}\')'.format(wkt, pixel_size, name))
        project_id   = connection.execSql('SELECT max(id) FROM public."Projects"').nextRow()[0]
        indicator_id = connection.execSql('SELECT max(id) FROM public."Indicators"').nextRow()[0]
        print(indicator_id)
        print("Save project data... done.")

        # Feed project_indicator table
        print("Feed project_indicator table...")
        arr_indicators      = parameters["indicators"].split(",")
        arr_relationships   = parameters["relationships"].split(",")
        arr_weights         = parameters["weights"].split(",")

        for i, indicator in enumerate(arr_indicators):
            relationship = bool(int(arr_relationships[i]))
            weight       = float(arr_weights[i])
            sql = 'INSERT INTO public."ProjectIndicator" (project_id, indicator_id, weight, relationship) VALUES ({},{},{},{})'.format(project_id, indicator, weight, relationship)
            connection.execSql(sql)
        print("Feed project_indicator table... done.")

        # PostgreSQL execute and load SQL
        print("PostgreSQL execute and load SQL...")
        total = sum([int(i) for i in arr_weights])
        sql = """
            INSERT INTO pixels (location, value, indicator_id) SELECT
                location, sum(weighted_value) / {} AS value, {} AS indicator_id 
            FROM (
                    SELECT 
                        location, value, weight, value * weight AS weighted_value, f.indicator_id, project_id
                    FROM 
                        fuzzy_view AS f
                    JOIN 
                        public."ProjectIndicator" AS pi
                    ON 
                        pi.project_id = {} AND pi.indicator_id = f.indicator_id
                ) AS W
            GROUP BY
                location
        """.format(total, indicator_id, project_id)
        connection.execSql(sql)
        print("PostgreSQL execute and load SQL... done.")

        palette = "#d7191c,#df382b,#e75839,#ef7748,#f79656,#fdb266,#fec37a,#fed48e,#fee5a2,#fff6b6,#f6fbb7,#e3f3a5,#d0eb93,#bde381,#abdb6f,#90ce64,#72c05b,#55b252,#37a44a,#1a9641"
        sql = 'UPDATE public."Indicators" SET min = 0, max = 1, palette = \'{}\', pixel_size = 0.04 WHERE id = {}'.format(palette, indicator_id)
        connection.execSql(sql)
        
        print(project_id)
        print(indicator_id)
        
        return {}

    def name(self):
        return 'analyzer'

    def displayName(self):
        return 'analyzer'

    def group(self):
        return 'Integral'

    def groupId(self):
        return 'Integral'

    def createInstance(self):
        return Analizer()

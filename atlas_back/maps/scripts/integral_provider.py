from qgis.core import QgsProcessingProvider

from indicator_adder import indicator_adder
from indicator_adder2 import indicator_adder2    
from direct_fuzzifier import Fuzzifier
from Analizer import Analizer
# adding more algorithms...

class IntegralProvider(QgsProcessingProvider):

    # Add the algorithms we export from models...
    def loadAlgorithms(self, *args, **kwargs):
        self.addAlgorithm(Analizer()) # check imports...
        self.addAlgorithm(Fuzzifier()) # check imports...
        self.addAlgorithm(indicator_adder2()) # check imports...
        self.addAlgorithm(indicator_adder()) # check imports...

    def id(self, *args, **kwargs):
        """Used for identifying the provider.

        This string should be a unique, short, character only string,
        eg "qgis" or "gdal". This string should not be localised.
        """
        return 'integral_provider'

    def name(self, *args, **kwargs):
        """
        This string should be as short as possible (e.g. "Lastools", not
        "Lastools version 1.0.1 64-bit") and localised.
        """
        return self.tr('Integral')

    def icon(self):
        """Should return a QIcon which is used for your provider inside
        the Processing toolbox.
        """
        return QgsProcessingProvider.icon(self)


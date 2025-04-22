import sys
sys.path.insert(0,"/usr/lib/python3/dist-packages")
from qgis.core import (
     QgsApplication, 
     QgsRasterLayer,
     QgsVectorLayer
)
import argparse
 
parser = argparse.ArgumentParser(description="Adding new indicator model/script", formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument("-r", "--raster_path", help="Path to the raster indicator.")
parser.add_argument("-i", "--indicator_id", help="Reference key to the indicator table.")
args = parser.parse_args()
config = vars(args)
print(config)

# For a default installation via 'apt install' the prefix is '/usr',
# See https://gis.stackexchange.com/a/155852/4972 for more details...
QgsApplication.setPrefixPath('/usr', True)
qgs = QgsApplication([], False)
qgs.initQgis()

# Append the path where processing plugin can be found,
# For a default installation via 'apt install' it is...
sys.path.append('/usr/lib/qgis')
sys.path.append('/usr/share/qgis/python/plugins')

import processing
from processing.core.Processing import Processing
Processing.initialize()

# Add integral provider...
from integral_provider import IntegralProvider
provider = IntegralProvider()
QgsApplication.processingRegistry().addProvider(provider)

# Run integral model...
input_layer = QgsRasterLayer(config["raster_path"], "layer", "gdal")
study_area  = QgsVectorLayer("/home/proyecto/atlas/atlas_back/media/uploads/oilpalm_cells.gpkg|layername=municipalities", "layer", "ogr")
params = {
    "input_layer": input_layer,
    "indicator_id": config["indicator_id"],
    "study_area": study_area
}
processing.run("integral_provider:indicator_adder2", params)


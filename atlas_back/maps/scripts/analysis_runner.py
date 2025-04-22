import sys
sys.path.insert(0,"/usr/lib/python3/dist-packages")
from qgis.core import (
    QgsApplication,
    QgsDataSourceUri,
    QgsProviderRegistry
)
from qgis.analysis import QgsNativeAlgorithms
import argparse
 
parser = argparse.ArgumentParser(description="Adding new indicator model/script", formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument("-n", "--name",          help="Name of this analysis.")
parser.add_argument("-c", "--cellsize",      help="New cell size for the analysis.")
parser.add_argument("-k", "--wkt",           help="New extent for the analysis.")
parser.add_argument("-i", "--indicator_ids", help="List of reference keys to the indicator table.")
parser.add_argument("-w", "--weights",       help="List of weights for each indicator.")
parser.add_argument("-r", "--relationships", help="List of relationships for each indicator.")
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
QgsApplication.processingRegistry().addProvider(QgsNativeAlgorithms())

# Add integral provider...
from integral_provider import IntegralProvider
provider = IntegralProvider()
QgsApplication.processingRegistry().addProvider(provider)

# Extracting data per each indicator...
arr_indicators      = config["indicator_ids"].split(",")
arr_relationships   = config["relationships"].split(",")

print("Setting database connection...")
uri = QgsDataSourceUri()
uri.setConnection("localhost", "5432", "Atlas", "proyecto", "integral")
configdb = {
    "saveUsername": True,
    "savePassword": True,
    "estimatedMetadata": True,
    "metadataInDatabase": True,
}

metadata = QgsProviderRegistry.instance().providerMetadata('postgres')
connection = metadata.createConnection(uri.uri(), configdb)
connection.execSql('TRUNCATE TABLE fuzzy_view')
print("Setting database connection... done.")

# Run analysis model...
for i, indicator_id in enumerate(arr_indicators):
    if(int(indicator_id) < 15):
        table = '"OriginalPixels"'
    else: 
        table = 'pixels'
    relationship = int(arr_relationships[i])
    params = {
        "indicator_id": indicator_id,
        "cellsize":     config["cellsize"],
        "wkt":          config["wkt"],
        "table":        table,
        "relationship": relationship
    }
    processing.run("integral_provider:fuzzifier", params)

params = {
    "cellsize":         config["cellsize"],
    "wkt":              config["wkt"],
    "name":             config["name"],
    "indicators":       config["indicator_ids"],
    "weights":          config["weights"],
    "relationships":    config["relationships"]
}
processing.run("integral_provider:analyzer", params)

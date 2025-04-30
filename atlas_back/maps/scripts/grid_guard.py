from django.contrib.gis.geos import GEOSGeometry
import os


def estimate_cell_count(wkt: str, cell_size_m: float) -> int:
    """
        Estimates the number of grid cells based on the WKT geometry and cell size.
        This function takes a WKT string representing a geometry and a cell size in meters,
        and calculates the estimated number of grid cells that would fit within the geometry.

        Args:
            - wkt (str): WKT of the geometry.
            - cell_size_m (float): Cell size in meters.

        Returns:
            - int: Estimated number of grid cells.
    """

    geom = GEOSGeometry(wkt, srid=4326)
    geom.transform(3857)
    area_m2 = geom.area
    num_celdas = area_m2 / (cell_size_m ** 2)
    return int(num_celdas)


def validate_cells(wkt: str, cell_size_m: float, num_capas: int) -> (bool, dict):
    """
        Validates the number of grid cells based on the WKT geometry, cell size, and number of layers.
        This function checks if the estimated number of grid cells exceeds a predefined limit.

        Args:
            - wkt (str): WKT of the geometry.
            - cell_size_m (float): Cell size in meters.
            - num_capas (int): Number of layers.

        Returns:
            - bool: True if the number of grid cells exceeds the limit, False otherwise.
            - dict: Information about the number of cells, layers, and total operations.
    """

    LIMITE_CELDAS = int(os.environ.get("MAX_GRID_CELLS", 5000000)) # Defaults to 5 million cells max

    num_celdas = estimate_cell_count(wkt, cell_size_m)
    total_operaciones = num_celdas * num_capas
    block = total_operaciones > LIMITE_CELDAS

    info = {
        "num_celdas": num_celdas,
        "num_capas": num_capas,
        "total_operaciones": total_operaciones,
        "limite": LIMITE_CELDAS,
    }

    return block, info

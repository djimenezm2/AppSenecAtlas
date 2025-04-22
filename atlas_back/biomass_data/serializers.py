from rest_framework.serializers import ModelSerializer
from .models import Municipio, HistCultivo, Cultivo, Residuo, Tecnologia, Variable, CropRegressionModel

class MunicipioSerializer(ModelSerializer):
    """
    Serializador para el modelo Municipio.

    Este serializador convierte objetos Municipio en representaciones JSON.

    Campos:
        id (int): Identificador único del municipio.
        departamento (str): Nombre del departamento al que pertenece el municipio.
        municipio (str): Nombre del municipio.

    """
    class Meta:
        model = Municipio
        fields = ('id', 'departamento', 'municipio')

class HistCultivoSerializer(ModelSerializer):
    """
    Serializador para el modelo HistCultivo.

    Este serializador convierte objetos HistCultivo en representaciones JSON.

    Campos:
        anio (int): Año del registro del cultivo.
        periodo (str): Período del registro del cultivo.
        municipio_id (int): Código del municipio del registro.
        nombre_cultivo (str): Nombre del cultivo.
        area_sembrada (float): Área sembrada en hectáreas.
        area_cosechada (float): Área cosechada en hectáreas.
        produccion (float): Producción del cultivo en toneladas.
        rendimiento (float): Rendimiento del cultivo en toneladas.

    """
    class Meta:
        model = HistCultivo
        fields = ('anio', 'periodo', 'municipio_id', 'nombre_cultivo', 'area_sembrada', 'area_cosechada', 'produccion', 'rendimiento')

class CultivoSerializer(ModelSerializer):
    """
    Serializador para el modelo Cultivo.

    Este serializador convierte objetos Cultivo en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = Cultivo
        fields = '__all__'

class ResiduoSerializer(ModelSerializer):
    """
    Serializador para el modelo Residuo.

    Este serializador convierte objetos Residuo en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = Residuo
        fields = '__all__'

class TecnologiaSerializer(ModelSerializer):
    """
    Serializador para el modelo Tecnologia.

    Este serializador convierte objetos Tecnologia en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = Tecnologia
        fields = '__all__'

class VariableSerializer(ModelSerializer):
    """
    Serializador para el modelo Variable.

    Este serializador convierte objetos Variable en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = Variable
        fields = '__all__'

class CropRegressionSerializer(ModelSerializer):
    """
    Serializador para el modelo CropRegressionModel.

    Este serializador convierte objetos CropRegressionModel en representaciones JSON.

    Campos:
        Todos los campos del modelo.

    """
    class Meta:
        model = CropRegressionModel
        fields = '__all__'
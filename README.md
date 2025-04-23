# SenecAtlas - Guía de Inicio

Esta guía proporciona los pasos necesarios para configurar y ejecutar la aplicación web SenecAtlas tanto en Windows como en Linux.

---

## 📦 Estructura del Proyecto

```bash
SenecAtlas/
├── atlas_back/       ← Backend Django  
├── atlas_front/      ← Frontend React  
├── wheels/           ← Librerías `.whl` para Windows (incluye GDAL)  
└── senecAtlas.backup ← Backup de la base de datos PostgreSQL  
```

---

## 🧰 Requisitos Previos

- **Node.js y npm**  
- **Python** (3.10 o inferior recomendado)  
- **PostgreSQL 15 con PostGIS**  
- **Pipenv** (`pip install pipenv`)  

---

## 🗄 Configuración de Base de Datos PostgreSQL

1. Cree un usuario llamado `proyecto` durante la instalación de PostgreSQL.  
2. Restaure la base de datos desde el backup:

   ```bash
   pg_restore -U proyecto -d Atlas -F c -v senecAtlas.backup
   ```

3. Si da error diciendo que la base **Atlas** no existe, créela primero:

   ```bash
   createdb -U proyecto Atlas
   ```

---

## ⚙️ Backend - Configuración

### 🪟 En Windows

1. Navegue a `atlas_back/`:

   ```bash
   cd atlas_back
   ```

2. Instale dependencias:

   ```bash
   pipenv install
   ```

3. Instale la versión de GDAL desde la wheel local (en `../wheels/`):

   ```bash
   pipenv run pip install ../wheels/GDAL-3.1.0-cp310-cp310-win_amd64.whl
   ```

4. Agregue la variable de entorno `GDAL_LIBRARY_PATH`. En `settings.py` y `manage.py` ya está incluida:

   ```python
   os.environ['GDAL_LIBRARY_PATH'] = r'C:\OSGeo4Win\gdal310.dll'
   ```

5. Ejecute el servidor:

   ```bash
   pipenv run python manage.py runserver 8081
   ```

> ⚠️ Si `python-magic-bin` falla:
> ```bash
> pipenv uninstall python-magic-bin && pipenv install python-magic-bin
> ```

### 🐧 En Linux

1. Instale dependencias del sistema:

   ```bash
   sudo apt install gdal-bin libgdal-dev postgresql postgresql-contrib postgis
   ```

2. Exporte la ruta de GDAL:

   ```bash
   export GDAL_LIBRARY_PATH=/usr/lib/libgdal.so
   ```

3. Cree un entorno virtual e instale dependencias:

   ```bash
   cd atlas_back
   pipenv install
   ```

4. Ejecute el servidor (modo desarrollo):

   ```bash
   pipenv run python manage.py runserver 8081
   ```

5. O en producción:

   ```bash
   pipenv run gunicorn atlas_back.wsgi:application -c gunicorn_config.py
   ```

---

## 🌐 Frontend - Configuración

1. Navegue a `atlas_front/`:

   ```bash
   cd atlas_front
   ```

2. Instale dependencias:

   ```bash
   npm install
   ```

3. Ejecute el servidor React:

   ```bash
   npm start
   ```

> ⚠️ Durante la primera ejecución, si detectas vulnerabilidades en `npm audit`, puedes intentar:
> ```bash
> npm audit fix
> ```
> Si usas `--force`, revisa manualmente que el frontend siga funcionando.

---

## 🚀 Acceso a la Aplicación

- **Frontend:** `http://localhost:8090`  
- **Backend (API):** `http://localhost:8081`  

Asegúrate de que ambos estén corriendo simultáneamente.

---

## 🛠 Notas Adicionales

- Si `manage.py migrate` falla por conflictos (e.g. tabla existente), usa:

  ```bash
  pipenv run python manage.py migrate --fake-initial
  ```

- Evita que otros programas usen los puertos `8081` y `8090`.

---

## 🧾 Créditos

> Proyecto de Cooperación Triangular  
> Universidad de los Andes, 2023

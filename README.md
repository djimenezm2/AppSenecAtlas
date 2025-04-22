# SenecAtlas - Guía de Inicio

Esta guía proporciona los pasos necesarios para configurar y ejecutar la aplicación web SenecAtlas en Windows.

## Requisitos previos

1. **Node.js y npm**: Asegúrese de tener Node.js y npm instalados en su sistema. Puede descargarlos desde el sitio web oficial de Node.js (https://nodejs.org/es/).
2. **Python**: Instale Python versión 3.8.
3. **PostgreSQL con PostGIS**: Asegúrese de tener PostgreSQL Version 15 con la extensión PostGIS instalada. Puede descargarlo desde el sitio web oficial (https://www.postgresql.org/download/windows/). Se le va a pedir que cree un usuario de PostgreSQL. El usuario debe llamarse `proyecto`.

## Configuración de la base de datos PostgreSQL

1. Cargue la copia de seguridad de la base de datos utilizando el comando `pg_restore`. Asegúrese de que PostgreSQL esté en funcionamiento:
```
pg_restore -U proyecto -d Atlas -F c -v senecAtlas.backup
```
Tenga en cuenta que usted debe definir una <contraseña> para el usuario `proyecto` al instalar PostgreSQL. Utilice esa información para ejecutar el comando.

## Configuración del Backend

1. Abra una terminal y navegue hasta el directorio raíz del proyecto (`atlas/atlas_back`).
2. Instale pipenv para gestionar entornos virtuales:
```
pip install pipenv
```
3. Instale las dependencias de Python:
```
pipenv install
```
4. Instale las dependencias específicas de Windows:
```
pipenv install python-magic-bin
```
Si presenta problemas con esta librería, intente desinstalarla (`pipenv uninstall python-magic-bin`) y volver a correr el comando.
5. Inicie el servidor de desarrollo:
```
pipenv run python manage.py runserver 8081
```
### Notas adicionales
- Para iniciar el servidor posterior a la primera vez solo debe omitir los pasos 2, 3 y 4.
- Para iniciar el servidor con Gunicorn:
```
pipenv run gunicorn atlas_back.wsgi:application -c gunicorn_config.py
```

## Configuración del Frontend

1. Abra una terminal y navegue hasta el directorio raíz del proyecto (`atlas/atlas_front`).
2. Instale las dependencias de Node.js utilizando npm:
```
npm install
```
3. Inicie la aplicación React:
```
npm start
```
### Notas adicionales
- Para iniciar la aplicación posterior a la primera vez solo debe omitir el paso 2.

## Acceder a la Aplicación

Después de completar estos pasos, la aplicación estará disponible en su navegador web en la dirección `http://localhost:8090/`. Asegúrese de que tanto el servidor del backend como la aplicación del frontend estén en ejecución al mismo tiempo.

## Notas Adicionales

- Asegúrese de que los puertos 8090 (frontend) y 8081 (backend) no estén en uso por otras aplicaciones.

---
Proyecto de Cooperación Triangular
Universidad de los Andes, 2023

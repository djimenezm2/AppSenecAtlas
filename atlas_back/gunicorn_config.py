import os
# Gunicorn configuration file
bind = '0.0.0.0:8081'
workers = 5

# Django-specific settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'atlas_back.settings'  # Replace with your project's settings module
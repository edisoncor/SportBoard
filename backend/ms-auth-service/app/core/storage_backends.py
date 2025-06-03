# Importa el backend de almacenamiento S3Boto3 de django-storages para gestionar archivos en S3.
from storages.backends.s3boto3 import S3Boto3Storage


# Clase de almacenamiento para archivos públicos en la carpeta 'media' de S3.
class MediaStorage(S3Boto3Storage):
    location = "media"  # Carpeta de destino en el bucket S3.
    file_overwrite = False  # No sobrescribe archivos con el mismo nombre.


# Clase de almacenamiento para archivos privados en la carpeta 'private' de S3.
class PrivateMediaStorage(S3Boto3Storage):
    location = 'private'  # Carpeta de destino en el bucket S3 para archivos privados.
    default_acl = 'private'  # Control de acceso por defecto: privado.
    file_overwrite = False  # No sobrescribe archivos con el mismo nombre.
    custom_domain = False  # No utiliza un dominio personalizado para los archivos privados.
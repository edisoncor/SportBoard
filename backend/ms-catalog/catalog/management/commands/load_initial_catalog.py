import csv
from django.core.management.base import BaseCommand
from catalog.models import CatalogCategory, CatalogItem

class Command(BaseCommand):
    help = 'Carga datos iniciales de categorías e ítems desde archivos CSV.'

    def handle(self, *args, **options):
        # Cargar categorías (CatalogCategory)
        code_to_category = {}
        with open('backup_groups.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if CatalogCategory.objects.filter(code=row['Code']).exists():
                    code_to_category[row['Code']] = CatalogCategory.objects.get(code=row['Code'])
                    continue
                parent = code_to_category.get(row['ParentCode']) if row['ParentCode'] else None
                cat = CatalogCategory.objects.create(
                    name=row['Name'],
                    code=row['Code'],
                    version=int(row['Version']),
                    isActive=bool(int(row['IsActive'])),
                    parent_catalog=parent,
                    level=0  # Puedes ajustar el nivel si tienes esa lógica
                )
                code_to_category[row['Code']] = cat
        self.stdout.write(self.style.SUCCESS('Categorías cargadas'))

        # Cargar ítems (CatalogItem)
        omitidos = 0
        creados = 0
        with open('backup_catalogs.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                group_code = row['GroupCode']
                code = row['Code']
                parent_code = row['IdCatalog']
                if not group_code or group_code not in code_to_category:
                    continue
                if CatalogItem.objects.filter(code=code).exists():
                    omitidos += 1
                    continue
                parent = None
                if parent_code:
                    try:
                        parent = CatalogItem.objects.get(id=parent_code)
                    except CatalogItem.DoesNotExist:
                        parent = None
                CatalogItem.objects.create(
                    name=row['Name'],
                    code=row['Code'],
                    version=int(row['Version']),
                    isActive=bool(int(row['IsActive'])),
                    category=code_to_category[group_code],
                    parent_catalog=parent,
                    description=row.get('Description', '')
                )
                creados += 1
        self.stdout.write(self.style.SUCCESS(f'Ítems cargados: {creados}, omitidos por duplicado: {omitidos}'))

import { Group } from './group.model';
import { Validators } from '@angular/forms';

export interface Catalog {
    id: number;
    children: string[];
    code: string; // Nuevo campo agregado
    description: string;
    group: Group;
    groupCode: string; // Nuevo campo agregado
    idCatalog: number;
    isActive: boolean;
    name: string;
    parent: string;
    version: number;
}

// Validadores para el formulario de Catalog
export const CatalogFormValidators = {
    name: [Validators.required],
    group: [Validators.required],
    description: [],
    version: [Validators.required, Validators.min(0)],
    isActive: [Validators.required],
    code: [] // No es obligatorio
};

import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Item, CreateItemRequest, UpdateItemRequest, getItemCodeFromUrl } from '../../../../../core/models/catalogs/Item';
import { Category } from '../../../../../core/models/catalogs/Category';

export interface ItemDialogData {
  mode: 'create' | 'edit';
  item?: Item;
  categories: Category[];
}

@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './item-dialog.component.html',
  styleUrl: './item-dialog.component.scss'
})
export class ItemDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ItemDialogComponent>);

  itemForm: FormGroup;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ItemDialogData) {
    this.isEditMode = data.mode === 'edit';
    this.itemForm = this.createForm();
  }

  ngOnInit() {
    if (this.isEditMode && this.data.item) {
      this.populateForm(this.data.item);
    }
  }

  /**
   * Crea el formulario reactivo
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Z0-9_-]+$/)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', [Validators.required]],
      isActive: [true]
    });
  }

  /**
   * Rellena el formulario con los datos del item existente
   */
  private populateForm(item: Item) {
    this.itemForm.patchValue({
      name: item.name,
      code: getItemCodeFromUrl(item.url),
      description: item.description || '',
      category: item.category,
      isActive: item.isActive
    });

    // En modo edición, deshabilitar el campo código
    this.itemForm.get('code')?.disable();
  }

  /**
   * Obtiene el título del diálogo
   */
  getTitle(): string {
    return this.isEditMode ? 'Editar Item' : 'Crear Nuevo Item';
  }

  /**
   * Obtiene el texto del botón de confirmación
   */
  getConfirmButtonText(): string {
    return this.isEditMode ? 'Actualizar' : 'Crear';
  }

  /**
   * Verifica si un campo tiene error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.itemForm.get(fieldName);
    return field ? field.hasError(errorType) && field.touched : false;
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.itemForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return 'Este campo es requerido';
    }
    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    if (errors['pattern']) {
      return 'Solo se permiten letras mayúsculas, números, guiones y guiones bajos';
    }

    return 'Campo inválido';
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;

      if (this.isEditMode) {
        // Para edición, excluir el código y crear objeto de actualización
        const updateData: UpdateItemRequest = {
          name: formValue.name,
          description: formValue.description || undefined,
          isActive: formValue.isActive
        };
        this.dialogRef.close(updateData);
      } else {
        // Para creación, incluir todos los campos
        const createData: CreateItemRequest = {
          name: formValue.name,
          code: formValue.code,
          description: formValue.description || undefined,
          category: formValue.category
        };
        this.dialogRef.close(createData);
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.itemForm.controls).forEach(key => {
        this.itemForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * Cancela la operación y cierra el diálogo
   */
  onCancel() {
    this.dialogRef.close();
  }

  /**
   * Obtiene el nombre de una categoría por su código
   */
  getCategoryName(categoryCode: string): string {
    const category = this.data.categories.find(cat => cat.code === categoryCode);
    return category?.name || categoryCode;
  }
}

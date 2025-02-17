import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { User } from '../../models/user_manage/user.model';
import { UserService } from '../../services/user_manage/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: any): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-crear-usuario',
  imports: [SharedModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.scss'
})
export class CrearUsuarioComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  nameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  confirmPasswordFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    if (
      this.emailFormControl.valid &&
      this.nameFormControl.valid &&
      this.passwordFormControl.valid &&
      this.confirmPasswordFormControl.valid
    ) {
      const user: User = {
        username: this.nameFormControl.value!,
        email: this.emailFormControl.value!,
        password: this.passwordFormControl.value!,
      };

      this.userService.createUser(user).subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);
          this.router.navigate(['/usuarios/gestion-usuario']);
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}
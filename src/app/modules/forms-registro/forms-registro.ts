import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'forms-registro',
  standalone: true,
  templateUrl: './forms-registro.html',
  styleUrl: './forms-registro.css',
  imports: [
    RouterModule,
    FormsModule
  ]
})
export class FormsRegistroComponent {

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Datos del formulario
  formData = {
    dpi: '',
    nombres: '',
    apellidos: '',
    sexo: '',
    fecha_nacimiento: '',
    password: '',
    passwordRepeat: '' // solo validación
  };

  mensaje: string = '';



  onRegister() {
    // 1️⃣ Validar contraseñas coinciden
    if (this.formData.password !== this.formData.passwordRepeat) {
      this.mensaje = '❌ Las contraseñas no coinciden';
      return;
    }

    // 2️⃣ Preparar objeto a enviar (sin passwordRepeat)
    const data = {
      dpi: this.formData.dpi,
      nombres: this.formData.nombres,
      apellidos: this.formData.apellidos,
      sexo: this.formData.sexo,
      fecha_nacimiento: this.formData.fecha_nacimiento,
      password: this.formData.password
    };

    // 3️⃣ Llamar al backend
    this.authService.register(data).subscribe({
      next: (res) => {
        this.mensaje = `✅ Registro exitoso. Usuario asignado: ${res.data.usuario}`;

        // Opcional: redirigir después de 2 segundos
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.mensaje = `❌ Error: ${err.error.msg}`;
      }
    });
  }
}

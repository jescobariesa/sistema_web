import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ]
})
export class LoginComponent {
  usuario: string = "";
  password: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  mensaje: string = "";

  onLogin() {
    if (!this.usuario || !this.password) {
      this.mensaje = "Por favor, llena todos los campos";
      return;
    }
    this.authService.login({ usuario: this.usuario, password: this.password }).subscribe({
      next: (res: any) => {

        // Guardamos la sesión en localStorage
        localStorage.setItem("usuario", JSON.stringify(res.data));

        // Revisamos estado
        if (res.data.estado !== "activo") {
          this.mensaje = "Tu cuenta está pendiente de activación";
          localStorage.removeItem("usuario"); // limpiamos sesión
          return;
        }

        // Redirigimos según rol
        if (res.data.rol === "rol_admin") {
          this.router.navigate(['/home']);
        } else if (res.data.rol === "rol_empleado") {
          this.router.navigate(['/user']);
        } else {
          this.mensaje = "Rol no autorizado";
        }
      },
      error: (err) => {
        this.mensaje= err.error?.msg || "Error al iniciar sesión";
        }
      });
    }
  }

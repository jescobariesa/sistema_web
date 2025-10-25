import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../../services/cliente.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
      RouterModule,
      MatIconModule,
      CommonModule,
      FormsModule
      ],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class RolesCommponent implements OnInit{

  formData = {
    codigo: '',
    nombres: '',
    apellidos: '',
    dpi: '',
    nit: 'CF',
  };

  private _toggleNit: boolean = false;
  mensaje: string = '';
  deshabilitado: boolean = false;

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCodigo();
  }

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

  // === CARGAR SIGUIENTE CÓDIGO ===
  cargarCodigo() {
    this.clienteService.getSiguienteCodigo().subscribe({
      next: (res) => {
        this.formData.codigo = res.siguienteCodigo;
      },
      error: (err) => {
        console.error('Error al cargar código:', err);
        this.mensaje = 'Error al generar el código.';
      }
    });
  }

  // === TOGGLE NIT ===
  get toggleNit(): boolean {
  return this._toggleNit;
}

set toggleNit(value: boolean) {
  this._toggleNit = value;
  if (value) {
    this.formData.nit = '';
  } else {
    this.formData.nit = 'CF';
  }
}

  // === VALIDAR FORMULARIO ===
  get formularioValido(): boolean {
    return !!(this.formData.nombres && this.formData.apellidos && this.formData.dpi);
  }

  // === REGISTRAR CLIENTE ===
  registrarCliente() {
    if (!this.formularioValido) return;

    this.deshabilitado = true;
    const data = {
      nombres: this.formData.nombres,
      apellidos: this.formData.apellidos,
      dpi: this.formData.dpi,
      nit: this.formData.nit
    };

    this.clienteService.createCliente(data).subscribe({
      next: (res) => {
        this.mensaje = `✅ Cliente creado exitosamente, el código asignado es ${res.data.codigo}.`;
        this.deshabilitado = false;

        setTimeout(() => {
          this.mensaje = '';
          this.limpiarCampos();
        }, 5000);

        this.cargarCodigo();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err.error?.msg || '❌ Error al registrar cliente.';
        this.deshabilitado = false;
      }
    });
  }

  // === LIMPIAR CAMPOS ===
  limpiarCampos() {
    this.formData.nombres = '';
    this.formData.apellidos = '';
    this.formData.dpi = '';
    this.toggleNit = false;
    this.formData.nit = 'CF';
  }
}

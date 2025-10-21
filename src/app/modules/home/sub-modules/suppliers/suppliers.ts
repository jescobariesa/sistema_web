import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../../services/session.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProveedorService } from '../../../../services/proveedor.service';

@Component({
  // selector: 'app-articulos-nuevos',
  selector: 'app-suppliers',
  standalone: true,
  imports: [
      RouterModule,
      MatIconModule,
      FormsModule,
      CommonModule
      ],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css'
})
export class SuppliersComponent implements OnInit{

  // Campos del formulario
  formData = {
    nombre: '',
    direccion: '',
    correo: '',
    contacto: '',
    telefono: ''
  };

  codigoGenerado: string = '';       // P-0001, P-0002...
  mensaje: string = '';              // mensaje de éxito/error
  registroExitoso: boolean = false;  // bloquear formulario si es true
  isSubmitting: boolean = false;     // evita doble clic

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerCodigo();
  }

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

  // Obtener el siguiente código del backend
  obtenerCodigo() {
    this.proveedorService.getUltimo().subscribe({
      next: (res) => {
        this.codigoGenerado = res.siguienteCodigo;
      },
      error: () => {
        this.codigoGenerado = 'Error al cargar código';
      }
    });
  }

  // Registrar proveedor
  registrarProveedor() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const data = { ...this.formData };

    this.proveedorService.createProveedor(data).subscribe({
      next: (res) => {
        this.mensaje = `✅ Registro exitoso: código de proveedor ${res.data.codigo}`;
        this.registroExitoso = true;
        this.isSubmitting = false;

        // Redirigir al home después de 15 segundos
        setTimeout(() => this.router.navigate(['/home']), 15000);
      },
      error: (err) => {
        this.mensaje = `❌ Error: ${err.error?.msg || 'No se pudo registrar el proveedor'}`;
        this.isSubmitting = false;
      }
    });
  }

  // Limpiar campos del formulario (sin borrar el ID)
  limpiarCampos() {
    if (this.registroExitoso) return; // no limpiar si ya se registró
    this.formData = {
      nombre: '',
      direccion: '',
      correo: '',
      contacto: '',
      telefono: ''
    };
    this.mensaje = '';
  }

}

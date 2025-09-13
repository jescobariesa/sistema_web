import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UsuarioService } from '../../services/usuario.service'; // 👈 Importamos el servicio
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css'
})

export class GestionUsuariosCommponent implements OnInit {

  mensaje: string | null = null;
  mensajeTipo: 'success' | 'error' | 'info' | null = null;
  usuarioARechazar: string | null = null; // guarda el ID del usuario a rechazar
  mostrarConfirmRechazo: boolean = false; // controla la vista del recuadro de confirmación

  usuariosPendientes: any[] = []; // Aquí se guardan los usuarios de la BD
  currentPage: number = 1; // Página actual
  pageSize: number = 3;    // Cantidad de usuarios por página

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  // 🔹 Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.usuarioService.getPendientes().subscribe({
      next: (data) => {
        console.log("✅ Usuarios pendientes:", data);

        // Agregar propiedades temporales a cada usuario
      this.usuariosPendientes = data.map((u: any) => ({
        ...u,
        selectedRol: '',     // para el select de rol
        selectedEstado: ''   // para el select de estado
      }));
      },
      error: (err) => {
        console.error("❌ Error cargando pendientes:", err);
        alert("Error al cargar usuarios pendientes");
      }
    });
  }

  // 🔹 Usuarios que se mostrarán en la tabla
  get usuariosPaginados() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.usuariosPendientes.slice(start, start + this.pageSize);
  }

  // 🔹 Número total de páginas
  get totalPages(): number {
    return Math.ceil(this.usuariosPendientes.length / this.pageSize);
  }

  // 🔹 Cambiar página
  cambiarPagina(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onLogout() {
      this.sessionService.logout();
      this.router.navigate(['/login']);
    }

  // Agregamos los metodos de Autorizar y Rechazar
  autorizar(id: string, rol: string, estado: string) {
    if (!rol || !estado) {
    this.mostrarMensaje('Debes seleccionar rol y estado antes de autorizar', 'info');
    return;
    }

    this.usuarioService.autorizarUsuario(id, rol, estado).subscribe({
      next: (res) => {
        this.mostrarMensaje(res.msg || 'Usuario autorizado con éxito', 'success');
        this.cargarPendientes(); // refrescar lista
      },
      error: (err) => {
       this.mostrarMensaje(err.error?.msg || 'Error al autorizar usuario', 'error');
      }
    });
  }

  rechazar(id: string) {
  this.usuarioARechazar = id;
  this.mostrarConfirmRechazo = true; // mostramos el bloque de confirmación
}

// Método para confirmar rechazo
confirmarRechazo() {
  if (!this.usuarioARechazar) return;

  this.usuarioService.rechazarUsuario(this.usuarioARechazar).subscribe({
    next: (res: any) => {
      this.mostrarMensaje(res.msg || 'Usuario rechazado', 'error');
      this.cargarPendientes();
      this.cancelarRechazo(); // limpiamos
    },
    error: (err: any) => {
      this.mostrarMensaje(err.error?.msg || 'Error al rechazar usuario', 'error');
      this.cancelarRechazo();
    }
  });
}

// Método para cancelar rechazo
cancelarRechazo() {
  this.usuarioARechazar = null;
  this.mostrarConfirmRechazo = false;
}

// Método reutilizable
mostrarMensaje(texto: string, tipo: 'success' | 'error' | 'info') {
  this.mensaje = texto;
  this.mensajeTipo = tipo;

}

cerrarMensaje() {
  this.mensaje = null;
  this.mensajeTipo = null;
}

}

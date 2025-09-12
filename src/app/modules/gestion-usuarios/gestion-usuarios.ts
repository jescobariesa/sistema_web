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
    this.usuarioService.autorizarUsuario(id, rol, estado).subscribe({
      next: (res) => {
        alert(res.msg);
        this.cargarPendientes(); // refrescar lista
      },
      error: (err) => {
        alert(err.error?.msg || "Error al autorizar usuario");
      }
    });
  }

  rechazar(id: string) {
    this.usuarioService.rechazarUsuario(id).subscribe({
      next: (res) => {
        alert(res.msg);
        this.cargarPendientes(); // refrescar lista
      },
      error: (err) => {
        alert(err.error?.msg || "Error al rechazar usuario");
      }
    });
}

}

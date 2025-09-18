import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common'; // 👈 asegúrate de tener esto también
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-user-pending',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './user-pending.html',
  styleUrl: './user-pending.css'
})
export class UserPendingCommponent implements OnInit {

  usuariosActivos: any[] = [];
  mensaje: string = "";
  confirmarInactivarId: string | null = null;

  currentPage: number = 1;  // página actual
  pageSize: number = 3;     // cantidad por página


  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private usuarioService: UsuarioService, // agregando UsuarioService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarActivos();
  }

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

// 🔹 Cargar activos
cargarActivos() {
  this.usuarioService.getActivos().subscribe({
    next: (data: any[]) => {
      this.usuariosActivos = data;
    },
    error: () => {
      this.mensaje = "Error al cargar usuarios activos";
    }
  });
}

// 🔹 Usuarios que se mostrarán en la tabla
  get usuariosPaginados() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.usuariosActivos.slice(start, start + this.pageSize);
  }

  // 🔹 Número total de páginas
  get totalPages(): number {
    return Math.ceil(this.usuariosActivos.length / this.pageSize);
  }

  // 🔹 Cambiar página
  cambiarPagina(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

// 🔹 Marcar usuario para confirmación
confirmarInactivar(id: string) {
  this.confirmarInactivarId = id;
}

// 🔹 Cancelar confirmación
cancelarInactivar() {
  this.confirmarInactivarId = null;
}

// 🔹 Inactivar usuario
inactivar(id: string) {
  this.usuarioService.inactivarUsuario(id).subscribe({
    next: (res) => {
      this.mensaje = res.msg;
      this.cargarActivos(); // refrescar
      this.confirmarInactivarId = null;
    },
    error: () => {
      this.mensaje = "Error al inactivar usuario";
    }
  });
}

}

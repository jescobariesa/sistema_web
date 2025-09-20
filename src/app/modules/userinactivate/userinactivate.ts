import { Component } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-userinactivate',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './userinactivate.html',
  styleUrl: './userinactivate.css'
})
export class UserinactivateComponent {

  usuariosInactivos: any[] = [];
  mensaje: string = "";
  confirmarActivarId: string | null = null;

  currentPage: number = 1; //página actual
  pageSize: number = 3; // cantidad por página

    // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private usuarioService: UsuarioService, // agregando UsuarioService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarInactivos();
  }

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

  // Cargar Inactivos
  cargarInactivos() {
    this.usuarioService.getInactivos().subscribe({
      next: (data: any[]) => {
        this.usuariosInactivos = data;
      },
      error: () => {
        this.mensaje = "Error al cargar usuarios Inactivos";
      }
    });
  }

// Usuarios que se mostrarán en la tabla
  get usuariosPaginados() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.usuariosInactivos.slice(start, start + this.pageSize);
  }

// Numero total de páginas
get totalPages(): number {
  return Math.ceil(this.usuariosInactivos.length / this.pageSize);
}

// Cambiar pagina
cambiarPagina(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

// Marcar usuario para confirmacion
confirmarActivar(id: string) {
  this.confirmarActivarId = id;
}

// Cancelar confirmacion
cancelarActivar() {
  this.confirmarActivarId = null;
}

// Activar usuario
activar(id: string){
  this.usuarioService.activarUsuario(id).subscribe({
    next: (res) => {
      this.mensaje = res.msg;
      this.cargarInactivos(); // refresar
      this.confirmarActivarId = null;
    },
    error: () => {
      this.mensaje = "Error al activar usuario";
    }
  });
}

}

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-userdenied',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './userdenied.html',
  styleUrl: './userdenied.css'
})
export class UserdeniedComponent {

  usuariosRechazados: any[] = [];
  mensaje: string = "";

  currentPage: number = 1; //página actual
  pageSize: number = 3; // cantidad por página

 // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private usuarioService: UsuarioService, // agregando UsuarioService
    private router: Router
  ) {}

ngOnInit(): void {
    this.cargarRechazados();
  }

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

// Cargar Rechazados
  cargarRechazados() {
    this.usuarioService.getRechazados().subscribe({
      next: (data: any[]) => {
        this.usuariosRechazados = data;
      },
      error: () => {
        this.mensaje = "Error al cargar usuarios Rechazados";
      }
    });
  }

// Usuarios que se mostrarán en la tabla
  get usuariosPaginados() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.usuariosRechazados.slice(start, start + this.pageSize);
  }

// Numero total de páginas
get totalPages(): number {
  return Math.ceil(this.usuariosRechazados.length / this.pageSize);
}

// Cambiar pagina
cambiarPagina(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

}

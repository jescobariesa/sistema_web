import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';


@Component({
  selector: 'app-gestion-usuarios',
  imports: [RouterModule],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css'
})
export class GestionUsuariosCommponent {

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

}

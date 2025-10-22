import { Component } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-roles',
  imports: [RouterModule,MatIconModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class RolesCommponent {

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

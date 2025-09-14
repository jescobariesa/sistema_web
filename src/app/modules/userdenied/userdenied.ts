import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-userdenied',
  imports: [RouterModule],
  templateUrl: './userdenied.html',
  styleUrl: './userdenied.css'
})
export class UserdeniedComponent {


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

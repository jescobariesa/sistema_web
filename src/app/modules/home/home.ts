import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';


@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

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

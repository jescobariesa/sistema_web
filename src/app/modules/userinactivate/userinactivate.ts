import { Component } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-userinactivate',
  imports: [RouterModule],
  templateUrl: './userinactivate.html',
  styleUrl: './userinactivate.css'
})
export class UserinactivateComponent {

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

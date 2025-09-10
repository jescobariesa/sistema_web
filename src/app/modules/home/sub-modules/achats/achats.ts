import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-achats',
  imports: [RouterModule,MatIconModule],
  templateUrl: './achats.html',
  styleUrl: './achats.css'
})
export class AchatsComponent {

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

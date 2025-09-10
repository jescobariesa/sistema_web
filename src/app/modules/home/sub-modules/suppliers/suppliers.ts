import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-articulos-nuevos',
  imports: [RouterModule,MatIconModule],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css'
})
export class SuppliersComponent {

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

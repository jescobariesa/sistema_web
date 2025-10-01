import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';


@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit{

  nombreCompleto: string = "";

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

// ALT + 96 = ``

ngOnInit(): void {
  const user = this.sessionService.getUsuario();
  if (user) {
    this.nombreCompleto = `${user.nombres.toUpperCase()} ${user.apellidos.toUpperCase()}`;
  }
}

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

}

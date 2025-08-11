import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./modules/login/login";
import { FormsRegistro } from "./modules/forms-registro/forms-registro";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, FormsRegistro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sistema_web');
}

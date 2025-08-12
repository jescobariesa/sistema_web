import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './modules/login/login';
import { FormsRegistroComponent } from './modules/forms-registro/forms-registro';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, FormsRegistroComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sistema_web');
}

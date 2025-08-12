import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login';
import { FormsRegistroComponent } from './modules/forms-registro/forms-registro';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: FormsRegistroComponent },
  { path: '**', redirectTo: ''}
];

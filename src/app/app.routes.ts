import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login';
import { FormsRegistroComponent } from './modules/forms-registro/forms-registro';
import { HomeComponent } from './modules/home/home';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: FormsRegistroComponent },
  { path: 'home', component: HomeComponent},
  { path: '**', redirectTo: ''}
];

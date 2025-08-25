import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login';
import { FormsRegistroComponent } from './modules/forms-registro/forms-registro';
import { HomeComponent } from './modules/home/home';
import { RolesCommponent } from './modules/roles/roles';
import { GestionUsuariosCommponent } from './modules/gestion-usuarios/gestion-usuarios';
import { UserPendingCommponent } from './modules/user_pending/user-pending';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: FormsRegistroComponent },
  { path: 'home', component: HomeComponent},
  { path: 'rol', component: RolesCommponent},
  { path: 'user', component: GestionUsuariosCommponent}, 
  { path: 'userp',component: UserPendingCommponent},
  { path: '**', redirectTo: ''}
];

import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login';
import { FormsRegistroComponent } from './modules/forms-registro/forms-registro';
import { HomeComponent } from './modules/home/home';
import { RolesCommponent } from './modules/roles/roles';
import { GestionUsuariosCommponent } from './modules/gestion-usuarios/gestion-usuarios';
import { UserPendingCommponent } from './modules/user_pending/user-pending';
import { ArticulosNuevosCommponent } from './modules/home/sub-modules/articulos-nuevos/articulos-nuevos';
import { authGuard } from './guards/auth.guard';
import { SuppliersComponent } from './modules/home/sub-modules/suppliers/suppliers';

export const routes: Routes = [

  // 🔓 Rutas públicas (sin sesión)
  { path: '',
    component: LoginComponent
  },

  { path: 'login',
    component: LoginComponent
  },

  { path: 'registro',
    component: FormsRegistroComponent
  },

  // 🔒 Rutas protegidas (requieren login y estado = activo)
  { path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },

  // Accede el rol de: administrador
  { path: 'rol',
    component: RolesCommponent,
    canActivate: [authGuard],
    data: {roles: ['rol_admin'] }
  },

  { path: 'user',
    component: GestionUsuariosCommponent,
    canActivate: [authGuard],
    data: {roles: ['rol_admin'] }
  },

  { path: 'userp',
    component: UserPendingCommponent,
    canActivate: [authGuard],
    data: { roles: ['rol_admin'] }
  },

  // Accede el rol de: administrador, empleados
  { path: 'new-art',
    component: ArticulosNuevosCommponent,
    canActivate: [authGuard],
    data: { roles: ['rol_admin', 'rol_empleados'] }
  },

  // Accede el rol de: administrador, empleados
  { path: 'provid',
    component: SuppliersComponent,
    canActivate: [authGuard],
    data: { roles: ['rol_admin', 'rol_empleados']}
  },

  // Ruta por defecto
  { path: '**', redirectTo: ''}
];

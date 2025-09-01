import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  // 1. Obtener usuario actual
  const usuario = sessionService.getUsuario();

  // 2. Validar si hay usuario en sesión
  if (!usuario) {
    router.navigate(['/login']);
    return false;
  }

  // 3. Validar estado
  if (usuario.estado !== "activo") {
    sessionService.logout();
    router.navigate(['/login']);
    return false;
  }

  // 4. Validar roles si la ruta los requiere
  const rolesPermitidos = route.data?.['roles'] as string[];
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    router.navigate(['/home']); // 👈 si no tiene rol válido, lo manda al home
    return false;
  }

  // ✅ Todo OK → acceso permitido
  return true;
};

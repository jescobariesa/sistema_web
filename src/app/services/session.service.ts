import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private key = "usuario"; // clave en localStorage

  constructor() {}

  // Guardar usuario en sesión
  setUsuario(usuario: any) {
    localStorage.setItem(this.key, JSON.stringify(usuario));
  }

  // Obtener usuario actual
  getUsuario() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }

  // Saber si hay sesión activa
  isLoggedIn(): boolean {
    return this.getUsuario() !== null;
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem(this.key);
  }
}

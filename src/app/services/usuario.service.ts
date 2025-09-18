// frontend/src/app/services/usuario.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:4000/api/usuarios'; // Ajusta el puerto si es diferente

  constructor(private http: HttpClient) {}

  // 🔹 Obtener lista de usuarios pendientes
  getPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendientes`);
  }

  // Autorizar usuario (cambiar rol + estado)
autorizarUsuario(id: string, rol: string, estado: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}/autorizar`, { rol, estado });
}

// Rechazar usuario
rechazarUsuario(id: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}/rechazar`, {});
}

// 🔹 Obtener usuarios activos
getActivos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/activos`);
}

// 🔹 Inactivar usuario
inactivarUsuario(id: string): Observable<any> {
  return this.http.put<{ msg: string }>(
    `${this.apiUrl}/${id}/inactivar`,
    {}
  );
}

}

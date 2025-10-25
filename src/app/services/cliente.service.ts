import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:4000/api/clientes'; // ajusta puerto si tu backend usa otro

  constructor(private http: HttpClient) {}

  // Obtener siguiente código
  getSiguienteCodigo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ultimo`);
  }

  // Crear cliente
  createCliente(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Listar clientes (paginado)
  getClientes(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }
}

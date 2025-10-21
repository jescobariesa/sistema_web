import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  private apiUrl = 'http://localhost:4000/api/articulos';
  private apiProveedores = 'http://localhost:4000/api/proveedores'; // suponiendo que ya existe

  constructor(private http: HttpClient) {}

  // obtener siguiente código
  getSiguienteCodigo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ultimo`);
  }

  // registrar nuevo artículo
  createArticulo(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // listar con paginación
  getArticulos(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  // listar todos (para PDF)
  getAllArticulos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // actualizar
  updateArticulo(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // eliminar
  deleteArticulo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // obtener lista de proveedores
  getProveedores(): Observable<any> {
    return this.http.get(this.apiProveedores);
  }
}

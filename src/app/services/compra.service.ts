import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'http://localhost:4000/api/compras';
  private apiProveedores = 'http://localhost:4000/api/proveedores';
  private apiArticulos = 'http://localhost:4000/api/articulos';

  constructor(private http: HttpClient) {}

  createCompra(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getCompras(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  getAllCompras(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  deleteCompra(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProveedores(): Observable<any> {
    return this.http.get(this.apiProveedores);
  }

  getArticulos(): Observable<any> {
    return this.http.get(this.apiArticulos);
  }
}

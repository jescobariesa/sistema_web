import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = 'http://localhost:4000/api/ventas';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any> {
    return this.http.get('http://localhost:4000/api/clientes');
  }

  getArticulos(): Observable<any> {
    return this.http.get('http://localhost:4000/api/stock');
  }

  getVentas(page = 1, pageSize = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  createVenta(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  deleteVenta(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

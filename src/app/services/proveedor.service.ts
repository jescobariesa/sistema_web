// frontend/src/app/services/proveedor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = 'http://localhost:4000/api/proveedores';

  constructor(private http: HttpClient) {}

  // Obtener el siguiente código disponible
  getUltimo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ultimo`);
  }

  // Crear proveedor
  createProveedor(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}

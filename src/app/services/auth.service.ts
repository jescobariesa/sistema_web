import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:4000/api/auth'; // Backend

  constructor(private http: HttpClient) { }

  // 🔹 Registro
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // 🔹 Login
  login(data: { usuario: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}

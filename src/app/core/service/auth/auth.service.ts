import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Register
  register(user: any): Promise<any> {
    return this.http.post(`${this.apiUrl}/usuarios/registro`, user).toPromise();
  }

  // Login
  // Login (correo o documento)
  async login(login: string, password: string): Promise<{ token: string; user: any }> {
    return firstValueFrom(
      this.http.post<{ token: string; user: any }>(`${this.apiUrl}/login/`, { login, password })
    );
  }

  // Traer usuario
  getUser(): Promise<any> {

    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', token ? `${token}` : '');

    return this.http.get(`${this.apiUrl}/usuarios/usuario`, { headers }).toPromise();

  }




}
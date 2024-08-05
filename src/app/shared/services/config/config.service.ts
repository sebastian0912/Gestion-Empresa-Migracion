import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders().set('Authorization', token) : new HttpHeaders();
  }

  private handleError(error: any): Observable<never> {
    throw error;
  }

  // Cambiar contraseña
  async cambiarContrasena(
    oldpassword: any,
    newpassword: any,
  ): Promise<any> {

    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/usuarios/cambiocontrasena`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const requestBody = {
      oldpassword,
      newpassword,
      token: token
    };


    try {
      const response = await firstValueFrom(this.http.post<string>(urlcompleta, requestBody, { headers }).pipe(
        catchError(this.handleError)
      ));
      return response;
    } catch (error) {
      throw error;
    }

    
  }

}

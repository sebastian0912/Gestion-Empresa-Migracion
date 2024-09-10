import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

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

  public getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
    return null;
  }

  private handleError(error: any): Observable<never> {
    throw error;
  }

  // Traer sucursales
  async traerSucursales(): Promise<Observable<any>> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/Sucursal/sucursal`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Editar sede 
  async editarSede(
    ceduladelapersona: string,
    sucursalacambiar: string
  ): Promise<any> {

    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/usuarios/cambiodesucursal`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const requestBody = {
      ceduladelapersona,
      sucursalacambiar,
      jwt: token
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

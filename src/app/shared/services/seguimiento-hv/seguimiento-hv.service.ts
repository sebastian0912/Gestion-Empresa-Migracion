import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoHvService {

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
    console.error('An error occurred:', error);
    throw error;
  }

  public getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
    return null;
  }

  // Buscar seguimiento hv por responsable
  public buscarSeguimientoHv(responsable: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/auditoria/tu_alianza_responsable/${responsable}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

    // Buscar seguimiento hv 
    public buscarSeguimientoHvGeneral(): Observable<any> {
      const headers = this.createAuthorizationHeader();
      return this.http.get(`${this.apiUrl}/auditoria/tu_alianza_responsable/`, { headers }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
    }

  // Editar seguimiento hv
  async editarSeguimientoHv(
    id: number,
    tipo: string,
    updated_fields: any
  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/auditoria/tu_alianza_update/`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      tipo,
      updated_fields,
      id,
      jwt: token
    };

    try {
      const response = await firstValueFrom(this.http.post<string>(urlcompleta, data, { headers }).pipe(
        catchError(this.handleError)
      ));
      return response;
    } catch (error) {
      console.error('Error en la petición HTTP POST', error);
      throw error;
    }
  }

  // Cargar seguimiento hv datos, responsable
  async cargarSeguimientoHv(
    datos: any,
  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }
    const responsable = this.getUser().primer_nombre + ' ' + this.getUser().primer_apellido;
    const urlcompleta = `${this.apiUrl}/auditoria/tu_alianza/`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      datos,
      responsable,
      mensaje: "muchos",
      jwt: token
    };

    console.log(data);

    try {
      const response = await firstValueFrom(this.http.post<string>(urlcompleta, data, { headers }).pipe(
        catchError(this.handleError)
      ));
      return response;
    } catch (error) {
      console.error('Error en la petición HTTP POST', error);
      throw error;
    }
  } 

}

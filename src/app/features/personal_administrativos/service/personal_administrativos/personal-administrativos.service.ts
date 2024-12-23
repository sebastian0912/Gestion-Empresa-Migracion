import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PersonalAdministrativosService {

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
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', token);
    }
    return headers;
  }
  

  private handleError(error: any): Observable<never> {
    throw error;
  }

  // guardar update-contract/<str:codigo_contrato>/
  guardar_firma(codigo_contrato: any, firma: string): Observable<any> {
    const headers = this.createAuthorizationHeader(); // Generar las cabeceras
    const body = {
      firmaPersonalAdministrativo: firma // Enviar solo la firma
    };
    console.log('body', body);
    return this.http.post(`${this.apiUrl}/contratacion/update-contract/${codigo_contrato}/`, body, { headers }).pipe(
      map((response: any) => response), // Procesar la respuesta
      catchError(this.handleError)     // Manejar errores
    );
  }
  



}

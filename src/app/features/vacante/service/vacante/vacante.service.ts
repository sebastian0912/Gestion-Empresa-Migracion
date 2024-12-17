import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VacanteService {

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

  // guardar firma -firma-solicitante/
  public guardar_firma(data: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.apiUrl}/contratacion/firma-solicitante/`, data, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // guardar foto -foto-solicitante/
  public guardar_foto(data: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.apiUrl}/contratacion/foto-solicitante/`, data, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

}

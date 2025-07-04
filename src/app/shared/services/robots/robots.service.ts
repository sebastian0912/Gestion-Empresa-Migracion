import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RobotsService {

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
    return throwError(error);
  }

  // Método para enviar afiliaciones de forma masiva
  enviarAfiliaciones(afiliaciones: any[]): Observable<any> {
    const url = `${this.apiUrl}/adresRobots/cargar_afiliaciones/`; // Cambia por tu endpoint real
    const headers = this.createAuthorizationHeader();

    // Obtener el token JWT desde el almacenamiento local
    const jwt = this.getToken();

    // Añadir el JWT en el body junto con los datos de afiliaciones
    const body = {
      jwt,  // El token JWT
      datos: afiliaciones  // Los datos de afiliaciones
    };

    return this.http.post(url, body, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }


  // Método para leer afiliaciones desde el backend
  leerAfiliaciones(): Observable<any[]> {
    const url = `${this.apiUrl}/adresRobots/afiliaciones/`; // Cambia por tu endpoint real
    const headers = this.createAuthorizationHeader();

    return this.http.get<any[]>(url, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // EstadosRobots
  consultarEstadosRobots(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/EstadosRobots/sin_consultar`, {
      headers,
      params: { cedula }
    }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // Método para enviar Estados Robots de forma masiva
  enviarEstadosRobots(datos: any[]): Observable<any> {
    const url = `${this.apiUrl}/EstadosRobots/cargar_excel`; // Ajusta según tu endpoint real
    const headers = this.createAuthorizationHeader();

    // Obtener el token JWT desde el almacenamiento local
    const jwt = this.getToken();

    // Construir el body con JWT y los datos
    const body = {
      jwt,    // El token JWT
      datos   // Los datos que quieres enviar al backend
    };

    return this.http.post(url, body, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }




  // EstadosRobots/pendientes_por_oficina
  consultarEstadosRobotsPendientesPorOficina(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/EstadosRobots/pendientes_por_oficina`, {
      headers
    })
      .pipe(catchError(this.handleError));
  }

  // EstadosRobots/pendientes_generales
  consultarEstadosRobotsPendientesGenerales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/EstadosRobots/pendientes_paquete`, {
      headers: this.createAuthorizationHeader()
    })
      .pipe(catchError(this.handleError));
  }

  actualizarPrioridad(paquete: string, prioridad: string): Observable<any> {
    const body = { paquete, prioridad };
    const headers = this.createAuthorizationHeader(); // esto debe retornar un HttpHeaders válido con Authorization

    return this.http.put(`${this.apiUrl}/EstadosRobots/actualizar-prioridad/`, body, { headers });
  }


  descargarZipPaquete(paquete: string, unir: boolean, orden: number[] = []): Observable<Blob> {
    const headers = this.createAuthorizationHeader();
    const params = new HttpParams()
      .set('unir', unir.toString())
      .set('orden', orden.join(','));

    const url = `${this.apiUrl}/EstadosRobots/descargar-zip/${encodeURIComponent(paquete)}/`;

    return this.http.get(url, {
      headers,
      params,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }









}

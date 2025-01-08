import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoHvArchivoService {

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

  async getUser(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  }

  // Buscar seguimiento hv por responsable
  public buscarSeguimientoHv(responsable: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    if (responsable === 'todos') {
      return this.http.get(`${this.apiUrl}/auditoria/seguimiento_hv_archivo_responsable/`, { headers }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
    }
    else if (responsable === '3') {
      return this.http.get(`${this.apiUrl}/auditoria/seguimiento_hv_archivo_ultimas_tres_semanas/`, { headers }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
    }
    return this.http.get(`${this.apiUrl}/auditoria/seguimiento_hv_archivo_responsable/${responsable}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // Buscar seguimiento hv por id
  public buscarById(id: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/auditoria/seguimiento_hv_archivo_id/${id}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // Buscar seguimiento hv 
  public buscarSeguimientoHvGeneral(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/auditoria/seguimiento_hv_archivo_responsable/`, { headers }).pipe(
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

    const urlcompleta = `${this.apiUrl}/auditoria/seguimiento_hv_archivo_update/`;

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
    const user = await this.getUser();

    const responsable = user.primer_nombre + ' ' + user.primer_apellido;
    const urlcompleta = `${this.apiUrl}/auditoria/seguimiento_hv_archivo/`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      datos,
      responsable,
      mensaje: "muchos",
      jwt: token
    };

    try {
      const response = await firstValueFrom(this.http.post<string>(urlcompleta, data, { headers }).pipe(
        catchError(this.handleError)
      ));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un registro específico de TuAlianza usando Promises
  async actualizarRegistroTuAlianzaAsync(id: number, updated_fields: any, editar: string): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    if (editar !== 'true') {
      // añador el campo responsable a los campos actualizados
      updated_fields.responsable = await this.getUser().then((user) => user.primer_nombre + ' ' + user.primer_apellido);
    }

    const urlcompleta = `${this.apiUrl}/auditoria/seguimiento_hv_archivo_write  /`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      id,
      updated_fields
    };

    try {
      const response = await firstValueFrom(this.http.post<string>(urlcompleta, data, { headers }).pipe(
        catchError(this.handleError)
      ));
      return response;
    } catch (error) {
      throw error;
    }
  }



  // Método para enviar datos con async/await
  async enviarSeguimientoHvArchivo(datos: any): Promise<Observable<any>> {
    const headers = this.createAuthorizationHeader();

    // Esperar a obtener el usuario
    const user = await this.getUser();
    const responsable = user ? `${user.primer_nombre} ${user.primer_apellido}` : 'Desconocido';

    const body = {
      datos: datos,
      responsable: responsable
    };
    return this.http.post(`${this.apiUrl}/auditoria/cargar_data_excel_archivo/`, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para generar la comparación y descargar el archivo Excel
  generarComparacion(): Observable<Blob> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.apiUrl}/auditoria/generar_comparacion/`;
    return this.http.get(url, { headers, responseType: 'blob' }).pipe(
      map((response: Blob) => response),
      catchError(this.handleError)
    );
  }


}

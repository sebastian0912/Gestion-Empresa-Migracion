import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ContratacionService {

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

  // Buscar en contratacion por cedula para sacar los numeros
  public buscarEncontratacion(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/contratacion/buscarCandidato/${cedula}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // Editar en contratacion el correo y el telefono
  async editarContratacion_Cedula_Correo(
    id: string,
    primercorreoelectronico: string,
    celular: string,
  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/Ausentismos/editarAusentismosCedCorreo/${id}`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      celular: celular,
      primercorreoelectronico: primercorreoelectronico,
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

  // Subir archivo de formas de pago
  async subirContratacion(
    datos: any
  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/contratacion/subidadeusuariosarchivoexcel`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      datos: datos,
      mensaje: "mcuhos",
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


  // -------------------------------------------------------------------------------------
  // ----------------------------------- Arl ---------------------------------------------
  // -------------------------------------------------------------------------------------

  // Generar el excel de arl
  async generarExcelArl(
    datos: any
  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/contratacion/validarDatos/`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      datos: datos,
      mensaje: "mcuhos",
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







}

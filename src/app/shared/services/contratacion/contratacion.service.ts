import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      throw error;
    }
  }

  //
  async subirContratacionAuditoria(
    datos: any
  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/contratacion/subidadeusuariosarchivoAuditoriaexcel`;

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
      throw error;
    }
  }

  // Subir archivo de contratacion
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

    try {
      const response = await firstValueFrom(this.http.post<string>(urlcompleta, data, { headers }).pipe(
        catchError(this.handleError)
      ));
      return response;
    } catch (error) {
      throw error;
    }
  }

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
      throw error;
    }
  }

  // Cargar una única cédula
  async cargarCedula(dato: any): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/traslados/cargar-cedula`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      dato: dato,
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


  // Enviar archivos de traslados
  async enviarTraslado(data: any): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/traslados/formulario-solicitud`;

    // Crear FormData y agregar los datos
    const formData = new FormData();
    formData.append('numero_cedula', data.numero_cedula);
    formData.append('eps_a_trasladar', data.eps_a_trasladar);
    formData.append('solicitud_traslado', data.solicitud_traslado);

    try {
      const response = await firstValueFrom(this.http.post<string>(urlcompleta, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).pipe(
        catchError(this.handleError)
      ));
      return response;
    } catch (error) {
      throw error;
    }
  }


}
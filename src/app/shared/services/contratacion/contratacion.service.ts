import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable, throwError } from 'rxjs';
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
  public buscarEncontratacion(cedula: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/contratacion/buscarCandidato/${cedula}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // Buscar en contratacion por cedula para sacar los datos bio
  public buscarEncontratacionDatosBiometricos(cedula: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/contratacion/candidato/${cedula}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // check-contract/<str:codigo_contrato>/
  public checkContract(codigo_contrato: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/contratacion/check-contract/${codigo_contrato}/`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // 
  public buscarEnContratacionFormulario(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/contratacion/buscarPorMarcaTemporal/`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // Buscar datos seleccion  /Seleccion/traerDatosSeleccion/{cedula}
  public traerDatosSeleccion(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/Seleccion/traerDatosSeleccion/${cedula}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  // Servicio para traer datos de contratación
  public traerDatosContratacion(cedula: string, contrato: string): Observable<any> {
    // Crear el encabezado con la autorización
    const headers = this.createAuthorizationHeader();

    // Construir la URL con los parámetros
    const url = `${this.apiUrl}/contratacion/traerDatosContratacion/${cedula}/${contrato}`;

    // Realizar la solicitud GET
    return this.http.get(url, { headers }).pipe(
      map((response: any) => response), // Mapear la respuesta directamente
      catchError(this.handleError) // Manejar errores
    );
  }





  public traerDatosEncontratacion(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/contratacion/datosIncapacidadContratacion/${cedula}`, { headers }).pipe(
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

  // Subir archivo de contratacion para validar
  async subirContratacionValidar(
    datos: any
  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/contratacion/validarExcelContratacion`;

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

  async getUser(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
    return null;
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

  // actualizarProcesoContratacion (data)
  async actualizarProcesoContratacion(data: any): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/contratacion/actualizarProcesoContratacion/`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data2 = {
      ...data,
      jwt: token
    };
    delete data2.traslado; // Eliminar campo innecesario
    console.log(data2);

    try {
      const response = await firstValueFrom(this.http.post<string>(urlcompleta, data2, { headers }).pipe(
        catchError(this.handleError)
      ));
      return response;
    } catch (error) {
      throw error;
    }
  }


  // --------------------------------------------------------------------------------------------
  // ------------------------- Métodos para el módulo de reportes --------------------------------

  // Subir reporte completo
  async cargarReporte(datos: any): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/reportes/cargarReporte`;

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      ...datos, // Todos los campos que envías, como cedulas, traslados, etc.
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



  public obtenerTodosLosReportes(nombre: string): Observable<any> {
    const headers = this.createAuthorizationHeader();

    // Usar una sola ruta para obtener todos o filtrar por nombre
    const url = nombre === 'todos'
      ? `${this.apiUrl}/reportes/obtenerReportes`
      : `${this.apiUrl}/reportes/obtenerReportes/${nombre}`;

    return this.http.get(url, { headers }).pipe(
      map((response: any) => response),  // Mapea la respuesta
      catchError(this.handleError)       // Manejo de errores
    );
  }


  public obtenerReportesPorFechas(start: string, end: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    const params = { start, end };  // Parámetros para enviar el rango de fechas

    return this.http.get(`${this.apiUrl}/reportes/obtenerReportesFechas`, { headers, params }).pipe(
      map((response: any) => response),  // Mapea la respuesta
      catchError(this.handleError)       // Manejo de errores
    );
  }


  public obtenerReportesPorFechasCentroCosto(start: string, end: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    const params = { start, end };  // Parámetros para enviar el rango de fechas

    return this.http.get(`${this.apiUrl}/contratacion/descargarReporteFechaIngresoCentroCosto/`, { headers, params }).pipe(
      map((response: any) => response),  // Mapea la respuesta
      catchError(this.handleError)       // Manejo de errores
    );
  }



  public descargarReporteFechaIngresoCentroCostoFincas(start: string, end: string): Observable<Blob> {
    const headers = this.createAuthorizationHeader();
    const params = { start, end };

    return this.http.get(`${this.apiUrl}/contratacion/descargarReporteFechaIngresoCentroCostoFincas/`, {
      headers,
      params,
      responseType: 'blob'  // Indicar que esperamos un archivo binario
    }).pipe(
      map((response: Blob) => response),  // Mapea la respuesta a un blob
      catchError(this.handleError)        // Manejo de errores
    );
  }



  //--------------------------------------------------------------------------------------------
  // ------------------------- Métodos para el módulo de reportes de errores --------------------------------
  // --------------------------------------------------------------------------------------------

  async enviarErroresValidacion(
    payload: {
      errores: {
        registro: string; errores: any[];
      }[];
      responsable: string;
      tipo: string;
    },

  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/contratacion/guardarErroresValidacion`;  // Asegúrate de que este sea el endpoint correcto

    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    const data = {
      errores: payload.errores,
      responsable: payload.responsable,
      tipo: payload.tipo,
      jwt: token // Token de autenticación
    };

    try {
      const response = await firstValueFrom(
        this.http.post<string>(urlcompleta, data, { headers }).pipe(
          catchError((error) => {
            return throwError(() => new Error('Error en la solicitud al guardar errores de validación'));
          })
        )
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Obtener base contratacion por rango de fechas
  public obtenerBaseContratacionPorFechas(start: string, end: string): Observable<Blob> {
    const headers = this.createAuthorizationHeader();
    const params = { start, end };

    // Indicamos que el responseType será 'blob' para manejar archivos binarios
    return this.http.get(`${this.apiUrl}/contratacion/descargarReporte/`, {
      headers,
      params,
      responseType: 'blob'  // Tipo de respuesta como Blob
    }).pipe(
      map((response: Blob) => response),  // Mapea la respuesta a Blob
      catchError(this.handleError)        // Manejo de errores
    );
  }



  //--------------------------------------------------------------------------------------------
  // ------------------------- Métodos para validar informacion contratacion --------------------------------
  // --------------------------------------------------------------------------------------------


  // Validar información de contratación
  async validarInformacionContratacion(payload: {
    numeroCedula: string;
    codigoContrato: string;
    nombreQuienValidoInformacion: string;
    fechaHoraValidacion: string;
    primerApellido: string;
    segundoApellido: string;
    primerNombre: string;
    segundoNombre: string;
    fechaNacimiento: string;
    fechaExpedicionCC: string;
  }): Promise<any> {
    const urlcompleta = `${this.apiUrl}/contratacion/datosCandidatoYProceso/`; // Endpoint correcto de tu API

    const headers = this.createAuthorizationHeader();

    try {
      const response = await firstValueFrom(
        this.http.post(urlcompleta, payload, { headers }).pipe(
          catchError((error) => {
            console.error('Error en la solicitud:', error);
            return throwError(() => new Error('Error al validar información de contratación'));
          })
        )
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Servicio Angular
  public detalleLaboralContratacion(empresaUsuaria: string, sublabor: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    // Construimos los parámetros de consulta
    const params = new HttpParams()
      .set('empresa_usuaria', empresaUsuaria)
      .set('sublabor', sublabor);
    
    

    // Realizamos la solicitud GET
    return this.http.get(`${this.apiUrl}/infoCentrosCosto/detalle-laboralContratacion/`, { headers, params }).pipe(
      map((response: any) => response), // Procesamos la respuesta si es necesario
      catchError(this.handleError) // Manejamos errores
    );
  }


  async guardarOActualizarContratacion(data: any): Promise<any> {
    const token = this.getToken();
  
    if (!token) {
      throw new Error('No se encontró un token válido');
    }
  
    const urlcompleta = `${this.apiUrl}/contratacion/guardar-o-actualizar-contratacion/`;
  
    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');
  
    // Agregar el token JWT a los datos
    const dataConToken = {
      ...data,
      jwt: token
    };
  
    try {
      const response = await firstValueFrom(
        this.http.post<string>(urlcompleta, dataConToken, { headers }).pipe(
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      console.error('Error en la llamada al servicio:', error);
      throw error;
    }
  }

  // contratacion/traerCompletoContratacion/<str:codigo_contrato>/
  public traerCompletoContratacion(codigo_contrato: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/contratacion/traerCompletoContratacion/${codigo_contrato}/`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }
  




}

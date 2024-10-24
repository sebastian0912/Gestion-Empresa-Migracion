import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Incapacidad } from '../../../models/incapacidad.model';
import { Reporte } from '../../../models/reporte.model';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class IncapacidadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }
  private handleError(error: any): Observable<never> {
    throw error;
  }
  getIncapacidades(): Observable<Incapacidad[]> {
    return this.http.get<Incapacidad[]>(this.apiUrl);
  }

  getIncapacidad(id: number): Observable<Incapacidad> {
    return this.http.get<Incapacidad>(`${this.apiUrl}/${id}`);
  }
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
  
  createIncapacidad(incapacidad: Incapacidad): Observable<Incapacidad> {
    const urlcompleta = `${this.apiUrl}/Incapacidades/crearIncapacidad`;
    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    return this.http.post<Incapacidad>(urlcompleta, incapacidad, { headers });
  }
  createReporte(reporte: Reporte): Observable<Incapacidad> {
    const urlcompleta = `${this.apiUrl}/Incapacidades/crearReporte`;
    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    return this.http.post<Incapacidad>(urlcompleta, reporte, { headers });
  }

  updateIncapacidad(id: number, incapacidad: Incapacidad): Observable<Incapacidad> {
    const urlcompleta = `${this.apiUrl}/Incapacidades/modificarIncapacidad`;
    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');
    return this.http.put<Incapacidad>(`${urlcompleta}/${id}`, incapacidad, { headers });
  }
  buscar(query: string): Observable<any> {
    const urlcompleta = `${this.apiUrl}/Incapacidades/busqueda`;
    const headers = this.createAuthorizationHeader().set('Content-Type', 'application/json');

    // Asegúrate de enviar la consulta como un objeto JSON
    const body = { query }; // Correcto: enviamos un objeto JSON con la clave 'query'

    return this.http.post<any>(urlcompleta, body, { headers });
  }
  public traerDatosReporte(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/Incapacidades/datosReporte/${cedula}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }
  public traerDatosIncapacidad(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/Incapacidades/datosIncapacidad/${cedula}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }
  public traerDatosLogs(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/Incapacidades/datosLogs/${cedula}`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }
  public traerDatosListas(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/Incapacidades/traerTodaslistas`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  public traerTodosDatosIncapacidad(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/Incapacidades/traerTodasIncapacidades`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }
  public traerTodosDatosReporte(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${this.apiUrl}/Incapacidades/traerTodosReportes`, { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  processFiles(files: FileList): Observable<any> {
    if (files.length !== 2) {
      return new Observable(observer => {
        observer.error('Por favor, selecciona exactamente 2 archivos.');
      });
    }

    const fileData: { [key: string]: any[] } = {};
    const fileNames: { [key: string]: string } = {
      'arl': '',
      'sst': ''
    };
    const fileReaders: FileReader[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      fileReaders.push(reader);

      const fileName = file.name.toLowerCase();
      if (fileName.includes('arl')) {
        fileNames['arl'] = file.name;
      } else if (fileName.includes('sst')) {
        fileNames['sst'] = file.name;
      }

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const key = fileName.includes('arl') ? 'arl' : 'sst';
        fileData[key] = data;

        // Si todos los archivos han sido procesados, envía los datos
        if (Object.keys(fileData).length === 2) {
          this.uploadFiles(fileData, fileNames).subscribe(
            response => console.log('Datos enviados con éxito:', response),
            error => console.error('Error al enviar los datos:', error)
          );
        }
      };

      reader.readAsBinaryString(file);
    }

    // Devuelve un observable vacío para evitar errores
    return new Observable();
  }
  uploadFiles(fileData: { [key: string]: any[] }, fileNames: { [key: string]: string }): Observable<any> {
    const archivos = Object.keys(fileData).map(key => ({
      name: fileNames[key],
      data: fileData[key]
    }));

    // Crear un array de solicitudes HTTP usando `forkJoin`
    const requests = archivos.map(archivo => {
      const headers = this.createAuthorizationHeader();
      return this.http.post<any>(`${this.apiUrl}/Incapacidades/uploadFile`, archivo, { headers });
    });

    // Usar `forkJoin` para ejecutar todas las solicitudes en paralelo y retornar sus respuestas
    return forkJoin(requests).pipe(
      map(responses => {
        console.log('Todas las respuestas:', responses);
        // Procesar todas las respuestas aquí si es necesario
        return responses; // Retorna todas las respuestas juntas como un array
      }),
      catchError(error => {
        // Manejar errores aquí
        Swal.fire({
          icon: 'error',
          title: 'Error al subir los archivos',
          text: 'Ocurrió un error al subir los archivos, por favor intenta de nuevo.'
        });
        return error;
      })
    );
  }


  deleteIncapacidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  async subirExcelSST(
    datos: any
  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/FormasdePago/crearformasDePago`;

    const headers = this.createAuthorizationHeader();

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

  async subirExcelARL(
    datos: any
  ): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/FormasdePago/crearformasDePago`;

    const headers = this.createAuthorizationHeader();

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
}

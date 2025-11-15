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
import JSZip from 'jszip';
import saveAs from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class IncapacidadService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
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
    return token
      ? new HttpHeaders().set('Authorization', token)
      : new HttpHeaders();
  }

  createIncapacidad(incapacidad: Incapacidad): Observable<Incapacidad> {
    const urlcompleta = `${this.apiUrl}/Incapacidades/crearIncapacidad`;
    const headers = this.createAuthorizationHeader().set(
      'Content-Type',
      'application/json'
    );
    console.log('Incapacidad a crear:', incapacidad);
    return this.http.post<Incapacidad>(urlcompleta, incapacidad, { headers });
  }
  createReporte(reporte: Reporte): Observable<Incapacidad> {
    const urlcompleta = `${this.apiUrl}/Incapacidades/crearReporte`;
    const headers = this.createAuthorizationHeader().set(
      'Content-Type',
      'application/json'
    );

    return this.http.post<Incapacidad>(urlcompleta, reporte, { headers });
  }

  updateIncapacidad(
    id: number,
    incapacidad: Incapacidad
  ): Observable<Incapacidad> {
    const urlcompleta = `${this.apiUrl}/Incapacidades/modificarIncapacidad`;
    const headers = this.createAuthorizationHeader().set(
      'Content-Type',
      'application/json'
    );
    return this.http.put<Incapacidad>(`${urlcompleta}/${id}`, incapacidad, {
      headers,
    });
  }
  buscar(query: string): Observable<any> {
    const urlcompleta = `${this.apiUrl}/Incapacidades/busqueda`;
    const headers = this.createAuthorizationHeader().set(
      'Content-Type',
      'application/json'
    );

    // Asegúrate de enviar la consulta como un objeto JSON
    const body = { query }; // Correcto: enviamos un objeto JSON con la clave 'query'

    return this.http.post<any>(urlcompleta, body, { headers });
  }
  public traerDatosReporte(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .get(`${this.apiUrl}/Incapacidades/datosReporte/${cedula}`, { headers })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }
  public traerDatosIncapacidad(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .get(`${this.apiUrl}/Incapacidades/datosIncapacidad/${cedula}`, {
        headers,
      })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }
  public traerDatosLogs(cedula: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .get(`${this.apiUrl}/Incapacidades/datosLogs/${cedula}`, { headers })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }
  public traerDatosListas(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .get(`${this.apiUrl}/Incapacidades/traerTodaslistas`, { headers })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }

  public traerTodosDatosIncapacidad(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .get(`${this.apiUrl}/Incapacidades/traerTodasIncapacidades`, { headers })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }
  public traerTodosDatosReporte(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .get(`${this.apiUrl}/Incapacidades/traerTodosReportes`, { headers })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }

  processFiles(files: FileList): Observable<any> {
    if (files.length !== 2) {
      return new Observable((observer) => {
        observer.error('Por favor, selecciona exactamente 2 archivos.');
      });
    }

    const fileData: { [key: string]: any[] } = {};
    const fileNames: { [key: string]: string } = {
      arl: '',
      sst: '',
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
            (response) => {
              Swal.fire({
                title: 'Éxito',
                text: 'Datos enviados con éxito.',
                icon: 'success', // Ícono de éxito
                confirmButtonText: 'Aceptar',
              });
            },
            (error) => {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar los datos. Por favor, intenta nuevamente.',
                icon: 'error', // Ícono de error
                confirmButtonText: 'Aceptar',
              });
            }
          );
        } else {
          Swal.fire({
            title: 'Archivos incompletos',
            text: 'Por favor, procesa y sube los archivos requeridos antes de enviar.',
            icon: 'warning', // Ícono de advertencia
            confirmButtonText: 'Aceptar',
          });
        }
      };

      reader.readAsBinaryString(file);
    }

    // Devuelve un observable vacío para evitar errores
    return new Observable();
  }

  uploadFiles(
    fileData: { [key: string]: any[] },
    fileNames: { [key: string]: string }
  ): Observable<any> {
    const archivos = Object.keys(fileData).map((key) => ({
      name: fileNames[key],
      data: fileData[key],
    }));

    // Crear un array de solicitudes HTTP usando `forkJoin`
    const requests = archivos.map((archivo) => {
      const headers = this.createAuthorizationHeader();
      return this.http.post<any>(
        `${this.apiUrl}/Incapacidades/uploadFile`,
        archivo,
        { headers }
      );
    });

    // Usar `forkJoin` para ejecutar todas las solicitudes en paralelo y retornar sus respuestas
    return forkJoin(requests).pipe(
      map((responses) => {
        console.log('Todas las respuestas:', responses);
        // Procesar todas las respuestas aquí si es necesario
        return responses; // Retorna todas las respuestas juntas como un array
      }),
      catchError((error) => {
        // Manejar errores aquí
        Swal.fire({
          icon: 'error',
          title: 'Error al subir los archivos',
          text: 'Ocurrió un error al subir los archivos, por favor intenta de nuevo.',
        });
        return error;
      })
    );
  }

  deleteIncapacidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  async subirExcelSST(datos: any): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/FormasdePago/crearformasDePago`;

    const headers = this.createAuthorizationHeader();

    const data = {
      datos: datos,
      mensaje: 'mcuhos',
      jwt: token,
    };
    try {
      const response = await firstValueFrom(
        this.http
          .post<string>(urlcompleta, data, { headers })
          .pipe(catchError(this.handleError))
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async subirExcelARL(datos: any): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const urlcompleta = `${this.apiUrl}/FormasdePago/crearformasDePago`;

    const headers = this.createAuthorizationHeader();

    const data = {
      datos: datos,
      mensaje: 'mcuhos',
      jwt: token,
    };
    try {
      const response = await firstValueFrom(
        this.http
          .post<string>(urlcompleta, data, { headers })
          .pipe(catchError(this.handleError))
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // actualizar-codigos-diagnostico/
  // Servicio en Angular (IncapacidadService)
  async actualizarCodigosDiagnostico(datos: any[]): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    // URL correcta de la API Django
    const urlcompleta = `${this.apiUrl}/Incapacidades/actualizar-codigos-diagnostico/`;

    // Encabezados con autorización
    const headers = this.createAuthorizationHeader();

    try {
      // Hacemos la solicitud POST a la API Django
      const response = await firstValueFrom(
        this.http
          .post(urlcompleta, datos, { headers })
          .pipe(catchError(this.handleError))
      );

      console.log('✅ Respuesta del servidor:', response);
      return response;
    } catch (error) {
      console.error('❌ Error en la solicitud:', error);
      throw error;
    }
  }

traerTodosDocumentos(fechaInicio?: string): Observable<any[]> {
  const headers = this.createAuthorizationHeader();
  let url = `${this.apiUrl}/Incapacidades/descargarIncapacidades`;

  if (fechaInicio) {
    url += `?inicio=${fechaInicio}`;
    console.log('URL con fechaInicio:', url);
  }
  return this.http.get<any[]>(url, { headers });
}

traerTodosDocumentosPorRango(inicio: string, fin: string): Observable<any[]> {
  const headers = this.createAuthorizationHeader();
  const url = `${this.apiUrl}/Incapacidades/descargarIncapacidades?inicio=${inicio}&fin=${fin}`;
  return this.http.get<any[]>(url, { headers });
}

  // Utiliza el método anterior para descargar y crear el ZIP desde base64
async descargarTodoComoZip(fecha: string): Promise<void> {
  const zip = new JSZip();
  const documentos = await firstValueFrom(this.traerTodosDocumentos(fecha));

  const carpetaPrincipal = zip.folder(`Incapacidad con la fecha ${fecha}`);

  const promesas = documentos.map(async (doc) => {
    if (!carpetaPrincipal) throw new Error('No se pudo crear la carpeta principal en el ZIP.');
    if (!doc.Numero_de_documento) throw new Error('Documento sin número de documento.');

    // --- Verificar si hay al menos un archivo ---
    const tieneIncapacidad = !!doc.link_incapacidad;
    const tieneHC         = !!doc.historial_clinico;

    if (!tieneIncapacidad && !tieneHC) {
      // No crear carpeta, no guardar nada
      return;
    }

    // --- Solo aquí se crea la carpeta EPS ---
    const epsFolder = carpetaPrincipal.folder(doc.nombre_eps || 'Desconocida');

    // -------------------------------------
    // FORMAR NOMBRE: NumeroDocumento_Fecha
    // -------------------------------------
    const fechaObj = new Date(doc.marcaTemporal);
    const dia  = String(fechaObj.getDate()).padStart(2, '0');
    const mes  = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const anio = fechaObj.getFullYear();
    const fechaFinal = `${dia}${mes}${anio}`;

    const baseNombre = `${doc.Numero_de_documento}_${fechaFinal}`;

    // ---------------------
    // 1. INCAPACIDAD
    // ---------------------
    if (tieneIncapacidad) {
      let base64Data = doc.link_incapacidad;
      if (base64Data.startsWith('data:')) {
        base64Data = base64Data.split(',')[1];
      }

      const incapacidadBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      epsFolder?.file(`${baseNombre}.pdf`, incapacidadBytes);
    }

    // ---------------------
    // 2. HISTORIAL CLÍNICO
    // ---------------------
    if (tieneHC) {
      let base64HC = doc.historial_clinico;
      if (base64HC.startsWith('data:')) base64HC = base64HC.split(',')[1];

      const hcBytes = Uint8Array.from(atob(base64HC), c => c.charCodeAt(0));
      epsFolder?.file(`${baseNombre}_HC.pdf`, hcBytes);
    }
  });

  await Promise.all(promesas);
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `incapacidades_${fecha}.zip`);
}


async descargarZipPorRango(rango: { inicio: string; fin: string }): Promise<void> {
  const zip = new JSZip();
  const documentos = await firstValueFrom(
    this.traerTodosDocumentosPorRango(rango.inicio, rango.fin)
  );

  const carpetaPrincipal = zip.folder(`Incapacidad desde ${rango.inicio} hasta ${rango.fin}`);

  const promesas = documentos.map(async (doc) => {
    if (!carpetaPrincipal) throw new Error('No se pudo crear la carpeta principal en el ZIP.');
    if (!doc.Numero_de_documento) throw new Error('Documento sin número de documento.');

    // --- Verificar si hay al menos un archivo que guardar ---
    const tieneIncapacidad = !!doc.link_incapacidad;
    const tieneHC = !!doc.historial_clinico;

    if (!tieneIncapacidad && !tieneHC) {
      // Nada para guardar → NO crear carpeta EPS
      return;
    }

    // --- Solo aquí se crea la carpeta EPS ---
    const epsFolder = carpetaPrincipal.folder(doc.nombre_eps || 'Desconocida');

    // -------------------------------------
    // FORMAR NOMBRE: NumeroDocumento_Fecha
    // -------------------------------------
    const fechaObj = new Date(doc.marcaTemporal);
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const anio = fechaObj.getFullYear();
    const fechaFinal = `${dia}${mes}${anio}`;

    const baseNombre = `${doc.Numero_de_documento}_${fechaFinal}`;

    // ---------------------
    // 1. INCAPACIDAD
    // ---------------------
    if (tieneIncapacidad) {
      let base64Data = doc.link_incapacidad;
      if (base64Data.startsWith('data:')) {
        base64Data = base64Data.split(',')[1];
      }

      const incapacidadBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      epsFolder?.file(`${baseNombre}.pdf`, incapacidadBytes);
    }

    // ---------------------
    // 2. HISTORIAL CLÍNICO
    // ---------------------
    if (tieneHC) {
      let base64HC = doc.historial_clinico;
      if (base64HC.startsWith('data:')) base64HC = base64HC.split(',')[1];

      const hcBytes = Uint8Array.from(atob(base64HC), c => c.charCodeAt(0));
      epsFolder?.file(`${baseNombre}_HC.pdf`, hcBytes);
    }
  });

  await Promise.all(promesas);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `incapacidades_${rango.inicio}_a_${rango.fin}.zip`);
}


}

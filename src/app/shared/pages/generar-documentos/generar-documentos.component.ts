import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgForOf } from '@angular/common';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-generar-documentos',
  standalone: true,
  imports: [
    MatCardModule,
    NavbarSuperiorComponent,
    NavbarLateralComponent,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NgForOf,
  ],
  templateUrl: './generar-documentos.component.html',
  styleUrls: ['./generar-documentos.component.css'],
})
export class GenerarDocumentosComponent implements OnInit {
  isSidebarHidden = false;
  empresa: string = '';
  // Propiedades para almacenar los formularios
  datosPersonales: any = {};
  datosPersonalesParte2: any = {};
  datosTallas: any = {};
  datosConyugue: any = {};
  datosPadre: any = {};
  datosMadre: any = {};
  datosReferencias: any = {};
  datosExperienciaLaboral: any = {};
  datosHijos: any = {};
  datosParte3Seccion1: any = {};
  datosParte3Seccion2: any = {};
  datosParte4: any = {};
  selecionparte1: any = {};
  selecionparte2: any = {};
  selecionparte3: any = {};
  selecionparte4: any = {};
  pagoTransporte: any = {};
  codigoContratacion: any = '';
  documentos = [
    { titulo: 'Autorización de datos' },
    { titulo: 'Entrega de documentos' },
    { titulo: 'Ficha técnica' },
    { titulo: 'Contrato' },
  ];

  ngOnInit(): void {
    this.recuperarFormulariosDesdeLocalStorage();
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  devolvercontratacion() {
    console.log('Devolver a contratación');
    window.location.href = '/contratacion';
  }

  verPDF(documento: string) {
    console.log(`Ver PDF del documento: ${documento}`);
  }

  generarPDF(documento: string) {
    console.log(`Generar PDF del documento: ${documento}`);
    // si es Autorización de datos
    if (documento === 'Autorización de datos') {
      this.generarAutorizacionDatos();
    }
    else if (documento === 'Entrega de documentos') {
      if (this.empresa === 'APOYO LABORAL TS SAS') {
        this.generarEntregaDocsApoyo();
      }
      else if (this.empresa === 'TU ALIANZA SAS') {
        this.generarEntregaDocsAlianza();
      }
    }
    // contrato
    else if (documento === 'Contrato') {
      this.generarContratoTrabajo();
    }
  }

  recuperarFormulariosDesdeLocalStorage() {
    // Verificar si está en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const formularios = localStorage.getItem('formularios');
      if (formularios) {
        const data = JSON.parse(formularios);
        // Asignar cada formulario a su propiedad correspondiente
        this.datosPersonales = data.datosPersonales || {};
        this.datosPersonalesParte2 = data.datosPersonalesParte2 || {};
        this.datosTallas = data.datosTallas || {};
        this.datosConyugue = data.datosConyugue || {};
        this.datosPadre = data.datosPadre || {};
        this.datosMadre = data.datosMadre || {};
        this.datosReferencias = data.datosReferencias || {};
        this.datosExperienciaLaboral = data.datosExperienciaLaboral || {};
        this.datosHijos = data.datosHijos || {};
        this.datosParte3Seccion1 = data.datosParte3Seccion1 || {};
        this.datosParte3Seccion2 = data.datosParte3Seccion2 || {};
        this.datosParte4 = data.datosParte4 || {};
        this.selecionparte1 = data.selecionparte1 || {};
        this.selecionparte2 = data.selecionparte2 || {};
        this.selecionparte3 = data.selecionparte3 || {};
        this.selecionparte4 = data.selecionparte4 || {};
        this.empresa = data.empresa || '';
        this.pagoTransporte = data.pagoTransporte || {};
        console.log('Formularios recuperados:', data);
        this.codigoContratacion = localStorage.getItem('codigoContrato');
      } else {
        console.warn('No se encontraron formularios en localStorage');
      }
    } else {
      console.warn('No se puede acceder a localStorage en este entorno');
    }
  }

  // Generar autorización de datos para Apoyo Laboral y Tu Alianza
  generarAutorizacionDatos() {
    // Determinar la ruta del logo y el NIT
    let logoPath = '';
    let nit = '';
    if (this.empresa === 'APOYO LABORAL TS SAS') {
      logoPath = '/logos/Logo_AL.png';
      nit = 'NIT: 900.814.587-1';
    } else if (this.empresa === 'TU ALIANZA SAS') {
      logoPath = '/logos/Logo_TA.png';
      nit = 'NIT: 900.864.596-1';
    } else {
      console.error('Empresa no reconocida');
      return;
    }

    // Crear el documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    // Agregar logo en la esquina superior izquierda
    const imgWidth = 27;
    const imgHeight = 10;
    const marginTop = 5;
    const marginLeft = 7;
    doc.addImage(logoPath, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);

    // Agregar el NIT debajo del logo
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(nit, marginLeft, marginTop + imgHeight + 3);
    doc.setFont('helvetica', 'normal');

    // Agregar el título centrado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(
      'AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES DE CANDIDATOS',
      105,
      35,
      { align: 'center' }
    );
    // colocar mas pequeño el texto
    doc.setFontSize(8);
    // Array de párrafos
    const parrafos = [
      `${this.empresa}, tratará sus datos personales, consistentes en, pero sin limitarse a, su nombre, información de contacto, fecha y lugar de nacimiento, número de identificación, estado civil, dependientes, fotografía, antecedentes de educación y empleo, referencias personales y laborales, información sobre visas y antecedentes judiciales ("Información Personal") con el fin de (1) evaluarlo como potencial empleado de ${this.empresa}; (2) evaluar y corroborar la información contenida en su hoja de vida e información sobre la experiencia profesional y trayectoria académica (3) almacenar y clasificar su Información Personal para facilitar su acceso; `,
      `(4) proporcionar información a las autoridades competentes cuando medie requerimiento de dichas autoridades en ejercicio de sus funciones y facultades legales, en cumplimiento de un deber legal o para proteger los derechos de ${this.empresa}; (5) proporcionar información a auditores internos o externos en el marco de las finalidades aquí descritas; (6) dar a conocer la realización de eventos de interés o de nuevas convocatorias para otros puestos de trabajo; (7) verificar la información aportada y adelantar todas las actuaciones necesarias, incluida la revisión de la información aportada por usted en las distintas listas de riesgos para prevenir los riesgos para ${this.empresa} a lavado de activos, financiación del terrorismo y asuntos afines, dentro del marco de implementación de su SAGRILAFT; y todas las demás actividades que sean compatibles con estas finalidades.`,
      `Para poder cumplir con las finalidades anteriormente expuestas, ${this.empresa} requiere tratar los siguientes datos personales suyos que son considerados como sensibles: género, datos biométricos y datos relacionados con su salud (“Información Personal Sensible”). Usted tiene derecho a autorizar o no la recolección y tratamiento de su Información Personal Sensible por parte de ${this.empresa} y sus encargados. No obstante, si usted no autoriza a ${this.empresa} a recolectar y hacer el tratamiento de esta Información Personal Sensible, ${this.empresa} no podrá cumplir con las finalidades del tratamiento descritas anteriormente.`,
      `Asimismo, usted entiende y autoriza a ${this.empresa} para que verifique, solicite y/o consulte su Información Personal en listas de riesgo, incluidas restrictivas y no restrictivas, así como vinculantes y no vinculantes para Colombia, a través de cualquier motor de búsqueda tales como, pero sin limitarse a, las plataformas de los entes Administradores del Sistema de Seguridad Social Integral, las Autoridades Judiciales y de Policía Nacional, la Procuraduría General de la República, la Contraloría General de la Nación o cualquier otra fuente de información legalmente constituida y/o a través de otros motores de búsqueda diseñados con miras a verificar su situación laboral actual, sus aptitudes académicas y demás información pertinente para los fines antes señalados. ${this.empresa} realizará estas gestiones directamente, o a través de sus filiales o aliados estratégicos con quienes acuerde realizar estas actividades. ${this.empresa} podrá adelantar el proceso de consulta, a partir de su Información Personal, a través de la base de datos de la Policía Nacional, Contraloría General de la República, Contraloría General de la Nación, OFAC Sanctions List Search y otras similares. `,
      `Asimismo, usted entiende que ${this.empresa} podrá transmitir su Información Personal e Información Personal Sensible, a (i) otras oficinas del mismo grupo corporativo de ${this.empresa}, incluso radicadas en diferentes jurisdicciones que no comporten niveles de protección de datos equivalentes a los de la legislación colombiana y a (ii) terceros a los que ${this.empresa} les encargue el tratamiento de su Información Personal e Información Personal Sensible. `,
      `De igual forma, como titular de su Información Personal e Información Personal Sensible, usted tiene derecho, entre otras, a conocer, actualizar, rectificar y a solicitar la supresión de la misma, así como a solicitar prueba de esta autorización, en cualquier tiempo, y mediante comunicación escrita dirigida al correo electrónico: protecciondedatos@tsservicios.co de acuerdo al procedimiento previsto en los artículos 14 y 15 de la Ley 1581 de 2012.`,
      `En virtud de lo anterior, con su firma, ${this.empresa} podrá recolectar, almacenar, usar y en general realizar el tratamiento de su Información Personal e Información Personal Sensible, para las finalidades anteriormente expuestas, en desarrollo de la Política de Tratamiento de Datos Personales de la Firma, la cual puede ser solicitada a través de: correo electrónico protecciondedatos@tsservicios.co.`,
    ];

    // Parámetros de página y estilos
    const margenIzquierdo: number = 10;
    const margenDerecho: number = 5;
    const margenSuperior: number = 42;
    const margenInferior: number = 20;
    const anchoTexto: number = 210 - margenIzquierdo - margenDerecho; // A4 Width
    const alturaPagina: number = 297; // A4 Height
    let cursorY: number = margenSuperior; // Posición inicial en Y

    // Función para renderizar una línea justificada con negrita en casos específicos
    const renderizarLineaJustificada = (
      doc: jsPDF,
      linea: string,
      empresa: string,
      y: number,
      anchoDisponible: number,
      ultimaLinea: boolean = false
    ): void => {
      const palabras: string[] = linea.split(' ');
      let cursorX = margenIzquierdo;
    
      if (ultimaLinea || palabras.length === 1) {
        // Última línea: sin justificación, solo espacios naturales
        palabras.forEach((palabra, index) => {
          const palabraLimpia = palabra.replace(/[.,]/g, '').trim();
    
          // Aplicar negrita si es necesario
          if (
            palabraLimpia === empresa ||         // Nombre de la empresa
            /^[A-ZÁÉÍÓÚÜÑ]+$/.test(palabraLimpia) || // Palabras en mayúsculas
            /^\(\d+\)$/.test(palabraLimpia)      // Formato (1), (2), etc.
          ) {
            doc.setFont('helvetica', 'bold');
          } else {
            doc.setFont('helvetica', 'normal');
          }
    
          // Dibujar la palabra
          doc.text(palabra, cursorX, y);
          cursorX += doc.getTextWidth(palabra + ' '); // Espacio natural
        });
      } else {
        // Justificación de línea normal
        const anchoPalabras = palabras.reduce(
          (ancho, palabra) => ancho + doc.getTextWidth(palabra),
          0
        );
        const espacioExtra = (anchoDisponible - anchoPalabras) / (palabras.length - 1);
    
        palabras.forEach((palabra, index) => {
          const palabraLimpia = palabra.replace(/[.,]/g, '').trim();
    
          // Aplicar negrita si es necesario
          if (
            palabraLimpia === empresa ||         // Nombre de la empresa
            /^[A-ZÁÉÍÓÚÜÑ]+$/.test(palabraLimpia) || // Palabras en mayúsculas
            /^\(\d+\)$/.test(palabraLimpia)      // Formato (1), (2), etc.
          ) {
            doc.setFont('helvetica', 'bold');
          } else {
            doc.setFont('helvetica', 'normal');
          }
    
          // Dibujar la palabra con justificación
          doc.text(palabra, cursorX, y);
          cursorX += doc.getTextWidth(palabra) + (index < palabras.length - 1 ? espacioExtra : 0);
        });
      }
    };
    
       

    // Función para renderizar un párrafo justificado
    const renderizarParrafoJustificado = (
      doc: jsPDF,
      texto: string,
      empresa: string
    ): void => {
      const textoDividido: string[] = doc.splitTextToSize(texto, anchoTexto);
    
      textoDividido.forEach((linea: string, index: number) => {
        if (cursorY > alturaPagina - margenInferior) {
          doc.addPage();
          cursorY = margenSuperior;
        }
    
        const esUltimaLinea = index === textoDividido.length - 1;
    
        // Renderizar la línea con justificación
        renderizarLineaJustificada(
          doc,
          linea,
          empresa,
          cursorY,
          anchoTexto,
          esUltimaLinea // Pasamos si es la última línea
        );
    
        cursorY += 5; // Avanza línea por línea
      });
    
      cursorY += 3; // Espaciado adicional entre párrafos
    };
    

    // Procesar todos los párrafos
    parrafos.forEach((parrafo: string) => {
      renderizarParrafoJustificado(doc, parrafo, this.empresa);
    });

    // Línea para firma
    doc.line(10, 250, 100, 250); // Ajusta las coordenadas según el tamaño del documento

    // Firma de autorización
    doc.setFont('helvetica', 'normal'); // Asegura que el texto esté en un estilo regular
    doc.text('Firma de Autorización', 10, 255); // Texto alineado con la línea superior

    // Número de Identificación
    if (this.datosPersonales?.numerodeceduladepersona) {
      doc.text(
        `Número de Identificación: ${this.datosPersonales.numerodeceduladepersona}`,
        10,
        260
      ); // Espaciado adecuado debajo de "Firma de Autorización"
    } else {
      doc.text('Número de Identificación: No especificado', 10, 260);
    }

    // Fecha de autorización
    const fechaActual = new Date();
    const opcionesFormato: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const fechaFormateada = fechaActual.toLocaleDateString("es-ES", opcionesFormato);

    doc.text(`Fecha de Autorización: ${fechaFormateada}`, 10, 265); // Posicionado más abajo

    // Guardar el archivo PDF
    doc.save(`${this.empresa}_Autorizacion_Datos_${new Date().toISOString()}.pdf`);
  }

  // Generar el documento de entrega de documentos de Tu Alianza
  generarEntregaDocsAlianza() {
    // Crear el documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    const logoPath = '/logos/Logo_TA.png';
    const nit = 'NIT: 900.864.596-1';

    // Agregar logo en la esquina superior izquierda
    const imgWidth = 27;
    const imgHeight = 10;
    const marginTop = 5;
    const marginLeft = 7;
    doc.addImage(logoPath, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);

    // Agregar el NIT debajo del logo
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(nit, marginLeft, marginTop + imgHeight + 3);
    doc.setFont('helvetica', 'normal');
    // Dejar TA CO-RE-6 V15 Abril 01-24 en la esquina superior derecha
    doc.setFontSize(8);
    doc.text('TA CO-RE-6 V15 Abril 01-24', 170, 10);

    // Agregar el título centrado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Entrega de Documentos y Autorizaciones', 110, 20, { align: 'center' });

    // Agregar el texto con ajuste de ancho (márgenes)
    const texto =
      'Reciba un cordial saludo, por medio del presente documento afirmo haber recibido, leído y comprendido los documentos relacionados a continuación:';
    const marginLeftText = 10; // margen izquierdo
    const yPos = 25; // posición inicial del texto
    let maxWidth = 190; // ancho máximo del texto (márgenes incluidos)

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(texto, marginLeftText, yPos, { maxWidth });
    doc.setFontSize(7.5);

    // Agregar el listado numerado con negrita en los números
    const lista = [
      'Copia original del contrato Individual de trabajo',
      'Inducción General de nuestra Compañía e Información General de la Empresa Usuaria el cual incluye información sobre:'
    ];

    let y = 33; // Posición inicial después del texto

    lista.forEach((item, index) => {
      const numero = `${index + 1}) `;
      const textPosX = 10; // margen izquierdo

      // Números en negrita
      doc.setFont('helvetica', 'bold');
      doc.text(numero, textPosX, y);

      // Texto normal
      doc.setFont('helvetica', 'normal');
      const textWidth = doc.getTextWidth(numero); // Ancho del número
      doc.text(item, textPosX + textWidth, y);

      y += 5; // Espacio entre líneas
    });

    // otro titulo en negrita Fechas de Pago de Nómina y Valor del almuerzo que es descontado por Nómina o Liquidación final:
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Fechas de Pago de Nómina y Valor del almuerzo que es descontado por Nómina o Liquidación final:', 30, y);

    // Agregar la tabla con autoTable
    const tableData = [
      ['EMPRESA USUARIA', 'FECHAS DE PAGO', 'SERVICIO DE CASINO'],
      ['TURFLOR S.A.S', '15 Y 30 de cada mes', 'NO ofrece servicio de casino, por lo tanto, el trabajador debe llevarlo.'],
      ['COMERCIALIZADORA TS', '03 Y 18 de cada mes', 'NO ofrece servicio de casino, por lo tanto, el trabajador debe llevarlo.'],
      ['FRUITSFULL COMPANY S.A.S', '15 y 30 de cada mes', 'NO ofrece servicio de casino, por lo tanto, el trabajador debe llevarlo.'],
      [
        'EASY PANEL COLOMBIA S.A.S',
        'Las fechas de pago son: Mensuales el último día hábil de cada mes',
        'NO ofrece servicio de casino, por lo tanto, el trabajador debe llevarlo.'
      ]
    ];

    // Dibujar la tabla
    (doc as any).autoTable({
      startY: y + 1, // Posición inicial de la tabla
      head: [tableData[0]],
      body: tableData.slice(1),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [0, 128, 0], // Color verde para la cabecera
        textColor: [255, 255, 255], // Texto blanco
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Fondo gris claro alternativo
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 70 },
      },
    });

    y = (doc as any).lastAutoTable.finalY + 10; // Obtener la posición final de la tabla

    // texto  Teniendo en cuenta la anterior información, autorizo descuento de casino: N/A  ( X )    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Teniendo en cuenta la anterior información, autorizo descuento de casino:', 10, y - 5);
    doc.text('N/A  ( X )', 150, y - 5);

    // Forma de Pago
    doc.setFont('helvetica', 'bold').setFontSize(10);
    doc.text('FORMA DE PAGO:', 10, y);
    y += 2;

    const formaPagoSeleccionada = this.pagoTransporte?.formaPago || ''; // Valor dinámico de formaPago
    const numeroPagos = this.pagoTransporte?.numeroPagos || '';

    const opciones = [
      { nombre: 'Daviplata', x: 10, y: y + 5 },
      { nombre: 'Davivienda cta ahorros', x: 60, y: y + 5 },
      { nombre: 'Colpatria cta ahorros', x: 120, y: y + 5 },
      { nombre: 'Bancolombia', x: 10, y: y + 10 },
      { nombre: 'Otra', x: 60, y: y + 10 },
    ];

    opciones.forEach((opcion) => {
      doc.rect(opcion.x, opcion.y - 3, 4, 4); // Cuadro
      doc.setFont('helvetica', 'normal').text(opcion.nombre, opcion.x + 6, opcion.y);
      if (formaPagoSeleccionada === opcion.nombre) {
        doc.setFont('helvetica', 'bold').text('X', opcion.x + 1, opcion.y);
      }
    });

    doc.text('¿Cuál?', 115, y + 10);
    doc.line(140, y + 10, 200, y + 10); // Línea
    if (formaPagoSeleccionada === 'Otra') {
      doc.text('Especificar aquí...', 150, y + 15);
    }

    // Número TJT ó Celular / Código de Tarjeta
    y += 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold').text('Número TJT ó Celular:', 10, y);
    doc.text('Código de Tarjeta:', 110, y);

    // Colocar el dato de númeroPagos en el lugar correcto
    doc.setFont('helvetica', 'normal');
    if (formaPagoSeleccionada === 'Daviplata') {
      doc.text(numeroPagos, 60, y);
    } else {
      doc.text(numeroPagos, 150, y);
    }
    // IMPORTANTE al final
    y += 6;
    doc.setFont('helvetica', 'bold').setFontSize(9);
    const importanteTexto =
      'IMPORTANTE: Recuerde que si usted cuenta con su forma de pago Daviplata, cualquier cambio realizado en la misma debe ser notificado a la Emp. Temporal. ' +
      'También tenga presente que la entrega de la tarjeta Master por parte de la Emp. Temporal es provisional, y se reemplaza por la forma de pago DAVIPLATA; ' +
      'tan pronto Davivienda nos informa que usted activó su DAVIPLATA, se le genera automáticamente el cambio de forma de pago. ' +
      'CUIDADO! El manejo de estas cuentas es responsabilidad de usted como trabajador, por eso son personales e intransferibles.';

    const lineHeight = 5;
    const lineWidth = 190;
    const textoSubrayado = importanteTexto.split(' ');
    let x = 10;
    textoSubrayado.forEach((word) => {
      doc.text(word, x, y);
      const wordWidth = doc.getTextWidth(word + ' ');
      doc.line(x, y + 1, x + wordWidth - 1, y + 1); // Línea de subrayado
      x += wordWidth;
      if (x > lineWidth) {
        x = 10;
        y += lineHeight;
      }
    });

    // Acepto cambio sin previo aviso, SI / NO en la misma línea
    y += 5;
    doc.text('ACEPTO CAMBIO SIN PREVIO AVISO YA QUE HE SIDO INFORMADO (A):', 10, y);
    doc.setFont('helvetica', 'normal');
    doc.text('SI (     )', 170, y);
    doc.text('NO (     )', 190, y);
    doc.setFontSize(7.5);
    // Contenido numerado adicional
    const contenidoFinal = [
      { numero: '3)', texto: 'Entrega y Manejo del Carné de la Empresa de Servicios Temporales TU ALIANZA S.A.S.' },
      { numero: '4)', texto: 'Capacitación de Ley 1010 DEL 2006 (Acosos laboral) y mecanismo para interponer una queja general o frente al acoso.' },
      { numero: '5)', texto: 'Socialización Política de Libertad de Asociación Y Política de Igualdad Laboral y No Discriminación.' },
      { numero: '6)', texto: 'Curso de Seguridad y Salud en el Trabajo "SST" de la Empresa Temporal.' },
      {
        numero: '7)',
        texto: 'Se hace entrega de la documentación requerida para la vinculación de beneficiarios a la Caja de Compensación Familiar y se establece compromiso de 15 días para la entrega sobre la documentación para afiliación de beneficiarios a la Caja de Compensación y EPS si aplica. De lo contrario se entenderá que usted no desea recibir este beneficio, recuerde que es su responsabilidad el registro de los mismos.'
      },
      {
        numero: '8)',
        texto: 'Plan funeral Coorserpark: AUTORIZO la afiliación y descuento VOLUNTARIO al plan, por un valor de $4.094,5 descontados quincenalmente por Nómina. La afiliación se hace efectiva a partir del primer descuento.'
      }
    ];

    y += 7; // Posición inicial
    maxWidth = 180; // Ancho máximo del texto
    contenidoFinal.forEach((item) => {
      // Imprimir el número del elemento
      doc.setFont('helvetica', 'bold').text(item.numero, 10, y);

      // Dividir el texto en líneas
      doc.setFont('helvetica', 'normal');
      const textoEnLineas = doc.splitTextToSize(item.texto, maxWidth);

      // Imprimir el texto dividido y ajustar "y"
      doc.text(textoEnLineas, 20, y);
      y += textoEnLineas.length * lineHeight; // Calcular altura total del texto y ajustarla
      // si es el numero 8 -5 y
      if (item.numero === '7)') {
        y -= 4;
      }
    });

    // Opciones SI / NO en la misma línea
    doc.setFont('helvetica', 'bold').text('Si (      )', 170, y - 6);
    doc.text('No (      )', 190, y - 6);

    // Nota final
    doc.setFont('helvetica', 'bold').text('Nota:', 10, y - 3);
    doc.setFont('helvetica', 'normal').setFontSize(8).text(
      'Si usted autorizó este descuento debe presentar una carta en la oficina de la Temporal solicitando el retiro, para la desafiliación de este plan.',
      20,
      y - 3,
      { maxWidth: 180 }
    );

    // Mensaje con el enlace
    y += 5; // Ajustar la posición vertical
    doc.setFillColor(230, 230, 230); // Fondo gris claro
    doc.rect(10, y - 5, 190, 8, 'F'); // Rectángulo de fondo para el texto "Recuerde que:"

    doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(0, 0, 0); // Texto negro
    doc.text('Recuerde que:', 12, y);

    doc.setFont('helvetica', 'normal').setTextColor(0, 0, 0);
    doc.text('Puede encontrar esta información disponible en:', 45, y);

    // Enlace interactivo
    doc.setTextColor(0, 0, 255); // Texto azul para el enlace
    doc.textWithLink('http://tualianza.co/', 120, y, { url: 'http://tualianza.co/' });

    // Resetear color a negro para el resto del texto
    doc.setTextColor(0, 0, 0);

    // Código en negrita
    doc.setFont('helvetica', 'bold');
    doc.text('Ingresando la clave:', 155, y);
    doc.setFont('helvetica', 'bold').setFontSize(10);
    doc.text('9876', 190, y);

    // DEL COLABORADOR:
    y += 8; // Espacio después del mensaje anterior
    doc.setFont('helvetica', 'bold').setFontSize(9);
    doc.setTextColor(0, 0, 0); // Asegurarse de que el texto sea negro
    doc.text('DEL COLABORADOR:', 10, y);

    // Volver a tamaño de texto estándar
    doc.setFontSize(7.5);

    const contenidoFinalColaborador = [
      { numero: 'a)', texto: 'Por medio de la presente manifiesto que recibí lo anteriormente mencionado y que acepto el mismo.' },
      { numero: 'b)', texto: 'Leí y comprendí  el curso de inducción General y de Seguridad y Salud en el Trabajo, así como  el contrato laboral   y todas las cláusulas y condiciones establecidas.' },
      { numero: 'c)', texto: 'Información Condiciones de Salud: Manifiesto que conozco los resultados de mis exámenes médicos de ingreso y las recomendaciones dadas por el médico ocupacional.' },
    ];

    y += 5; // Posición inicial
    maxWidth = 180; // Ancho máximo del texto
    contenidoFinalColaborador.forEach((item) => {
      // Imprimir el número del elemento
      doc.setFont('helvetica', 'bold').text(item.numero, 10, y);

      // Dividir el texto en líneas
      doc.setFont('helvetica', 'normal');
      const textoEnLineas = doc.splitTextToSize(item.texto, maxWidth);

      // Imprimir el texto dividido y ajustar "y"
      doc.text(textoEnLineas, 20, y);
      y += textoEnLineas.length * lineHeight; // Calcular altura total del texto y ajustarla
    });

    y += 10; // Ajusta la posición vertical al final de todo
    //  Firma de Aceptación
    doc.setFont('helvetica', 'bold').setFontSize(8);
    // línea de firma
    doc.line(10, y, 70, y); // Ajusta las coordenadas según el tamaño del documento
    doc.text('Firma de Aceptación', 10, y + 4);
    y += 8;
    //  No de Cédula: EN NEGRITA
    doc.setFont('helvetica', 'bold').setFontSize(8);
    // Número de Identificación datosPersonales.numerodeceduladepersona
    doc.text(`No de Cédula: ${this.datosPersonales.numerodeceduladepersona}`, 10, y);

    // Tabla Huellas con encabezados correctamente dentro de un recuadro
    const tableWidth = 82; // Ancho total de la tabla
    const tableHeight = 30; // Altura de la tabla para las huellas
    const headerHeight = 8; // Altura de los encabezados
    const startX = 110; // Posición inicial X de la tabla
    const startY = y - 25; // Posición inicial Y de la tabla

    // Dibujar fondo gris para los encabezados
    doc.setFillColor(230, 230, 230);
    doc.rect(startX, startY, tableWidth / 2, headerHeight, 'F'); // Fondo "Huella Indice Derecho"
    doc.rect(startX + tableWidth / 2, startY, tableWidth / 2, headerHeight, 'F'); // Fondo "Huella pulgar Derecho"

    // Dibujar bordes alrededor de los encabezados
    doc.setDrawColor(0); // Color del borde (negro)
    doc.rect(startX, startY, tableWidth / 2, headerHeight); // Borde "Huella Indice Derecho"
    doc.rect(startX + tableWidth / 2, startY, tableWidth / 2, headerHeight); // Borde "Huella pulgar Derecho"

    // Texto de encabezado
    doc.setFont('helvetica', 'bold').setFontSize(8);
    doc.text('Huella Indice Derecho', startX + 5, startY + 5);
    doc.text('Huella pulgar Derecho', startX + tableWidth / 2 + 5, startY + 5);

    // Dibujar áreas para las huellas debajo de los encabezados
    doc.rect(startX, startY + headerHeight, tableWidth / 2, tableHeight); // Área "Huella Indice Derecho"
    doc.rect(startX + tableWidth / 2, startY + headerHeight, tableWidth / 2, tableHeight); // Área "Huella pulgar Derecho"

    // Posición vertical ajustada al final del documento
    y += 1; // Espacio adicional después del contenido final

    // Definir dimensiones de la imagen
    const width = 95;  // Ancho de la imagen
    const height = 10; // Altura de la imagen
    const x2 = 10;      // Posición X de la imagen
    const imagePath = 'firma/FirmaEntregaDocAlianza.png'; // Ruta de la imagen

    // Añadir la imagen de firma
    doc.addImage(imagePath, 'PNG', x2, y, width, height);

    // Guardar el PDF
    doc.save(`${this.empresa}_Entrega_Documentos_${new Date().toISOString().split('T')[0]}.pdf`);
  }


  // Generar documento de entrega de documentos de apoyo
  generarEntregaDocsApoyo() {
    // Crear el documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    const logoPath = '/logos/Logo_AL.png';
    const nit = 'NIT: 900.864.596-1';

    // Agregar logo en la esquina superior izquierda
    const imgWidth = 27;
    const imgHeight = 10;
    const marginTop = 5;
    const marginLeft = 7;
    doc.addImage(logoPath, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);

    // Agregar el NIT debajo del logo
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(nit, marginLeft, marginTop + imgHeight + 3);
    doc.setFont('helvetica', 'normal');

    // Dejar TA CO-RE-6 V15 Abril 01-24 en la esquina superior derecha
    doc.setFontSize(8);
    doc.text('TA CO-RE-6 V15 Abril 01-24', 170, 10);

    // Agregar el título centrado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Entrega de Documentos y Autorizaciones', 110, 20, { align: 'center' });

    // Agregar el texto con ajuste de ancho (márgenes)
    const texto =
      'Reciba un cordial saludo, por medio del presente documento afirmo haber recibido, leído y comprendido los documentos relacionados a continuación:';
    const marginLeftText = 10; // margen izquierdo
    const yPos = 25; // posición inicial del texto
    let maxWidth = 190; // ancho máximo del texto (márgenes incluidos)

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(texto, marginLeftText, yPos, { maxWidth });
    doc.setFontSize(7.5);

    // Agregar el listado numerado con negrita en los números
    const lista = [
      'Copia original del contrato Individual de trabajo',
      'Inducción General de nuestra Compañía e Información General de la Empresa Usuaria el cual incluye información sobre:'
    ];

    let y = 33; // Posición inicial después del texto

    lista.forEach((item, index) => {
      const numero = `${index + 1}) `;
      const textPosX = 10; // margen izquierdo

      // Números en negrita
      doc.setFont('helvetica', 'bold');
      doc.text(numero, textPosX, y);

      // Texto normal
      doc.setFont('helvetica', 'normal');
      const textWidth = doc.getTextWidth(numero); // Ancho del número
      doc.text(item, textPosX + textWidth, y);

      y += 5; // Espacio entre líneas
    });

    // otro titulo en negrita Fechas de Pago de Nómina y Valor del almuerzo que es descontado por Nómina o Liquidación final:
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Fechas de Pago de Nómina y Valor del almuerzo que es descontado por Nómina o Liquidación final:', 30, y);
    doc.setFontSize(7.5);

    // Agregar la tabla con autoTable
    // Datos de la tabla
    const tableData = [
      [
        { content: 'EMPRESA USUARIA', styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 128, 0], textColor: 255 } },
        { content: 'FECHAS DE PAGO', styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 128, 0], textColor: 255 } },
        { content: 'SERVICIO DE CASINO', styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 128, 0], textColor: 255 } }
      ],
      [
        { content: 'THE ELITE FLOWER S.A.S C.I.\nFUNDACIÓN FERNANDO BORRERO CAICEDO', styles: { fontStyle: 'italic', fontSize: 6.5 } },
        { content: '01 Y 16 de cada mes', styles: { fontSize: 6.5 } },
        { content: 'Valor del almuerzo $ **1.849**\nDescuento quincenal por Nómina y/o Liquidación Final', styles: { fontSize: 6.5, fontStyle: 'normal' } }
      ],
      [
        { content: 'Carnation, Florex, Jardines de Colombia, Las delicias, Normandia, Tinzuque, Tikiya, Chuzacá, y la Nena', styles: { fontStyle: 'italic', fontSize: 6.5 } },
        { content: '06 Y 21 de cada mes', styles: { fontSize: 6.5 } },
        { content: 'Valor del almuerzo $ **1.849**\nDescuento quincenal por Nómina y/o Liquidación Final', styles: { fontSize: 6.5 } }
      ],
      [
        { content: 'FANTASY FLOWER S.A.S', styles: { fontStyle: 'italic', fontSize: 8 } },
        { content: '06 Y 21 de cada mes', styles: { fontSize: 6.5 } },
        { content: 'Valor del almuerzo $ **1.849**\nDescuento quincenal por Nómina y/o Liquidación Final', styles: { fontSize: 6.5 } }
      ],
      [
        { content: 'MERCEDES S.A.S EN REORGANIZACIÓN (Las mercedes y Rosas Colombianas', styles: { fontStyle: 'italic', fontSize: 6.5 } },
        { content: '06 Y 21 de cada mes', styles: { fontSize: 6.5 } },
        { content: 'Valor del almuerzo $ **1.849**\nDescuento quincenal por Nómina y/o Liquidación Final', styles: { fontSize: 6.5 } }
      ],
      [
        { content: 'WAYUU FLOWERS S.A.S.', styles: { fontStyle: 'italic', fontSize: 6.5 } },
        { content: '06 Y 21 de cada mes', styles: { fontSize: 6.5 } },
        { content: 'Valor del almuerzo $ **1.849**\nDescuento quincenal por Nómina y/o Liquidación Final', styles: { fontSize: 6.5 } }
      ],
      [
        { content: 'Pozo azul, Postcosecha excellence, Belchite, Belchite 2.', styles: { fontStyle: 'italic', fontSize: 6.5 } },
        { content: '01 Y 16 de cada mes', styles: { fontSize: 6.5 } },
        { content: 'Valor del almuerzo $ **1.849**\nDescuento quincenal por Nómina y/o Liquidación Final', styles: { fontSize: 6.5 } }
      ],
    ];

    // Dibujar la tabla
    (doc as any).autoTable({
      startY: y + 2, // Posición inicial de la tabla
      body: tableData,
      theme: 'plain', // No aplicar estilos por defecto
      styles: {
        cellPadding: 2,
        fontSize: 6,
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 50, halign: 'center' },
        2: { cellWidth: 80, halign: 'center' },
      },
      headStyles: {
        fillColor: [255, 128, 0], // Encabezado naranja
        textColor: 255, // Texto blanco
        fontStyle: 'bold',
      },
    });


    y = (doc as any).lastAutoTable.finalY + 10; // Obtener la posición final de la tabla
    y -= 8
    // texto  Teniendo en cuenta la anterior información, autorizo descuento de casino: N/A  ( X )    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Teniendo en cuenta la anterior información, autorizo descuento de casino:', 10, y);
    doc.text('N/A  ( X )', 150, y);

    // Forma de Pago
    doc.setFont('helvetica', 'bold').setFontSize(8);
    doc.text('FORMA DE PAGO:', 10, y + 5);
    y += 4;

    const formaPagoSeleccionada = this.pagoTransporte?.formaPago || ''; // Valor dinámico de formaPago
    const numeroPagos = this.pagoTransporte?.numeroPagos || '';

    const opciones = [
      { nombre: 'Daviplata', x: 10, y: y + 5 },
      { nombre: 'Davivienda cta ahorros', x: 60, y: y + 5 },
      { nombre: 'Colpatria cta ahorros', x: 120, y: y + 5 },
      { nombre: 'Bancolombia', x: 10, y: y + 10 },
      { nombre: 'Otra', x: 60, y: y + 10 },
    ];

    opciones.forEach((opcion) => {
      doc.rect(opcion.x, opcion.y - 3, 4, 4); // Cuadro
      doc.setFont('helvetica', 'normal').text(opcion.nombre, opcion.x + 6, opcion.y);
      if (formaPagoSeleccionada === opcion.nombre) {
        doc.setFont('helvetica', 'bold').text('X', opcion.x + 1, opcion.y);
      }
    });

    doc.text('¿Cuál?', 115, y + 10);
    doc.line(140, y + 10, 200, y + 10); // Línea
    if (formaPagoSeleccionada === 'Otra') {
      doc.text('Especificar aquí...', 150, y + 15);
    }

    // Número TJT ó Celular / Código de Tarjeta
    y += 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold').text('Número TJT ó Celular:', 10, y);
    doc.text('Código de Tarjeta:', 110, y);

    // Colocar el dato de númeroPagos en el lugar correcto
    doc.setFont('helvetica', 'normal');
    if (formaPagoSeleccionada === 'Daviplata') {
      doc.text(numeroPagos, 60, y);
    } else {
      doc.text(numeroPagos, 150, y);
    }
    // IMPORTANTE al final
    y += 5;
    doc.setFont('helvetica', 'bold').setFontSize(8);
    const importanteTexto =
      'IMPORTANTE: Recuerde que si usted cuenta con su forma de pago Daviplata, cualquier cambio realizado en la misma debe ser notificado a la Emp. Temporal. ' +
      'También tenga presente que la entrega de la tarjeta Master por parte de la Emp. Temporal es provisional, y se reemplaza por la forma de pago DAVIPLATA; ' +
      'tan pronto Davivienda nos informa que usted activó su DAVIPLATA, se le genera automáticamente el cambio de forma de pago. ' +
      'CUIDADO! El manejo de estas cuentas es responsabilidad de usted como trabajador, por eso son personales e intransferibles.';

    const lineHeight = 5;
    const lineWidth = 190;
    const textoSubrayado = importanteTexto.split(' ');
    let x = 10;
    textoSubrayado.forEach((word) => {
      doc.text(word, x, y);
      const wordWidth = doc.getTextWidth(word + ' ');
      doc.line(x, y + 1, x + wordWidth - 1, y + 1); // Línea de subrayado
      x += wordWidth;
      if (x > lineWidth) {
        x = 10;
        y += lineHeight;
      }
    });

    // Acepto cambio sin previo aviso, SI / NO en la misma línea
    y += 5;

    doc.text('ACEPTO CAMBIO SIN PREVIO AVISO YA QUE HE SIDO INFORMADO (A):', 10, y);
    doc.setFont('helvetica', 'normal');
    doc.text('SI (     )', 170, y);
    doc.text('NO (     )', 190, y);
    doc.setFontSize(7.5);
    // Contenido numerado adicional
    const contenidoFinal = [
      { numero: '3)', texto: 'Entrega y Manejo del Carné de la Empresa de Servicios Temporales TU ALIANZA S.A.S.' },
      { numero: '4)', texto: 'Capacitación de Ley 1010 DEL 2006 (Acosos laboral) y mecanismo para interponer una queja general o frente al acoso.' },
      { numero: '5)', texto: 'Socialización Política de Libertad de Asociación Y Política de Igualdad Laboral y No Discriminación.' },
      { numero: '6)', texto: 'Curso de Seguridad y Salud en el Trabajo "SST" de la Empresa Temporal.' },
      {
        numero: '7)',
        texto: 'Se hace entrega de la documentación requerida para la vinculación de beneficiarios a la Caja de Compensación Familiar y se establece compromiso de 15 días para la entrega sobre la documentación para afiliación de beneficiarios a la Caja de Compensación y EPS si aplica. De lo contrario se entenderá que usted no desea recibir este beneficio, recuerde que es su responsabilidad el registro de los mismos.'
      },
      {
        numero: '8)',
        texto: 'Plan funeral Coorserpark: AUTORIZO la afiliación y descuento VOLUNTARIO al plan, por un valor de $4.094,5 descontados quincenalmente por Nómina. La afiliación se hace efectiva a partir del primer descuento.'
      }
    ];

    y += 3; // Posición inicial
    maxWidth = 190; // Ancho máximo del texto
    contenidoFinal.forEach((item) => {
      // Imprimir el número del elemento
      doc.setFont('helvetica', 'bold').text(item.numero, 10, y);

      // Dividir el texto en líneas
      doc.setFont('helvetica', 'normal');
      const textoEnLineas = doc.splitTextToSize(item.texto, maxWidth);

      // Imprimir el texto dividido y ajustar "y"
      doc.text(textoEnLineas, 20, y);
      y += textoEnLineas.length * lineHeight; // Calcular altura total del texto y ajustarla
      // si es el numero 8 -5 y
      if (item.numero === '7)') {
        y -= 4;
      }
    });

    // Opciones SI / NO en la misma línea
    doc.setFont('helvetica', 'bold').text('Si (      )', 170, y - 6);
    doc.text('No (      )', 190, y - 6);

    // Nota final
    doc.setFont('helvetica', 'bold').text('Nota:', 10, y - 3);
    doc.setFont('helvetica', 'normal').setFontSize(8).text(
      'Si usted autorizó este descuento debe presentar una carta en la oficina de la Temporal solicitando el retiro, para la desafiliación de este plan.',
      20,
      y - 3,
      { maxWidth: 180 }
    );

    y += 5; // Ajustar la posición vertical
    doc.setFillColor(230, 230, 230); // Fondo gris claro
    doc.rect(10, y - 5, 190, 5, 'F'); // Rectángulo de fondo para el texto "Recuerde que:"

    doc.setFont('helvetica', 'bold').setFontSize(7.5).setTextColor(0, 0, 0); // Texto negro
    doc.text('Recuerde que:', 12, y - 2);

    doc.setFont('helvetica', 'normal').setTextColor(0, 0, 0);
    doc.text('Puede encontrar esta información disponible en:', 35, y - 2);

    // Enlace interactivo
    doc.setTextColor(0, 0, 255); // Texto azul para el enlace
    doc.textWithLink('http://www.apoyolaboralts.com/', 105, y - 2, { url: 'http://www.apoyolaboralts.com/' });

    // Resetear color a negro para el resto del texto
    doc.setTextColor(0, 0, 0);

    // Código en negrita
    doc.setFont('helvetica', 'bold');
    doc.text('Ingresando la clave:', 155, y - 2);
    doc.setFont('helvetica', 'bold').setFontSize(8);
    doc.text('9876', 190, y - 2);

    // DEL COLABORADOR:
    y += 4; // Espacio después del mensaje anterior
    doc.setFont('helvetica', 'bold').setFontSize(8);
    doc.setTextColor(0, 0, 0); // Asegurarse de que el texto sea negro
    doc.text('DEL COLABORADOR:', 10, y);

    // Volver a tamaño de texto estándar
    doc.setFontSize(7.5);

    const contenidoFinalColaborador = [
      { numero: 'a)', texto: 'Por medio de la presente manifiesto que recibí lo anteriormente mencionado y que acepto el mismo.' },
      { numero: 'b)', texto: 'Leí y comprendí  el curso de inducción General y de Seguridad y Salud en el Trabajo, así como  el contrato laboral   y todas las cláusulas y condiciones establecidas.' },
      { numero: 'c)', texto: 'Información Condiciones de Salud: Manifiesto que conozco los resultados de mis exámenes médicos de ingreso y las recomendaciones dadas por el médico ocupacional.' },
    ];

    y += 5; // Posición inicial
    maxWidth = 180; // Ancho máximo del texto
    contenidoFinalColaborador.forEach((item) => {
      // Imprimir el número del elemento
      doc.setFont('helvetica', 'bold').text(item.numero, 10, y);

      // Dividir el texto en líneas
      doc.setFont('helvetica', 'normal');
      const textoEnLineas = doc.splitTextToSize(item.texto, maxWidth);

      // Imprimir el texto dividido y ajustar "y"
      doc.text(textoEnLineas, 20, y);
      y += textoEnLineas.length * lineHeight; // Calcular altura total del texto y ajustarla
      // si numero es b) -5 y
      if (item.numero === 'b)') {
        y -= 3;
      }
    });

    y += 10; // Ajusta la posición vertical al final de todo
    //  Firma de Aceptación
    doc.setFont('helvetica', 'bold').setFontSize(8);
    // línea de firma
    doc.line(10, y, 70, y); // Ajusta las coordenadas según el tamaño del documento
    doc.text('Firma de Aceptación', 10, y + 4);
    y += 8;
    //  No de Cédula: EN NEGRITA
    doc.setFont('helvetica', 'bold').setFontSize(8);
    // Número de Identificación datosPersonales.numerodeceduladepersona
    doc.text(`No de Identificación: ${this.datosPersonales.numerodeceduladepersona}`, 10, y);
    //  Fecha de Recibido
    doc.text(`Fecha de Recibido: ${new Date().toISOString().split('T')[0]}`, 10, y + 4);

    // Tabla Huellas con encabezados correctamente dentro de un recuadro
    const tableWidth = 82; // Ancho total de la tabla
    const tableHeight = 30; // Altura de la tabla para las huellas
    const headerHeight = 8; // Altura de los encabezados
    const startX = 110; // Posición inicial X de la tabla
    const startY = y - 25; // Posición inicial Y de la tabla

    // Dibujar fondo gris para los encabezados
    doc.setFillColor(230, 230, 230);
    doc.rect(startX, startY, tableWidth / 2, headerHeight, 'F'); // Fondo "Huella Indice Derecho"
    doc.rect(startX + tableWidth / 2, startY, tableWidth / 2, headerHeight, 'F'); // Fondo "Huella pulgar Derecho"

    // Dibujar bordes alrededor de los encabezados
    doc.setDrawColor(0); // Color del borde (negro)
    doc.rect(startX, startY, tableWidth / 2, headerHeight); // Borde "Huella Indice Derecho"
    doc.rect(startX + tableWidth / 2, startY, tableWidth / 2, headerHeight); // Borde "Huella pulgar Derecho"

    // Texto de encabezado
    doc.setFont('helvetica', 'bold').setFontSize(8);
    doc.text('Huella Indice Derecho', startX + 5, startY + 5);
    doc.text('Huella pulgar Derecho', startX + tableWidth / 2 + 5, startY + 5);

    // Dibujar áreas para las huellas debajo de los encabezados
    doc.rect(startX, startY + headerHeight, tableWidth / 2, tableHeight); // Área "Huella Indice Derecho"
    doc.rect(startX + tableWidth / 2, startY + headerHeight, tableWidth / 2, tableHeight); // Área "Huella pulgar Derecho"

    // Posición vertical ajustada al final del documento
    y += 5; // Espacio adicional después del contenido final

    // Definir dimensiones de la imagen
    const width = 95;  // Ancho de la imagen
    const height = 10; // Altura de la imagen
    const x2 = 10;      // Posición X de la imagen
    const imagePath = 'firma/FirmaEntregaDocApoyo.png'; // Ruta de la imagen

    // Añadir la imagen de firma
    doc.addImage(imagePath, 'PNG', x2, y, width, height);

    // Guardar el PDF
    doc.save(`${this.empresa}_Entrega_Documentos_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Generar contrato de trabajo
  generarContratoTrabajo() {
    // Determinar la ruta del logo y el NIT
    let logoPath = '';
    let nit = '';
    if (this.empresa === 'APOYO LABORAL TS SAS') {
      logoPath = '/logos/Logo_AL.png';
      nit = '900.814.587-1';
    } else if (this.empresa === 'TU ALIANZA SAS') {
      logoPath = '/logos/Logo_TA.png';
      nit = '900.864.596-1';
    } else {
      console.error('Empresa no reconocida');
      return;
    }

    // Crear el documento PDF en formato vertical
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      //format: 'legal',
    });

    // Posiciones iniciales
    const startX = 5;
    const startY = 5;
    const tableWidth = 205;

    // **Cuadro para el logo y NIT**
    doc.setLineWidth(0.1);
    doc.rect(startX, startY, 50, 13); // Cuadro del logo y NIT

    // Agregar logo
    doc.addImage(logoPath, 'PNG', startX + 2, startY + 1.5, 27, 10);

    // Agregar NIT
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text("NIT", startX + 32, startY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(nit, startX + 32, startY + 10);

    // **Tabla al lado del logo**
    let tableStartX = startX + 50; // Inicio de la tabla al lado del cuadro
    doc.rect(tableStartX, startY, tableWidth - 50, 13); // Borde exterior de la tabla

    // Encabezados
    doc.setFont('helvetica', 'bold');
    doc.text("PROCESO DE CONTRATACIÓN", tableStartX + 55, startY + 3);
    doc.text(this.codigoContratacion, tableStartX + 130, startY + 3);
    doc.text("CONTRATO DE TRABAJO POR OBRA O LABOR", tableStartX + 43, startY + 7);

    // Líneas divisoras
    let col1 = tableStartX + 30;
    let col2 = tableStartX + 50;
    let col3 = tableStartX + 110;

    doc.line(tableStartX, startY + 4, tableStartX + tableWidth - 50, startY + 4); // Línea horizontal bajo el título
    doc.line(tableStartX, startY + 8, tableStartX + tableWidth - 50, startY + 8); // Línea horizontal bajo el título
    doc.line(col1, startY + 8, col1, startY + 13); // Línea vertical 1
    doc.line(col2, startY + 8, col2, startY + 13); // Línea vertical 2
    doc.line(col3, startY + 8, col3, startY + 13); // Línea vertical 3

    // **Contenido de las columnas**
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text("Código: AL CO-RE-1", tableStartX + 2, startY + 11.5);
    doc.text("Versión: 07", col1 + 2, startY + 11.5); // Ajustar dentro de columna
    let fechaEmision = this.obtenerFechaActual(); // Obtener la fecha actual formateada
    doc.text(`Fecha Emisión: ${fechaEmision}`, col2 + 5, startY + 11.5);
    doc.text("Página: 1 de 3", col3 + 6, startY + 11.5); // Ajustar dentro de columna


    // Representado por
    doc.setFontSize(7);
    // Datos de titulos
    const datos = [
      { titulo: 'Representado por', valor: 'MAYRA HUAMANÍ LÓPEZ' },
      { titulo: 'Nombre del Trabajador', valor: this.datosPersonales.segundo_apellido + ' ' + this.datosPersonales.primer_apellido + ' ' + this.datosPersonales.primer_nombre + ' ' + this.datosPersonales.segundo_nombre },
      { titulo: 'Fecha de Nacimiento', valor: this.datosPersonales.fecha_nacimiento },
      { titulo: 'Domicilio del Trabajador', valor: this.datosPersonales.direccion_residencia },
      { titulo: 'Fecha de Iniciación', valor: '' },
      { titulo: 'Salario Mensual Ordinario', valor: 'S.M.M.L.V 1.300.000  Un Millon Trescientos mil Pesos M/C' },
      { titulo: 'Periódo de Pago Salario', valor: 'Quincenal' },
      { titulo: 'Subsidio de Transporte', valor: 'SE PAGA EL LEGAL VIGENTE  O SE SUMINISTRA EL TRANSPORTE' },
      { titulo: 'Forma de Pago', valor: 'Banca Móvil,  Cuenta de Ahorro o Tarjeta Monedero' },
      { titulo: 'Nombre Empresa Usuria', valor: this.selecionparte2.centroCosto },
      { titulo: 'Cargo', valor: this.selecionparte2.cargo },
      { titulo: 'Descripción de la Obra/Motivo Temporada', valor: '' },
      { titulo: 'Domicilio del patrono', valor: '' },
      { titulo: 'Tipo y No de Identificación', valor: this.datosPersonales.tipodedocumento + '        ' + this.datosPersonales.numerodeceduladepersona },
      { titulo: 'Email', valor: this.datosPersonales.direccion_residencia },
    ];
    // Configuración de columnas
    const columnWidth = 100; // Ancho de cada columna
    const rowSpacing = 3;    // Espaciado entre filas
    const columnMargin = 10; // Margen entre columnas
    const columnStartX = 5;  // Posición inicial X
    const columnStartY = startY + 17; // Posición inicial Y
    const rowsPerColumn = 12; // Número exacto de filas por columna

    // Iteración para generar el texto
    datos.forEach((item, index) => {
      const currentColumn = Math.floor(index / rowsPerColumn); // Columna actual (cada 12 filas)
      const rowInColumn = index % rowsPerColumn; // Fila dentro de la columna actual

      const x = columnStartX + currentColumn * (columnWidth + columnMargin);
      const y = columnStartY + rowInColumn * rowSpacing;

      // Establecer el título en fuente normal
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.titulo}:`, x, y);

      // Establecer el valor en fuente negrita
      doc.setFont('helvetica', 'bold');
      doc.text(item.valor, x + 30, y);
    });

    // Restaurar la fuente a la normal después del bucle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    let y = columnStartY + rowsPerColumn * rowSpacing + 5; // Posición vertical después de los datos
    // Texto adicional
    let texto = 'Entre el EMPLEADOR y el TRABAJADOR arriba indicados, se ha celebrado el contrato regulado por las cláusulas que adelante se indican, aparte de la ley, siendo ellas las siguientes: PRIMERA. El Trabajador, a partir de la fecha de iniciación, se obliga para con el EMPLEADOR a ejecutar la obra arriba indicada, sometiéndose durante su realización en todo a las órdenes de éste. Declara por consiguiente el TRABAJADOR completa y total disponibilidad para con el EMPLEADOR para ejecutar las obras indicadas en el encabezamiento, siempre que así le sean exigidas por sus clientes al EMPLEADOR. Teniendo en cuenta que, la EMPRESA USUARIA, desarrolla su actividad productiva y comercial a nivel nacional, las partes convienen en que la EMPRESA USUARIA podrá trasladar la base de operaciones de EL TRABAJADOR, en cualquier tiempo, a cualquier otro lugar donde desarrolle tales actividades sin que por ello se opere desmejora o modificación sustancial de las condiciones de trabajo ni de la categoría del TRABAJADOR, consideradas en el momento de la suscripción de este contrato. SEGUNDA. DURACIÓN DEL CONTRATO: La necesaria para la realización de la obra o labor contratada y conforme a las necesidades del patrono o establecimiento que requiera la ejecución de la obra, todo conforme a lo previsto en el Art. 45 del CST y teniendo en cuenta la fecha de iniciación de la obra; y la índole de la misma, circunstancias una y otra ya anotadas. PARÁGRAFO PRIMERO: Las partes acuerdan que por ser el TRABAJADOR contratado como trabajador en misión para ser enviado a la empresa la duración de la obra o labor no podrá superar el tiempo establecido en el Art. 77 de la Ley 50 de 1990 en su numeral 3°. PARÁGRAFO SEGUNDO: El término de duración del presente contrato es de carácter temporal por ser el EMPLEADOR una empresa de servicios temporales, y por tanto tendrá vigencia hasta la realización de la obra o labor contratada que sea indicada por las Empresas Usuarias del EMPLEADOR en este contrato, acordando las partes que para todos los efectos legales, la obra o labor contratada termina en la fecha en que la EMPRESA USUARIA, a la que será enviado el TRABAJADOR, comunique la terminación de la misma. PARÁGRAFO TERCERO: La labor se realizará de manera personal en las instalaciones de la EMPRESA.';
    // Colocar texto justificado y que se ajuste al ancho de la página, las palabras en Mayusculas tienen que ir en negrita
    const formattedWords = this.formatText(texto);

    let x = 5; // Margen izquierdo
    const lineHeight = 3.5;
    const maxWidth = 210;

    doc.setFontSize(7);

    formattedWords.forEach(({ text, bold }) => {
      if (bold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      const textWidth = doc.getTextWidth(text);
      if (x + textWidth > maxWidth) {
        x = 5; // Nueva línea
        y += lineHeight;
      }
      doc.text(text, x, y);
      x += textWidth; // Avanza en horizontal
    });

    // Centro de costo en negrita, tamaño 10, si se pasa de la página, se ajusta a la siguiente
    y += 5; // Espacio adicional después del contenido
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('CENTRO DE COSTO---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 5, y);

    // Segundo parrago
    y += 5; // Espacio adicional después del contenido
    doc.setFontSize(6.5);
    let texto2 = 'TERCERA. El salario como contraprestación del servicio será el indicado arriba, según la clasificación de oficios y tarifas determinados por el EMPLEADOR, la cual hace parte de este contrato; sometida sí en su eficiencia a que el valor a recibir corresponda al oficio respectivo efectivamente contratado con el usuario, según el tiempo laborado en la respectiva jornada, inferior a la máxima legal; éste regirá en proporción al número de horas respectivamente trabajadas y en él están los valores incluidos correspondientes a dominicales y festivos reconocidos por la ley como descanso remunerado. PARÁGRAFO PRIMERO: El patrono manifiesta expresamente que el TRABAJADOR tendrá derecho a todas las prestaciones sociales consagradas en la ley 50 de 1990 y demás estipulaciones previstas en el CST. Tales como compensación monetaria por vacaciones y prima de servicios proporcional al tiempo laborado, cualquiera que este sea. PARÁGRAFO SEGUNDO: Se conviene por las partes, que en caso de que el TRABAJADOR devengue comisiones o cualquiera otra modalidad de salario variable, el 82.5 % de dichos ingresos constituyen remuneración ordinaria y el 17.5 % restante está destinado a remunerar el descanso en días dominicales y festivos de que tratan los capítulos I y II del título VII del CST. CUARTA. EL TRABAJADOR, se someterá al horario de trabajo que señale el EMPLEADOR de acuerdo con las especificaciones del Usuario. QUINTA. PERÍODO DE PRUEBA: el período de prueba no excederá de dos (2) meses ni podrá ser superior a la quinta parte del término pactado, si el contrato tuviere una duración inferior a un año. SEXTA. EL TRABAJADOR y EL EMPLEADOR podrán convenir en repartir las horas de la jornada diaria en los términos del Art. 164 del CST., teniendo en cuenta que el descanso entre las secciones de la jornada no se computa dentro de la misma, según el art. 167 del estatuto Ibídem. Así mismo todo trabajador extra, suplementario o festivo, solo será reconocido en caso de ser exigido o autorizado a trabajar por el EMPLEADOR a solicitud de la entidad con la cual aquel tenga acuerdo de realización de trabajo o servicio. SÉPTIMA. Son justas causas para dar por terminado este contrato, además de las previstas en el art.7° del decreto 2351, las disposiciones concordantes y las consignadas en el reglamento interno del trabajo del EMPLEADOR, así como las siguientes: 1ª La terminación por cualquier causa, del contrato de prestación de servicios suscritos entre el EMPLEADOR y el USUARIO en donde prestará servicios el TRABAJADOR. 2ª El que la EMPRESA USUARIA en donde prestará servicios el TRABAJADOR, solicite el cambio de este por cualquier causa. 3ª El que la EMPRESA USUARIA en donde prestará servicios el TRABAJADOR, comunique la terminación de la obra o labor contratada. 4ª Que la EMPRESA USUARIA comunique al EMPLEADOR el incumplimiento leve de cualquiera de las obligaciones por parte del TRABAJADOR en TRES oportunidades, dos de las cuales hayan generado SANCIÓN AL TRABAJADOR. OCTAVA. Las partes acuerdan que NO CONSTITUYEN SALARIO, las sumas que ocasionalmente y por mera liberalidad reciba el TRABAJADOR del EMPLEADOR, como auxilios, gratificaciones, bonificaciones, primas extralegales, premios, bonos ocasionales, gastos de transporte adicionales y representación que el EMPLEADOR otorgue o llegue a otorgar en cualquier tiempo al TRABAJADOR, como tampoco no constituyen salario en dinero o en especie, cualquier alimentación, habitación o vestuario que entregue el EMPLEADOR, o un TERCERO al TRABAJADOR, durante la vigencia de este contrato.Tampoco constituirá salario, conforme a los términos del artículo 128 del Código Sustantivo del trabajo, cualquier bonificación o auxilio habitual, que se llegaren a acordar convencional o habitualmente entre las partes. Estos dineros, no se computarán como parte de salario para efectos de prestaciones sociales liquidables o BASE1 de éste. Al efecto el TRABAJADOR y el EMPLEADOR, así lo pactan expresamente en los términos del artículo 128 del C.S. del T. en C. Con. Con el articulo quince (15) de la ley cincuenta (50) de 1990. PARÁGRAFO PRIMERO: Las partes acuerdan que el EMPLEADOR, a su arbitrio y liberalidad podrá en cualquier momento cancelar o retirar el pago de bonificaciones habituales o esporádicas que en algún momento reconozca o hubiese reconocido al trabajador diferentes a su salario, sin que esto constituya desmejora de sus condiciones laborales; toda vez que como salario y retribución directa a favor del trabajador derivada de su actividad o fuerza laboral únicamente se pacta la suma establecida en la caratula del presente contrato. NOVENA. En caso que el TRABAJADOR requiera ausentarse de su lugar de trabajo, deberá avisar por lo menos con 24 horas de anticipación a la EMPRESA USUARIA o según lo establecido en el Reglamento Interno de la misma. DÉCIMA. CONFIDENCIALIDAD: El TRABAJADOR en virtud del presente contrato se compromete a 1) Manejar de manera confidencial la información que como tal sea presentada y entregada, y toda aquella que se genere en torno a ella como fruto de la prestación de sus servicios. 2) Guardar confidencialidad sobre esta información y no emplearla en beneficio propio o de terceros mientras conserve sus características de confidencialidad y que pueda perjudicar los intereses del EMPLEADOR o de la EMPRESA USUARIA. 3) Solicitar previamente y por escrito autorización para cualquier publicación relacionada con el tema de contrato, autorización que debe solicitarse ante el empleador. DÉCIMA PRIMERA. AUTORIZACION TRATAMIENTO DE DATOS PERSONALES, 1). De acuerdo a lo establecido en la ley 1581 de 2012, la Constitución Nacional y a las políticas establecidas por el EMPLEADOR para el caso en particular, el trabajador debe guardar reserva respecto a la protección de datos de los clientes, proveedores, compañeros, directivos del EMPLEADOR Y EMPRESA USUARIA, salvo que medie autorización expresa de cada persona para divulgar la información. 2). Guardar completa reserva sobre las operaciones, negocios y procedimientos industriales y comerciales, o cualquier otra clase de datos acerca del EMPLEADOR Y EMPRESA USUARIA que conozca por razón de sus funciones o de sus relaciones con ella, lo que no obsta para denunciar delitos comunes o violaciones del contrato de trabajo o de las normas legales de trabajo ante las autoridades competentes. DÉCIMA SEGUNDA. DECLARACIONES: Autorización Tratamiento Datos Personales “Ley de Protección de Datos 1581 de 2012 – decreto 1733 de 2013” Declaro que he sido informado que conozco y acepto la Política de Uso de Datos Personales e Información del EMPLEADOR, y que la información proporcionada es veraz, completa, exacta, actualizada y verificable. Mediante la firma del presente documento, manifiesto que conoce y acepto que cualquier consulta o reclamación relacionada con el Tratamiento de sus datos personales podrá ser elevada por escrito ante el EMPLEADOR; (¡) Que la Empresa APOYO LABORAL TS S.A.S con NIT. 900.814.586-1, con domicilio principal en la Calle 7 No. 7– 49 de Madrid, para efectos de lo dispuesto en la ley Estatutaria 1581 de 2012, el Decreto 1733 de 2013, y demás normas que lo adicionen o modifiquen relativas a la Protección de Datos Personales, es responsable del tratamiento de los datos PERSONALES QUE LE HE SUMINISTRADO. (¡¡).Que, para el ejercicio de mis derechos relacionados con mis datos personales, el EMPLEADOR ha puesto a mi disposición la línea de atención: Afiliados marcando a Bogotá 6017444002; a través del correo electrónico protecciondedatos@tsservicios.co; las oficinas del EMPLEADOR a nivel nacional o en la Carrera 112ª # 18ª 05 de Bogotá. En todo caso, he sido informado que sólo podré elevar queja por infracciones a lo dispuesto en las normas sobre Protección de Datos ante la Superintendencia de Industria y Comercio una vez haya agotado el trámite ante el EMPLEADOR o sus encargados. Conozco que la normatividad de Protección de Datos Personales tiene por objeto el desarrollo del derecho constitucional de todas las personas a conocer, actualizar y rectificar de forma gratuita la información que se recaude sobre ellas en bases de datos o archivos, y los derechos, libertades y garantías a los que se refieren el artículo 15 y 20 de la Constitución Política de Colombia. Autorizo también, de manera expresa, el envío de mensajes a través de cualquier medio que he registrado a mi EMPLEADOR el día de la contratación, para remitir comunicados internos sobre información concerniente a Seguridad Social, así como también, la notificaciones sobre licencias, permisos, cartas laborales, cesantías, ';
    let formattedWords2 = this.formatText(texto2);
    x = 5; // Margen izquierdo
    formattedWords2.forEach(({ text, bold }) => {
      if (bold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      const textWidth = doc.getTextWidth(text);
      if (x + textWidth > maxWidth) {
        x = 5; // Nueva línea
        y += lineHeight;
      }
      doc.text(text, x, y);
      x += textWidth; // Avanza en horizontal
    });
    doc.setFontSize(7);
    // Añadir otra pagina
    doc.addPage();
    y = 5; // Posición vertical al inicio de la página
    // **Cuadro para el logo y NIT**
    doc.setLineWidth(0.1);
    doc.rect(startX, startY, 50, 13); // Cuadro del logo y NIT

    // Agregar logo
    doc.addImage(logoPath, 'PNG', startX + 2, startY + 1.5, 27, 10);

    // Agregar NIT
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text("NIT", startX + 32, startY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(nit, startX + 32, startY + 10);

    // **Tabla al lado del logo**
    tableStartX = startX + 50; // Inicio de la tabla al lado del cuadro
    doc.rect(tableStartX, startY, tableWidth - 50, 13); // Borde exterior de la tabla

    // Encabezados
    doc.setFont('helvetica', 'bold');
    doc.text("PROCESO DE CONTRATACIÓN", tableStartX + 55, startY + 3);
    doc.text(this.codigoContratacion, tableStartX + 130, startY + 3);
    doc.text("CONTRATO DE TRABAJO POR OBRA O LABOR", tableStartX + 43, startY + 7);

    // Líneas divisoras
    col1 = tableStartX + 30;
    col2 = tableStartX + 50;
    col3 = tableStartX + 110;

    doc.line(tableStartX, startY + 4, tableStartX + tableWidth - 50, startY + 4); // Línea horizontal bajo el título
    doc.line(tableStartX, startY + 8, tableStartX + tableWidth - 50, startY + 8); // Línea horizontal bajo el título
    doc.line(col1, startY + 8, col1, startY + 13); // Línea vertical 1
    doc.line(col2, startY + 8, col2, startY + 13); // Línea vertical 2
    doc.line(col3, startY + 8, col3, startY + 13); // Línea vertical 3

    // **Contenido de las columnas**
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text("Código: AL CO-RE-1", tableStartX + 2, startY + 11.5);
    doc.text("Versión: 07", col1 + 2, startY + 11.5); // Ajustar dentro de columna
    fechaEmision = this.obtenerFechaActual(); // Obtener la fecha actual formateada
    doc.text(`Fecha Emisión: ${fechaEmision}`, col2 + 5, startY + 11.5);
    doc.text("Página: 2 de 3", col3 + 6, startY + 11.5); // Ajustar dentro de columna

    // texto adicional
    y = columnStartY; // Posición inicial Y
    doc.setFontSize(6.5);
    let texto3 = 'citaciones, memorandos, y todos aquellos procesos internos que conlleven a la comunicación entre el EMPLEADOR y el EMPLEADO. (iii) Notificación sobre desprendibles de pagos de Nómina y/o liquidación final. En adición y complemento de las autorizaciones previamente otorgadas, autorizo de manera expresa y previa sin lugar a pagos ni retribuciones al EMPLEADOR, a sus sucesores, cesionarios a cualquier título o a quien represente los derechos, para que efectúe el Tratamiento de mis Datos Personales de la  manera y para las finalidades que se señalan a continuación. Para efectos de la presente autorización, se entiende por “Datos Personales” la información personal que suministre por cualquier medio, incluyendo, pero sin limitarse a, aquella de carácter financiero, crediticio, comercial, profesional, sensible (tales como mis huellas, imagen, voz, entre otros), técnico y administrativo, privada, semiprivada o de cualquier naturaleza pasada, presente o futura, contenida en cualquier medio físico, digital o electrónico, entre otros y sin limitarse a documentos, fotos, memorias USB, grabaciones, datos biométricos, correos electrónicos y video grabaciones. Así mismo, se entiende por “Tratamiento” el recolectar, consultar, recopilar, evaluar, catalogar, clasificar, ordenar, grabar, almacenar, actualizar, modificar, aclarar, reportar, informar, analizar, utilizar, compartir, circular, suministrar, suprimir, procesar, solicitar, verificar, intercambiar, retirar, trasferir, transmitir, o divulgar, y en general, efectuar cualquier operación o conjunto de operaciones sobre mis Datos Personales en medio físicos, digitales, electrónicos, o por cualquier otro medio. La autorización que otorgo por el presente medio para el Tratamiento de mis Datos Personales tendrá las siguientes finalidades: a. Promocionar, comercializar u ofrecer, de manera individual o conjunta productos y/o servicios propios u ofrecidos en alianza comercial, a través de cualquier medio o canal, o para complementar, optimizar o profundizar el portafolio de productos y/o servicios actualmente ofrecidos. Esta autorización para el Tratamiento de mis Datos Personales se hace extensiva a las entidades subordinadas de EL EMPLEADOR, o ante cualquier sociedad en la que éstas tengan participación accionaria directa o indirectamente (en adelante “LAS ENTIDADES AUTORIZADAS”). a. autoriza explícitamente al EMPLEADOR, en forma previa, expresa e informada, para que directamente o a través de sus empleados, asesores, consultores, empresas usuarias, proveedores de servicios de selección, contratación, exámenes ocupacionales, estudios de seguridad, dotación y elementos de protección personal, capacitaciones, cursos, Fondos de empleados, Fondos funerarios, Empresas del Sistema de Seguridad Social: Fondos de Pensiones, EPS, Administradoras de Riesgos Laborales, Cajas de Compensación Familiar, entre otros: 1. A realizar cualquier operación que tenga una finalidad lícita, tales como la recolección, el almacenamiento, el uso, la circulación, supresión, transferencia y  transmisión (el “Tratamiento”) de los datos personales relacionados con su vinculación laboral y con la ejecución, desarrollo y terminación del presente contrato de trabajo, cuya finalidad incluye, pero no se limita, a los procesos verificación de la aptitud física del TRABAJADOR para desempeñar en  forma eficiente  las labores sin impactar negativamente  su salud o la  de terceros, las afiliaciones del TRABAJADOR y sus beneficiarios al Sistema general de seguridad social y parafiscales, la remisión del TRABAJADOR para que realice apertura de cuenta de nómina, archivo y procesamiento de nómina, gestión y archivo de procesos disciplinarios, archivo de documentos soporte de su vinculación contractual, reporte ante autoridades administrativas, laborales, fiscales o judiciales, entre otras, así como el cumplimiento de obligaciones legales o contractuales del EMPLEADOR con terceros, la debida ejecución del Contrato de trabajo, el cumplimiento de las políticas internas del EMPLEADOR, la verificación del cumplimiento de las obligaciones del TRABAJADOR, la administración de sus sistemas de información y comunicaciones, la generación de copias y archivos de seguridad de la información en los equipos proporcionados por EL EMPLEADOR. Además,  la información personal se recibirá y utilizará para efectos de administración del factor humano en temas de capacitación laboral, bienestar social, cumplimiento de normas de seguridad laboral y seguridad social, siendo necesario, en algunos eventos, recibir información sensible sobre estados de salud e información de menores de edad beneficiarios de esquemas de seguridad social, así como la información necesaria para el cumplimiento de obligaciones laborales de orden legal y extralegal. Toda la anterior información se tratará conforme a las exigencias legales en cada caso. 2. EL TRABAJADOR conoce el carácter facultativo de entregar o no al EMPLEADOR sus datos sensibles. 3. EL TRABAJADOR autoriza al responsable del tratamiento de manera expresa a dar tratamiento a los datos sensibles del titular, siendo esto datos los siguientes: origen racial o étnico, orientación sexual, filiación política o religiosa, datos referentes a la salud, datos biométricos, actividad en organizaciones sindicales o de derechos humanos, 4.EL TRABAJADOR da autorización expresa al responsable del tratamiento para que capture y use la información personal y sensible de sus hijos menores de edad. b.  Como elemento de análisis en etapas pre-contractuales, contractuales, y post-contractuales para establecer y/o mantener cualquier relación contractual, incluyendo como parte de ello, los siguientes propósitos: (i). Actualizar bases de datos y tramitar la apertura y/o servicios en EL EMPLEADOR o en cualquiera de las ENTIDADES AUTORIZADAS, (ii). Evaluar riesgos derivados de la relación contractual potencial, vigente o concluida. (iii). Realizar, validar,   autorizar o verificar transacciones incluyendo, cuando sea requerido, la consulta y reproducción de datos sensibles tales como la huella, imagen o la voz. (iv). Obtener conocimiento del perfil comercial o transaccional del titular, el nacimiento, modificación, celebración y/ o extinción de obligaciones directas, contingentes o indirectas, el incumplimiento de las obligaciones que adquiera con EL EMPLEADOR  o con cualquier tercero, así como cualquier novedad en relación con tales obligaciones, hábitos de pago y comportamiento  crediticio con EL EMPLEADOR y/o terceros. (v). Conocer información acerca de mi manejo de cuentas corrientes, ahorros, depósitos, tarjetas de crédito, comportamiento comercial, laboral y demás productos o servicios y, en general, del cumplimiento y manejo de mis créditos y obligaciones, cualquiera que sea su naturaleza. Esta autorización comprende información referente al manejo, estado, cumplimiento de las relaciones, contratos y servicios, hábitos de pago, incluyendo aportes al sistema de seguridad social, obligaciones y las deudas vigentes, vencidas sin cancelar, procesos, o la utilización indebida de servicios financieros. (vi). Dar cumplimiento a sus obligaciones legales y contractuales. (vii). Ejercer sus derechos, incluyendo los referentes a actividades de cobranza judicial y extrajudicial y las gestiones conexas para obtener el pago de las obligaciones a cargo del titular o de su empleador, si es el caso. (viii). Implementación de software y servicios tecnológicos. Para efectos de lo dispuesto en el presente literal b, EL EMPLEADOR  en lo que resulte aplicable, podrá efectuar el Tratamiento de mis Datos Personales  ante entidades de consulta, que manejen o administren bases de datos para los fines legalmente definidos, domiciliadas en Colombia o en el exterior, sean personas naturales o jurídicas, colombianas o extranjeras. c. Realizar ventas cruzadas de productos y/o servicios ofrecidos por EL EMPLEADOR o por cualquiera de LAS ENTIDADES  AUTORIZADAS o sus aliados comerciales, incluyendo la celebración de convenios de marca compartida. d. Elaborar y reportar información estadística, encuestas de satisfacción, estudios y análisis de mercado, incluyendo la posibilidad de contactarme para dichos propósitos. e. Enviar mensajes, notificaciones o alertas a través de cualquier medio para remitir extractos, divulgar información legal, de seguridad, promociones, campañas comerciales, publicitarias, de mercadeo, institucionales o de educación financiera, sorteos, eventos u otros beneficios e informar al titular acerca de las innovaciones efectuadas en sus productos y/o servicios, dar a conocer las mejoras o cambios en sus canales de atención, así como dar a conocer otros servicios y/o productos ofrecidos por EL EMPLEADOR;  LAS ENTIDADES AUTORIZADAS o sus aliados comerciales. f.  Llevar  a  cabo  las  gestiones  pertinentes,  incluyendo  la  recolección  y  entrega  de  información ante autoridades públicas o privadas, nacionales o extranjeras con competencia sobre EL EMPLEADOR, LAS ENTIDADES  AUTORIZADAS o sobre sus actividades, productos y /o servicios, cuando se requiera para dar cumplimiento a sus deberes legales o reglamentarios, incluyendo dentro de estos, aquellos referentes a la prevención de la evasión fiscal, lavado de activos y financiación del terrorismo u otros propósitos similares emitidas por autoridades competentes,  g. validar información con las diferentes bases de datos de EL EMPLEADOR, de LAS ENTIDADES AUTORIZADAS, de autoridades y/o entidades estatales y de terceros tales como  operadores de información y demás entidades que formen parte del Sistema de Seguridad Social Integral, empresas prestadoras de servicios públicos  y de telefonía móvil, entre otras, para desarrollar las actividades propias de objeto social principal y conexo y/o cumplir con obligaciones legales. h. Para que mis datos Personales puedan ser utilizados como medio de prueba. Los Datos Personales suministrados podrán circular y transferirse a la totalidad de las áreas de EL EMPLEADOR incluyendo proveedores de servicios, usuarios de red, redes de distribución y personas que realicen la promoción de sus productos y servicios, incluidos call centers, domiciliados en Colombia o en el exterior, sean personas naturales o jurídicas, colombianas o extranjeros a su fuerza comercial, equipos de telemercadeo y/o procesadores de datos que trabajen en nombre de EL EMPLEADOR, incluyendo pero sin limitarse, contratistas, delegados, outsourcing, tercerización, red de oficinas o aliados, con el objeto de desarrollar servicios de alojamiento de sistemas, de mantenimiento, servicios de análisis, servicios de mensajería por e-mail o correo físico, servicios de entrega, gestión de transacciones de pago, cobranza, entre otros. En consecuencia, el titular entiende y acepta que mediante la presentación autorización concede a estos terceros, autorización para acceder a sus Datos Personales en la medida en que así lo requieren  para la prestación de los servicios para los cuales fueron contratados y sujeto al cumplimiento de los deberes que les correspondan como encargados del Tratamiento de mis Datos Personales. Igualmente, a EL EMPLEADOR para compartir mis datos Personales con las entidades gremiales a las que pertenezca la entidad, para fines comerciales, estadísticos y de estudio y análisis de mercadeo. Es entendido que las personas naturales y jurídicas, nacionales y extranjeras mencionadas anteriormente ante las cuales EL EMPLEADOR puede llevar a cabo el Tratamiento de mis Datos Personales, también cuentan con mi autorización para permitir dicho Tratamiento. Adicionalmente, mediante el otorgamiento de la presente autorización, manifiesto: (i) que los Datos Personales suministrados son veraces, verificables y completos, (ii) que conozco y entiendo que el suministro de la presente autorización es voluntaria, razón por la cual no me encuentro obligado a otorgar la presenta autorización, (iii) que conozco y entiendo que mediante la simple presentación de una comunicación escrita puedo limitar en todo o en parte el alcance de la presente autorización  para que, entre otros, la misma se otorgue únicamente frente a EL EMPLEADOR pero no frente a LAS ENTIDADES AUTORIZADAS y (iv) haber sido informado  sobre mis derechos a conocer, actualizar y rectificar mis Datos Personales, el carácter facultativo de mis respuestas a las preguntas que sean hechas cuando versen sobre datos sensibles o sobre datos de los niños, niñas o adolescentes, solicitar prueba de la autorización otorgada para su tratamiento, ser informado sobre el uso que se ha dado a los mismo, presentar quejas ante la autoridad competente por infracción a la ley una vez haya agotado el trámite de consulta o reclamo ante EL EMPLEADOR, revocar la presentación autorización, solicitar la supresión de sus datos en los casos en que sea procedente y ejercer en forma gratuita mis derechos y garantías constitucionales y legales. EL EMPLEADOR informa que el tratamiento de sus Datos Personales se efectuará de acuerdo con la Política de la entidad en esta materia, la cual puede ser consultada en sus instalaciones. DÉCIMA  TERCERA. AUTORIZACIÓN DE DESCUENTOS: El TRABAJADOR autoriza expresamente al EMPLEADOR para que se descuenten de mi salario y  prestaciones o cualquier otro concepto las sumas que por error  haya recibido, permitiendo que el EMPLEADOR compense del valor de los salarios, prestaciones legales o extralegales, indemnizaciones y otro tipo de dinero a pagar al momento de la Nómina y/o liquidación las sumas que yo como TRABAJADOR esté  debiendo al EMPLEADOR Y EMPRESA USUARIA por los siguientes conceptos: Préstamos debidamente autorizados por escrito; valor de los elementos de trabajo y mercancías extraviadas bajo mi responsabilidad y que llegaren a faltar al momento de hacer entrega del inventario; los valores que se me hubieren confiado para mi manejo y que hayan sido dispuestos abusivamente para otros propósitos en perjuicio del EMPLEADOR;   los anticipos o sumas no legalizadas con las facturas o comprobantes requeridos que me fueron  entregadas ';
    let formattedWords3 = this.formatText(texto3);
    x = 5; // Margen izquierdo
    formattedWords3.forEach(({ text, bold }) => {
      if (bold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      const textWidth = doc.getTextWidth(text);
      if (x + textWidth > maxWidth) {
        x = 5; // Nueva línea
        y += lineHeight;
      }
      doc.text(text, x, y);
      x += textWidth; // Avanza en horizontal
    });

    // agregar pagina
    doc.addPage();

    y = 5; // Posición vertical al inicio de la página
    doc.setFontSize(7);
    // **Cuadro para el logo y NIT**
    doc.setLineWidth(0.1);
    doc.rect(startX, startY, 50, 13); // Cuadro del logo y NIT

    // Agregar logo
    doc.addImage(logoPath, 'PNG', startX + 2, startY + 1.5, 27, 10);

    // Agregar NIT
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text("NIT", startX + 32, startY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(nit, startX + 32, startY + 10);

    // **Tabla al lado del logo**
    tableStartX = startX + 50; // Inicio de la tabla al lado del cuadro
    doc.rect(tableStartX, startY, tableWidth - 50, 13); // Borde exterior de la tabla

    // Encabezados
    doc.setFont('helvetica', 'bold');
    doc.text("PROCESO DE CONTRATACIÓN", tableStartX + 55, startY + 3);
    doc.text(this.codigoContratacion, tableStartX + 130, startY + 3);
    doc.text("CONTRATO DE TRABAJO POR OBRA O LABOR", tableStartX + 43, startY + 7);

    // Líneas divisoras
    col1 = tableStartX + 30;
    col2 = tableStartX + 50;
    col3 = tableStartX + 110;

    doc.line(tableStartX, startY + 4, tableStartX + tableWidth - 50, startY + 4); // Línea horizontal bajo el título
    doc.line(tableStartX, startY + 8, tableStartX + tableWidth - 50, startY + 8); // Línea horizontal bajo el título
    doc.line(col1, startY + 8, col1, startY + 13); // Línea vertical 1
    doc.line(col2, startY + 8, col2, startY + 13); // Línea vertical 2
    doc.line(col3, startY + 8, col3, startY + 13); // Línea vertical 3

    // **Contenido de las columnas**
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text("Código: AL CO-RE-1", tableStartX + 2, startY + 11.5);
    doc.text("Versión: 07", col1 + 2, startY + 11.5); // Ajustar dentro de columna
    fechaEmision = this.obtenerFechaActual(); // Obtener la fecha actual formateada
    doc.text(`Fecha Emisión: ${fechaEmision}`, col2 + 5, startY + 11.5);
    doc.text("Página: 2 de 3", col3 + 6, startY + 11.5); // Ajustar dentro de columna

    y = columnStartY; // Posición inicial Y
    doc.setFontSize(6.5);
    let texto4 = 'para  gastos  o  viajes,  así  como  el  valor de los tiquetes aéreos no devueltos; las sumas que llegaren a faltar en cumplimiento de mis funciones y a mi cargo previa liquidación y verificación de las mismas, Compra de Flor y/o servicio de alimentación suministrado a través de la Empresa Usuaria de manera quincenal y por el monto de alimentación establecido, todo lo que exceda de valores aprobados (Celulares, Tarjetas de Crédito, etc.), modificaciones en las Bases de Datos sin el soporte correspondiente, errores de digitación y procedimientos internos que por mi culpa afecten económicamente a la empresa y cualquier pago que me haya sido realizado y que no me corresponda.  De  igual  forma,  en  caso  de  recibir  Subsidio  de Transporte y  Bonificaciones,  autorizo  la deducción  cuando se  causen ausencias al trabajo por cualquier motivo en el mes por el cual recibí pago completo. Por lo anterior, autorizo expresamente al EMPLEADOR para que retenga y cobre de mi salario y liquidación final, de cualquier otro concepto a mi favor, de mis Cesantías consignadas en el fondo de Cesantías los saldos que esté adeudando por los conceptos anteriormente citados.  DÉCIMA CUARTA. Las prestaciones sociales se liquidarán y pagaran una vez el TRABAJADOR haya diligenciado el Paz y Salvo en la compañía donde labore en misión y se pagarán en las fechas estipuladas según la  ley.  DÉCIMA QUINTA. AUTORIZACIÓN CONSIGNACION DE PAGO DE LIQUIDACIÓN FINAL O DEFINITIVA, A través del presente documento y en pleno uso de mis facultades legales e intelectuales, doy la autorización a mi EMPLEADOR,  para que me consigne el valor que corresponda a mi liquidación final o definitiva en la misma forma de pago asignada para mi Nómina, dentro de las fechas establecidas y otorgadas por la empresa; De igual manera autoriza al EMPLEADOR, en el evento en que se niegue o no sea posible recibirla directamente, para que deposite en la mencionada cuenta el monto de su liquidación final de contrato de trabajo. Autorizo también, para que me sea notificado mediante correo electrónico, mensaje de texto, whatsapp o cualquier medio registrado, el desprendible de mi liquidación definitiva con la descripción del pago y todos los documentos correspondientes a mi desvinculación laboral. DÉCIMA SEXTA. CONSENTIMIENTO INFORMADO. Exámenes toxicológicos: manifiesto que conozco la política de prevención de consumo de alcohol, y otras sustancias psicoactivas de la Empresa Usuaria, así como también la Política de la Empresa  de Servicios Temporales APOYO LABORAL TS S.A.S., (en adelante E.S.T.) Por lo tanto, sé que no debo presentarme en sus instalaciones a ejecutar las actividades para las cuales fui contratado en calidad de trabajador en misión por la E.S.T. bajo los efectos de alguna de estas sustancias o en su defecto, consumirlas durante el tiempo que dure mi permanencia ya que pongo en riesgo mi salud, mi seguridad y la de las personas que se encuentren presentes en las instalaciones. Por lo anterior, autorizo para que se me practiquen cuestionarios y/o pruebas (incluso médicas y de laboratorio), de manera preventiva, aleatoria o por confirmación, toda vez que ya me encuentre laborando dentro de las instalaciones de la empresa,  con el objeto de determinar mi aptitud física y mental para llevar a cabo las actividades contratadas, en virtud de la investigación disciplinaria que realice la Empresa y que lo amerite, o en cualquier momento cuando así lo estime pertinente la Compañía, y que los podrá utilizar como pruebas para los mismos fines. Dichas pruebas y exámenes podrán incluir las relativas al consumo de alcohol y sustancias psicoactivas, las cuales se practicarán con la metodología que la empresa usuaria establezca. En el evento en que alguna de las pruebas tenga resultado “positivo” para consumo o en caso de comprobarse el incumplimiento de las obligaciones a mi cargo en relación con esta política, la empresa usuaria informará de dicha situación a la E.S.T. a la cual me encuentro vinculado, quien es mi verdadero empleador y de manera adicional, podrá solicitar mi retiro de sus instalaciones. Autorizo que la empresa usuaria, conserve el documento que contiene los resultados, siempre y cuando lo haga con la debida reserva. La decisión que aquí manifiesto la he tomado de manera autónoma  , libre  y  voluntaria  y  por  tanto, no considero que las mencionadas pruebas y las atribuciones que aquí acepto para la empresa constituyan injerencias indebidas e inconsultas sobre mis derechos a la intimidad y al libre desarrollo de mi personalidad. DÉCIMA SEPTIMA. ENTREGA Y ACEPTACIÓN DEL CARGO Y  FUNCIONES ASIGNADAS. En   forma   atenta   le   informamos   que   en   el   ejercicio   de   su   cargo  asignado para la  Empresa Usuaria donde ingresa como trabajador en misión,  usted desarrollará  algunas de las siguientes funciones según su cargo: * Operario de Cultivo y/o Oficios Varios: Labores de Cultivo que incluyen Corte de Flor, Limpieza de Camas y Plantas, Labores Culturales, Riego, Fumigación (1),  Monitoreo, Pesaje de Productos, Transporte de Flor, Control y Calidad, erradicaciones, Enmalle, Desbotone y todas las labores de Mantenimiento de los Cultivos. *Operario de Poscosecha y/o Oficios Varios: Labores de Poscosecha como Clasificación, Boncheo, Encapuchado, Empaque, Recepción, Manejo de inventarios, Cuarto frío,  Control y Calidad y/ oficios varios. *Operario Mantenimiento: Labores de Mantenimiento, Poda de Prado, Manejo de Maquinaria Agrícola, Electricista, Electromecánico, Soldador, Maestro de Construcción, Ayudante de Construcción, Mantenimiento de Cubiertas Plásticas e Infraestructura y Redes (2) *Labores de Conducción, Auxiliar de Conducción, Logística e Inventarios y/ Oficios Varios*Apoyo/Reemplazos Administrativos: Asistente de Producción, Asistente de Poscosecha, Asistente de Gestión Humana,  Comerciales y/ Oficios Varios*Todas las demás labores asignadas por la Empresa Usuaria y que contemple el cargo para el cuál fue contratado. Igualmente, le indicamos que el incumplimiento a las funciones antes relacionadas, será calificado como falta grave y por tanto como justa causa para la finalización del contrato de trabajo, de conformidad con lo previsto en el artículo 7) literal a) numeral 6) del Decreto 2351 de 1965, norma que subrogó el artículo 62 del código Sustantivo de Trabajo,  en concordancia con lo previsto el numeral 1° del artículo 58 del mismo Estatuto. PARÁGRAFO PRIMERO. El TRABAJADOR, deberá responder por todos y cada uno de los elementos de trabajo que le entregue EL EMPLEADOR y/o la EMPRESA USUARIA para el desempeño de su cargo. DÉCIMA OCTAVA. El TRABAJADOR, debe registrar en las oficinas del EMPLEADOR, su dirección, número de teléfono y domicilio y dar aviso inmediato en cualquier cambio que ocurra. DÉCIMA NOVENA. El TRABAJADOR, debe respetar y someterse al Reglamento de Trabajo vigente de ambas empresas en todas sus partes, cuyo texto manifiesta conocer en todas sus partes. VIGÉSIMA. EL TRABAJADOR acepta, entiende y conoce que EL EMPLEADOR, tiene la obligación legal de prevenir y controlar el lavado de activos y la financiación del terrorismo, por tanto, expresa de manera voluntaria e inequívoca, que no se encuentra vinculado  ni ha sido condenado por parte de las autoridades nacionales e internacionales en cualquier tipo de investigación por delitos de narcotráfico, terrorismo, secuestro, lavado de activos, financiación del terrorismo y administración de recursos relacionados con actividades terroristas  y/o cualquier delito colateral o subyacente a estos; ni se encuentra incluido en listas para el control de lavado de activos  y financiación del terrorismo, administradas por cualquier autoridad nacional o extranjera. Convienen las partes, conforme a lo establecido en el numeral 6º del artículo séptimo del decreto 2351 de 1.965, que la inexactitud en la manifestación del EL TRABAJADOR contenida en la presente adición al contrato de trabajo, constituye falta grave y dará lugar a la terminación del contrato de trabajo por justa causa de despido. VIGÉSIMA PRIMERA. INCAPACIDADES MÉDICAS: Si EL TRABAJADOR, por causa de enfermedad o accidente, no asistiere a su trabajo, deberá presentar a EL EMPLEADOR, a la mayor brevedad, la respectiva incapacidad, a cuyo efecto se establece que exclusivamente será válida la expedida por los médicos de la respectiva Entidad Promotora de Salud, para justificar las ausencias antedichas. VIGÉSIMA SEGUNDA. AUTORIZACIÓN DE ACCESO A HISTÓRIA CLÍNICA: De acuerdo con lo establecido en el artículo 34 de la Ley 23 de 1981 y la Resolución 1995 de 1999 expedida por el Ministerio de Salud, EL TRABAJADOR autoriza expresamente a EL EMPLEADOR para que tenga acceso y copia de su historia clínica, así como de todos aquellos datos que en aquélla se registren o lleguen a ser registrados, con el fin de adelantar todos los trámites que sean necesarios ante entidades como Empresas Promotoras de Salud (EPS),  Administradoras de Riesgos laborales (ARL), Administradoras de Fondos de Pensiones (AFP), Instituciones Prestadoras de Salud (IPS), médicos particulares y demás entidades de la Seguridad Social. VIGÉSIMA TERCERA. REGLAMENTO DE TRABAJO Y DE HIGIENE Y SEGURIDAD INDUSTRIAL. El TRABAJADOR deja constancia de que conoce y acepta el Reglamento de Trabajo y el Reglamento de Higiene y Seguridad Industrial del TRABAJADOR. VIGÉSIMA CUARTA. El TRABAJADOR ha leído, entiende y acepta de manera íntegra todo el contenido del presente contrato y manifiesta bajo la gravedad de juramento, que no sufre de problemas de alcoholismo, drogadicción, enfermedad infectocontagiosa, ni consumidor habitual de sustancias alucinógenas, ni drogas enervantes.  PARÁGRADO PRIMERO. Las partes declaran que no reconocerán validas las estipulaciones anteriores a este contrato de trabajo, que este es el único vigente entre ellas reempazando y que desconocen cualquier otro verbal o escrito anterior, el cual tendrá vigencia a partir de la FECHA DE INICIACION, y para lo cual el TRABAJADOR inicia su vinculación laboral con el EMPLEADOR.; pudiendo las partes convenir por escrito modificaciones al mismo, las que formarán parte integrante de este contrato. El presente contrato se ANULARÁ si el TRABAJADOR no se presenta a laborar el día que corresponde o si la EMPRESA USUARIA desiste de la Contratación. Previa la declaración de que a él se tienen incorporadas todas las disposiciones del reglamento interno que rige en la EMPRESA EMPLEADORA. El TRABAJADOR deja expresa constancia de que al suscribir el presente contrato recibió copia del mismo'
    let formattedWords4 = this.formatText(texto4);
    x = 5; // Margen izquierdo
    formattedWords4.forEach(({ text, bold }) => {
      if (bold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      const textWidth = doc.getTextWidth(text);
      if (x + textWidth > maxWidth) {
        x = 5; // Nueva línea
        y += lineHeight;
      }
      doc.text(text, x, y);
      x += textWidth; // Avanza en horizontal
    });

    // Numerales (1) y (2) con notas al pie
    y += lineHeight ; // Añadir espacio
    doc.setFont('helvetica', 'bold');
    doc.text('(1)', 5, y + lineHeight);
    doc.text('(2)', 5, y + lineHeight * 2);
    doc.setFont('helvetica', 'normal');
    doc.text('Las labores de Fumigación sólo aplican para el personal masculino mayor de edad. ', 10, y + lineHeight);
    doc.text('Estas labores se realizarán previa aprobación de requisitos del S.G.-S.S.T. de la Empresa Usuaria.', 10, y + lineHeight * 2);

    // Para constancia se firma ante testigos el día _____________________________En el Municipio de Madrid
    y += 15; // Añadir espacio
    doc.setFont('helvetica', 'bold');
    doc.text('Para constancia se firma ante testigos el día _____________________________En el Municipio de Madrid', 5, y);

    // Guardar el documento
    doc.save('Contrato_Trabajo.pdf');
  }

  // Formatea el texto, detectando palabras en mayúsculas
  formatText(texto: string): { text: string; bold: boolean }[] {
    const words = texto.split(/(\s+)/); // Divide en palabras y espacios
    return words.map(word => {
      if (word === word.toUpperCase() && word.match(/[A-Z]/)) {
        return { text: word, bold: true };
      }
      return { text: word, bold: false };
    });
  }

  // Función para formatear la fecha actual
  obtenerFechaActual() {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0'); // Añadir 0 si es necesario
    const mes = meses[hoy.getMonth()]; // Obtener nombre del mes
    const anio = hoy.getFullYear().toString().slice(-2); // Últimos 2 dígitos del año

    return `${mes} ${dia}-${anio}`;
  }




}

export class IncapacidadValidator {
  static validateConditions(incapacidad: any): { errors: string[], quienpaga: string, observaciones:string} {
    let errors: string[] = [];
    let quienpaga: string = '';
    let observaciones: string = '';
    let prioridadActual: string = 'baja'; // Inicializamos la prioridad actual como "baja"

    // Definimos una función auxiliar para comparar prioridades
    const isHigherPriority = (newPriority: string, currentPriority: string): boolean => {
      const priorityOrder = ['baja', 'media', 'alta'];
      return priorityOrder.indexOf(newPriority) > priorityOrder.indexOf(currentPriority);
    };

    // Regla 1: No cumple con el tiempo decreto 780 de 2016
    if (this.hasEnoughDays(incapacidad)) {
      
      if (this.isAccidentelaboral(incapacidad)){
        errors.push("El ARL debe hacerse cargo del pago desde el segundo día.");
        const mensaje = "El ARL debe hacerse cargo del pago desde el segundo día.";
        quienpaga = this.pagook(incapacidad, mensaje);
        observaciones = "OK";
        prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
      }else{

        const mensaje = "No cumple con el tiempo decreto 780 de 2016.";
        quienpaga = this.pagook(incapacidad, mensaje);
        errors.push("No cumple con el tiempo decreto 780 de 2016.");
        observaciones = "No cumple con el tiempo decreto 780 de 2016";
        prioridadActual = 'alta'; // Actualizar la prioridad actual a "alta"
      }
    }if(!this.hasEnoughDays(incapacidad)){
      const mensaje = "pagaeps";
      quienpaga = this.pagook(incapacidad, mensaje);
      errors.push("Paga eps");
      observaciones = "OK";
      prioridadActual = 'alta'; // Actualizar la prioridad actual
    }


    // Regla 2: Empleador si paga (1 y 2 días iniciales)
    if (this.employerShouldPay(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("El empleador debe hacerse cargo del pago de la incapacidad.");
      quienpaga = "PAGA EMPLEADOR";
      observaciones = "El empleador debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"

    }

    // Regla 3: ARL debe pagar (día 1 a cargo del empleador)
    if (this.arlShouldPay(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("El ARL debe hacerse cargo del pago desde el segundo día.");
      const mensaje = "El ARL debe hacerse cargo del pago desde el segundo día.";
      quienpaga = this.pagook(incapacidad, mensaje);
      observaciones = "El ARL debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    // Regla 4: No pagar (documentos ilegibles o faltantes)
    if (this.shouldNotPay(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("La incapacidad no debe ser pagada debido a documentos ilegibles o faltantes.");
      observaciones = "La incapacidad no debe ser pagada debido a documentos ilegibles o faltantes.";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    // Regla 5: EPS paga a partir del tercer día
    if (this.epsShouldPay(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("La EPS debe hacerse cargo del pago a partir del tercer día.");
      observaciones = "La EPS debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    // Regla para prorroga SI
    if (this.prorrogaSi(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("La EPS debe hacerse cargo del pago a partir del tercer día de incapacidad.");
      quienpaga = "PAGA EPS";
      observaciones = "La EPS debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    // Regla para prorroga NO
    if (this.prorrogaNo(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("El empleador debe hacerse cargo del pago de los 2 primeros días y luego la EPS.");
      quienpaga = "PAGA EMPLEADOR";
      observaciones = "El empleador debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }
    // Utilizar las nuevas funciones dentro de la lógica de validación


    if (this.faltancosas(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push(this.faltancosas(incapacidad));
      quienpaga = this.faltancosas(incapacidad);
      prioridadActual = 'media';
    }

    if (this.pagoproporcional(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push(this.pagoproporcional(incapacidad));
      quienpaga = this.pagoproporcional(incapacidad);
      observaciones = "Pago proporcional debido a la licencia";
      prioridadActual = 'media';
    }

    if (this.pagoempleador(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push(this.pagoempleador(incapacidad));
      quienpaga = this.pagoempleador(incapacidad);
      prioridadActual = 'media';
    }

    if (this.pagoepsoarl(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push(this.pagoepsoarl(incapacidad));
      quienpaga = this.pagoepsoarl(incapacidad);
      prioridadActual = 'media';
    }

    return { errors, quienpaga, observaciones };
  }


  private static pagook(incapacidad: any,mensaje:string): string {
    if (mensaje === 'El ARL debe hacerse cargo del pago desde el segundo día.') {
      return 'SI PAGA ARL';
    }
    if (mensaje === 'pagaeps') {
      return 'SI PAGA EPS';
    }
    if (mensaje === 'No cumple con el tiempo decreto 780 de 2016.'){
      return 'NO PAGAR';
    }

    return '';
  }

  private static faltancosas(incapacidad: any): string {
    if (!incapacidad.observaciones) return ''; // Verificar si observaciones tiene algún valor
    const observaciones = [
      'PRESCRITA', 'FALSA', 'SIN EPICRISIS', 'SIN INCAPACIDAD', 'MEDICINA PREPA', 'ILEGIBLE',
      'INCONSISTENTE-,MAS DE 180 DIAS', 'MAS DE 540 DIAS', 'FECHAS INCONSISTENTES', 'FALTA ORIGINAL',
      'FALTA FURAT', 'FALTA SOAT'
    ];
    if (observaciones.includes(incapacidad.observaciones)) {
      return 'NO PAGAR';
    }
    return '';
  }

  private static pagoproporcional(incapacidad: any): string {
    if (!incapacidad.observaciones) return ''; // Verificar si observaciones tiene algún valor
    const observaciones = ['LICENCIA DE MATERNIDAD', 'LICENCIA DE PATERNIDAD', 'TRASLAPADA'];
    if (observaciones.includes(incapacidad.tipo_incapacidad) || observaciones.includes(incapacidad.observaciones)) {
      return 'PAGO PROPORCIONAL';
    }
    return '';
  }

  private static pagoempleador(incapacidad: any): string {
    if (!incapacidad.observaciones) return ''; // Verificar si observaciones tiene algún valor
    const observaciones = ['INCAPACIDAD DE 1 DIA ARL', 'INCAPACIDAD DE 1 Y 2 DIAS EPS   SI NO ES PROROGA'];
    if (observaciones.includes(incapacidad.observaciones)) {
      return 'EMPLEADOR PAGA';
    }
    return '';
  }

  private static pagoepsoarl(incapacidad: any): string {
    if (!incapacidad.observaciones) return ''; // Verificar si observaciones tiene algún valor
    if (incapacidad.observaciones === 'INCAPACIDAD 1 Y 2 DIAS PRORROGA') {
      return 'EPS SI PAGA';
    }
    if (incapacidad.observaciones === 'INCAPACIDAD 1 DIA ARL PRORROGA') {
      return 'ARL SI PAGA';
    }
    return '';
  }
  private static hasEnoughDays(incapacidad: any): boolean {
    // Verificar que los campos no estén vacíos
    if (!incapacidad.fecha_contratacion || !incapacidad.fecha_inicio_incapacidad) {
      return false;
    }

    const fechaContratacion = new Date(incapacidad.fecha_contratacion);

    const fechaInicio = new Date();

    // Verificar si las fechas son válidas
    if (isNaN(fechaContratacion.getTime())) {
      return false;
    }

    const diferenciaEnMilisegundos = fechaInicio.getTime() - fechaContratacion.getTime();
    const diasCotizados = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    if (diasCotizados <= 45){
      return true;
    }else{
      return false;
    }

  }

  private static employerShouldPay(incapacidad: any): boolean {
    // Verificar que los campos no estén vacíos
    if (!incapacidad.dias_incapacidad || !incapacidad.tipo_incapacidad) {
      return false;
    }
    if (incapacidad.porroga === 'NO') {
      const diasIncapacidad = incapacidad.dias_incapacidad || 0;
      return diasIncapacidad <= 2 && incapacidad.nombre_eps !== 'ARL SURA';
    } else {
      return false;
    }
  }

  private static arlShouldPay(incapacidad: any): boolean {
    // Verificar que los campos no estén vacíos
    if (!incapacidad.tipo_incapacidad || !incapacidad.dias_incapacidad) {
      return false;
    }

    const tipoIncapacidad = incapacidad.nombre_eps || '';
    const diasIncapacidad = incapacidad.dias_incapacidad || 0;
    return tipoIncapacidad === 'ARL SURA';
  }

  private static shouldNotPay(incapacidad: any): boolean {
    // Verificar que el campo no esté vacío
    if (!incapacidad.estado_incapacidad) {
      return false;
    }

    const documentosLegibles = incapacidad.estado_incapacidad === 'Falsa';
    return documentosLegibles;
  }

  private static epsShouldPay(incapacidad: any): boolean {
    // Verificar que los campos no estén vacíos
    if (!incapacidad.dias_incapacidad || !incapacidad.tipo_incapacidad) {
      return false;
    }

    const diasIncapacidad = incapacidad.dias_incapacidad || 0;
    return diasIncapacidad >= 3 && incapacidad.tipo_incapacidad !== 'ARL SURA';
  }

  private static prorrogaSi(incapacidad: any): boolean {
    // Verificar que el campo no esté vacío
    if (!incapacidad.prorroga) {
      return false;
    }

    return incapacidad.prorroga === 'SI';
  }

  private static prorrogaNo(incapacidad: any): boolean {
    // Verificar que el campo no esté vacío
    if (!incapacidad.prorroga) {
      return false;
    }

    return incapacidad.prorroga === 'NO';
  }
  private static isAccidentelaboral(incapacidad: any): boolean {
    // Verificar que el campo no esté vacío
    if (incapacidad.tipo_incapacidad === 'ACCIDENTE DE TRABAJO') {
      return true;
    }

    return false;
  }

}

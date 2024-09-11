export class IncapacidadValidator {
  static validateConditions(incapacidad: any): { errors: string[], quienpaga: string, observaciones: string } {
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
    if (!this.hasEnoughDays(incapacidad) && isHigherPriority('alta', prioridadActual)) {
      errors.push("No cumple con el tiempo decreto 780 de 2016.");
      quienpaga = "No cumple con el tiempo decreto 780 de 2016.";
      observaciones = "No cumple con el tiempo decreto 780 de 2016.";
      prioridadActual = 'alta'; // Actualizar la prioridad actual a "alta"
    }

    // Regla 2: Empleador si paga (1 y 2 días iniciales)
    if (this.employerShouldPay(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("El empleador debe hacerse cargo del pago de la incapacidad.");
      quienpaga = "El empleador debe hacerse cargo del pago de la incapacidad.";
      observaciones = "El empleador debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    // Regla 3: ARL debe pagar (día 1 a cargo del empleador)
    if (this.arlShouldPay(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("El ARL debe hacerse cargo del pago desde el segundo día.");
      quienpaga = "El ARL debe hacerse cargo del pago desde el segundo día.";
      observaciones = "El ARL debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    // Regla 4: No pagar (documentos ilegibles o faltantes)
    if (this.shouldNotPay(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("La incapacidad no debe ser pagada debido a documentos ilegibles o faltantes.");
      quienpaga = "La incapacidad no debe ser pagada debido a documentos ilegibles o faltantes.";
      observaciones = "La incapacidad no debe ser pagada debido a documentos ilegibles o faltantes.";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    // Regla 5: EPS paga a partir del tercer día
    if (this.epsShouldPay(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("La EPS debe hacerse cargo del pago a partir del tercer día.");
      quienpaga = "La EPS debe hacerse cargo del pago a partir del tercer día.";
      observaciones = "La EPS debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    // Regla para prorroga SI
    if (this.prorrogaSi(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("La EPS debe hacerse cargo del pago a partir del tercer día de incapacidad.");
      quienpaga = "La EPS debe hacerse cargo del pago a partir del tercer día de incapacidad.";
      observaciones = "La EPS debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    // Regla para prorroga NO
    if (this.prorrogaNo(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push("El empleador debe hacerse cargo del pago de los 2 primeros días y luego la EPS.");
      quienpaga = "El empleador debe hacerse cargo del pago de los 2 primeros días y luego la EPS.";
      observaciones = "El empleador debe hacerse cargo del pago";
      prioridadActual = 'media'; // Actualizar la prioridad actual a "media"
    }

    return { errors, quienpaga, observaciones };
  }

  private static hasEnoughDays(incapacidad: any): boolean {
    // Verificar que los campos no estén vacíos
    if (!incapacidad.fecha_contratacion || !incapacidad.fecha_inicio_incapacidad) {
      return false;
    }

    const fechaContratacion = new Date(incapacidad.fecha_contratacion);
    const fechaInicio = new Date(incapacidad.fecha_inicio_incapacidad);

    // Verificar si las fechas son válidas
    if (isNaN(fechaContratacion.getTime()) || isNaN(fechaInicio.getTime())) {
      return false;
    }

    const diferenciaEnMilisegundos = fechaInicio.getTime() - fechaContratacion.getTime();
    const diasCotizados = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    return diasCotizados <= 28;
  }

  private static employerShouldPay(incapacidad: any): boolean {
    // Verificar que los campos no estén vacíos
    if (!incapacidad.dias_incapacidad || !incapacidad.tipo_incapacidad) {
      return false;
    }

    const diasIncapacidad = incapacidad.dias_incapacidad || 0;
    return diasIncapacidad <= 2 && incapacidad.tipo_incapacidad !== 'ARL';
  }

  private static arlShouldPay(incapacidad: any): boolean {
    // Verificar que los campos no estén vacíos
    if (!incapacidad.tipo_incapacidad || !incapacidad.dias_incapacidad) {
      return false;
    }

    const tipoIncapacidad = incapacidad.tipo_incapacidad || '';
    const diasIncapacidad = incapacidad.dias_incapacidad || 0;
    return tipoIncapacidad === 'ARL' && diasIncapacidad > 1;
  }

  private static shouldNotPay(incapacidad: any): boolean {
    // Verificar que el campo no esté vacío
    if (!incapacidad.estado_incapacidad) {
      return false;
    }

    const documentosLegibles = incapacidad.estado_incapacidad === 'Original';
    return !documentosLegibles;
  }

  private static epsShouldPay(incapacidad: any): boolean {
    // Verificar que los campos no estén vacíos
    if (!incapacidad.dias_incapacidad || !incapacidad.tipo_incapacidad) {
      return false;
    }

    const diasIncapacidad = incapacidad.dias_incapacidad || 0;
    return diasIncapacidad >= 3 && incapacidad.tipo_incapacidad !== 'ARL';
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
}

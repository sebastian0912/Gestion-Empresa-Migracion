export class IncapacidadValidator {
  static validateConditions(incapacidad: any): { errors: string[], quienpaga: string } {
    let errors: string[] = [];
    let quienpaga: string = '';
    let observaciones: string = '';
    let prioridadActual: string = 'baja'; // Inicializamos la prioridad actual como "baja"

    // Definimos una función auxiliar para comparar prioridades
    const isHigherPriority = (newPriority: string, currentPriority: string): boolean => {
      const priorityOrder = ['baja', 'media', 'alta'];
      return priorityOrder.indexOf(newPriority) > priorityOrder.indexOf(currentPriority);
    };

    // Utilizar las nuevas funciones dentro de la lógica de validación
    if (this.pagook(incapacidad) && isHigherPriority('media', prioridadActual)) {
      errors.push(this.pagook(incapacidad));
      quienpaga = this.pagook(incapacidad);
      prioridadActual = 'media';
    }

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

    return { errors, quienpaga };
  }


  private static pagook(incapacidad: any): string {
    if (!incapacidad.observaciones) return ''; // Verificar si observaciones tiene algún valor
    if (incapacidad.observaciones === 'OK') {
      if (incapacidad.nombre_eps === 'ARL SURA') {
        return 'SI PAGA ARL';
      }
      if (incapacidad.nombre_eps !== 'No cumple con el tiempo decreto 780') {
        return 'SI PAGA EPS';
      }
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
    if (observaciones.includes(incapacidad.observaciones)) {
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
    const fechaInicio = new Date(incapacidad.fecha_inicio_incapacidad);

    // Verificar si las fechas son válidas
    if (isNaN(fechaContratacion.getTime()) || isNaN(fechaInicio.getTime())) {
      return false;
    }

    const diferenciaEnMilisegundos = fechaInicio.getTime() - fechaContratacion.getTime();
    const diasCotizados = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    return diasCotizados <= 45;
  }

  private static employerShouldPay(incapacidad: any): boolean {
    // Verificar que los campos no estén vacíos
    if (!incapacidad.dias_incapacidad || !incapacidad.tipo_incapacidad) {
      return false;
    }
    if (incapacidad.porroga === 'NO') {
      const diasIncapacidad = incapacidad.dias_incapacidad || 0;
      return diasIncapacidad <= 2 && incapacidad.nombre_eps !== 'ARL';
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
    return tipoIncapacidad === 'ARL' && diasIncapacidad > 1;
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

export class IncapacidadValidator {
  static validateConditions(incapacidad: any): string[] {
    let errors: string[] = [];

    // Regla 1: No cumple con el tiempo decreto 780 de 2016
    if (!this.hasEnoughDays(incapacidad)) {
      errors.push("No cumple con el tiempo decreto 780 de 2016.");
    }


    // Regla 2: Empleador si paga (1 y 2 días iniciales)
    if (this.employerShouldPay(incapacidad)) {
      errors.push("El empleador debe hacerse cargo del pago de la incapacidad.");
    }

    // Regla 3: ARL debe pagar (día 1 a cargo del empleador)
    if (this.arlShouldPay(incapacidad)) {
      errors.push("El ARL debe hacerse cargo del pago desde el segundo día.");
    }

    // Regla 4: No pagar (documentos ilegibles o faltantes)
    if (this.shouldNotPay(incapacidad)) {
      errors.push("La incapacidad no debe ser pagada debido a documentos ilegibles o faltantes.");
    }

    // Regla 5: EPS paga a partir del tercer día
    if (this.epsShouldPay(incapacidad)) {
      errors.push("La EPS debe hacerse cargo del pago a partir del tercer día de incapacidad.");
    }

    if (this.prorroga(incapacidad)) {
      errors.push("La EPS debe hacerse cargo del pago a partir del tercer día de incapacidad.");
    }

    return errors;
  }

  private static hasEnoughDays(incapacidad: any): boolean {
    const fechaContratacion = new Date(incapacidad.fecha_contratacion);
    const fechaInicio = new Date(incapacidad.fecha_inicio_incapacidad);

    const diferenciaEnMilisegundos = fechaInicio.getTime() - fechaContratacion.getTime();
    const diasCotizados = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    return diasCotizados <= 28;
  }

  private static employerShouldPay(incapacidad: any): boolean {
    const diasIncapacidad = incapacidad.dias_incapacidad || 0;
    return diasIncapacidad <= 2 && incapacidad.tipoIncapacidad !== 'ARL';
  }

  private static arlShouldPay(incapacidad: any): boolean {
    const tipoIncapacidad = incapacidad.tipoIncapacidad || '';
    const diasIncapacidad = incapacidad.dias_incapacidad || 0;
    return tipoIncapacidad === 'ARL' && diasIncapacidad > 1;
  }

  private static shouldNotPay(incapacidad: any): boolean {
    const documentosLegibles = incapacidad.documentos_legibles || true;
    return !documentosLegibles;
  }

  private static epsShouldPay(incapacidad: any): boolean {
    const diasIncapacidad = incapacidad.dias_incapacidad || 0;
    return diasIncapacidad >= 3 && incapacidad.tipoIncapacidad !== 'ARL';
  }

  private static prorroga(incapacidad: any): boolean {
    if (incapacidad.prorroga == 'SI')
    {
      return true
    }
    return false
  }
}

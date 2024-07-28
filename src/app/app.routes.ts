import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { AtenderTurnoComponent } from './shared/pages/atender-turno/atender-turno.component';
import { AusentismosComponent } from './shared/pages/ausentismos/ausentismos.component';
import { CambiarContrasenaComponent } from './shared/pages/cambiar-contrasena/cambiar-contrasena.component';
import { ContratacionComponent } from './shared/pages/contratacion/contratacion.component';
import { DesprendiblesPagoComponent } from './shared/pages/desprendibles-pago/desprendibles-pago.component';
import { EstadisticasAuditoriaComponent } from './shared/pages/estadisticas-auditoria/estadisticas-auditoria.component';
import { EstadisticasTurneroComponent } from './shared/pages/estadisticas-turnero/estadisticas-turnero.component';
import { FormaPagoComponent } from './shared/pages/forma-pago/forma-pago.component';
import { HomeComponent } from './shared/pages/home/home.component';
import { PublicidadComponent } from './shared/pages/publicidad/publicidad.component';
import { ReporteContratacionComponent } from './shared/pages/reporte-contratacion/reporte-contratacion.component';
import { SeguimientoAuditoriaComponent } from './shared/pages/seguimiento-auditoria/seguimiento-auditoria.component';
import { SeleccionComponent } from './shared/pages/seleccion/seleccion.component';
import { SolicitarTurnoComponent } from './shared/pages/solicitar-turno/solicitar-turno.component';
import { VacantesComponent } from './shared/pages/vacantes/vacantes.component';
import { VisualizarTurnosComponent } from './shared/pages/visualizar-turnos/visualizar-turnos.component';



export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'atender-turno', component: AtenderTurnoComponent },
    { path: 'ausentismos', component: AusentismosComponent },
    { path: 'cambiar-contrasena', component: CambiarContrasenaComponent },
    { path: 'contratacion', component: ContratacionComponent },
    { path: 'desprendibles-pago', component: DesprendiblesPagoComponent },
    { path: 'estadisticas-auditoria', component: EstadisticasAuditoriaComponent },
    { path: 'estadisticas-turnero', component: EstadisticasTurneroComponent },
    { path: 'forma-pago', component: FormaPagoComponent },
    { path: 'home', component: HomeComponent },
    { path: 'publicidad', component: PublicidadComponent },
    { path: 'reporte-contratacion', component: ReporteContratacionComponent },
    { path: 'seguimiento-auditoria', component: SeguimientoAuditoriaComponent },
    { path: 'seleccion', component: SeleccionComponent },
    { path: 'solicitar-turno', component: SolicitarTurnoComponent },
    { path: 'vacantes', component: VacantesComponent },
    { path: 'visualizar-turnos', component: VisualizarTurnosComponent },
];

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformacionVolantesComponent } from './informacion-volantes/informacion-volantes.component';
import { InformacionPagoComponent } from './informacion-pago/informacion-pago.component';
import { EstadoPagoComponent } from './estado-pago/estado-pago.component';


const routes: Routes = [

  {
    path: 'infoVolante', component: InformacionVolantesComponent
  },
  {
    path: 'infoVolante/:organismo', component: InformacionVolantesComponent
  },
  {
    path: 'infoPago', component: InformacionPagoComponent
  },
  {
    path: 'estadoPago', component: EstadoPagoComponent
  },
  {
    path: '', component: InformacionVolantesComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

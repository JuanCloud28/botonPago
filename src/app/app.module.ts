import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InformacionPagoComponent } from './informacion-pago/informacion-pago.component';
import { InformacionVolantesComponent } from './informacion-volantes/informacion-volantes.component';
import { HttpClientModule} from '@angular/common/http'
import { VolanteDepagoService } from './services/volanteDePago/volante-depago.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstadoPagoComponent } from './estado-pago/estado-pago.component';

@NgModule({
  declarations: [
    AppComponent,
    InformacionPagoComponent,
    InformacionVolantesComponent,
    EstadoPagoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    VolanteDepagoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

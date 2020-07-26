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
import { EstadoPagoService } from './services/estadoPago/estado-pago.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SeguridadService } from './services/seguridad/seguridad.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    AppComponent,
    InformacionPagoComponent,
    InformacionVolantesComponent,
    EstadoPagoComponent,
    AccessDeniedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatTableModule,
    MatExpansionModule,
    MatCardModule
  ],
  providers: [
    VolanteDepagoService,
    EstadoPagoService,
    SeguridadService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6Lek_n4UAAAAADIi_2rNnjTLOR2OMPWAhRI_xsWX' } as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

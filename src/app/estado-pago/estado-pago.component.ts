import { Component, OnInit } from '@angular/core';
import { EstadoPago } from '../models/estadoPago/EstadoPago';
import { EstadoPagoService } from '../services/estadoPago/estado-pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosPago } from '../models/estadoPago/datosPago';
import { EstadoPagoRequest } from '../models/estadoPago/estadoPagoRequest';
import { EstadoPagoResponse } from '../models/estadoPago/estadoPagoResponse';
import { SeguridadService } from '../services/seguridad/seguridad.service';
import { VolanteDepagoService } from '../services/volanteDePago/volante-depago.service';
import { TipoPagoPSE } from '../models/TipoDePago/TipoPagoPSE';
import { tipoPagoEnum } from '../models/enums/tipoPagoEnum';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-estado-pago',
  templateUrl: './estado-pago.component.html',
  styleUrls: ['./estado-pago.component.scss']
})
export class EstadoPagoComponent implements OnInit {

  constructor(private rutaActiva: ActivatedRoute,
    private estadoPagoService: EstadoPagoService,
    private seguridad: SeguridadService,
    private ruta: Router,
    private VolantesInyectados: VolanteDepagoService) { }

  public estadoPago: EstadoPago = new EstadoPago();
  public datosPago: DatosPago = new DatosPago();
  estadoPagoReq: EstadoPagoRequest = new EstadoPagoRequest();
  estadoPagoRes: EstadoPagoResponse = new EstadoPagoResponse();
  
  tiposDePago : Array<TipoPagoPSE> = new Array<TipoPagoPSE>();
  ngOnInit(): void {

    this.datosPago = JSON.parse(this.rutaActiva.snapshot.params.datosPago) as DatosPago;
    console.log(this.datosPago)
    this.consultarEstado();

  }

  consultarEstado() {
    this.estadoPagoReq.consecutivoLiquidacion = this.datosPago.referenciaPago;
    this.estadoPagoReq.idTipoPagoPse = '2';
    this.estadoPagoReq.codigoOrganismo = '25175000';
    this.estadoPagoReq.liquidacionRetefuente = "0";
    this.estadoPagoReq.inscripcionPersona = '0';
    this.seguridad.generarToken().subscribe((seg) => {
      try {
        console.log(seg.token);
        
        this.estadoPagoService.consultaEstadoPago(this.estadoPagoReq, seg.token).subscribe((estadoRes) => {
          this.estadoPagoRes = estadoRes;
          console.log(estadoRes);
        })
      } catch (error) {
        console.error("Error generando token de autenticación. " + error);
        this.ruta.navigate(['accessDenied'])
      }
    })

  }

  consultarTipoDePago(tokenString: string){
    this.VolantesInyectados.consultarTiposDePago(tokenString).subscribe((tiposPagoService) =>{
      this.tiposDePago = tiposPagoService;
      if(this.tiposDePago.length > 0){
        for(let tipoPago of this.tiposDePago){
          if(tipoPago.descripcion == tipoPagoEnum.PAGO_COMPARENDO){
            this.estadoPagoReq.idTipoPagoPse = tipoPago.idTipoPagoPse;
          }
        }
      }else{     
        return throwError("El servicio de consultar tipos de pago ha retornado vacío.");
      }
    });
  }

}

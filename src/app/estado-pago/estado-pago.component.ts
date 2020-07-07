import { Component, OnInit } from '@angular/core';
import { EstadoPago } from '../models/estadoPago/EstadoPago';

@Component({
  selector: 'app-estado-pago',
  templateUrl: './estado-pago.component.html',
  styleUrls: ['./estado-pago.component.scss']
})
export class EstadoPagoComponent implements OnInit {

  constructor() { }
  public estadoPago: EstadoPago = new EstadoPago();
  ngOnInit(): void {
    this.estadoPago.estado = "registro aplicado correctamente";
    this.estadoPago.nombreDeudor = "pedro picapiedra";
    this.estadoPago.numeroComparendo = "435874957223";
    this.estadoPago.numeroIdentificacion = "10213921";
    this.estadoPago.razonSocial = "Cajica";
    this.estadoPago.referenciaPago = "727394121";
    this.estadoPago.tipoIdentificacion = "Cédula de ciudadanía";
    this.estadoPago.valor = "173641";
  }

}

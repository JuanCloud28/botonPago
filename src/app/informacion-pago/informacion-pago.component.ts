import { Component, OnInit } from '@angular/core';
import { DatosPersona } from '../models/DatosPersona';
import { VolantePago } from '../models/VolantePago';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenciaResponse } from '../models/referenciaPSE/referenciaResponse';
import { TipoDocumento } from '../models/catalogo/TipoDocumento';
import { VolanteDepagoService } from '../services/volanteDePago/volante-depago.service';
import { UrlPseRequest } from '../models/urlPSe/UrlPseRequest';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { throwError } from 'rxjs';
import { SeguridadService } from '../services/seguridad/seguridad.service';
import { NgbdModalContent } from '../modal/modal-notification';
import { tipoDocumentoChiaEnum } from '../models/enums/tipoDocumentoChiaEnum';

@Component({
  selector: 'app-informacion-pago',
  templateUrl: './informacion-pago.component.html',
  styleUrls: ['./informacion-pago.component.scss']
})
export class InformacionPagoComponent implements OnInit {
  referencia: ReferenciaResponse = new ReferenciaResponse();
  volante: VolantePago = new VolantePago();
  tipoDocs: Array<TipoDocumento> = new Array<TipoDocumento>();
  tipoDocSelected: string;
  urlRequest: UrlPseRequest = new UrlPseRequest();
  public staticAlertClosed = true;
  error: string = "Error";
  token: string;
  apellidoRequired : boolean = true;

  formularioInfoPago: FormGroup;

  constructor(private rutaActiva: ActivatedRoute,
    private VolantesInyectados: VolanteDepagoService,
    private fb: FormBuilder,
    private ruta: Router,
    private seguridad: SeguridadService) {
  }

  ngOnInit(): void {
    this.generarToken();
    this.volante = JSON.parse(this.rutaActiva.snapshot.params.infoPago);
    console.log(JSON.parse(this.rutaActiva.snapshot.params.infoPago));
    this.crearFormulario();
    this.error = "Se ha producido un error en el servicio de pago, por favor intentelo de nuevo o contacte al administrador."
    this.mostrarAlert();
  }
  generarToken() {
    this.seguridad.generarToken().subscribe((seg) => {
      try {
        this.token = seg.token;
        console.log(seg.token);
        this.llenarCatalogo();
      } catch (error) {
        console.error("Error generando token de autenticación. " + error);
        this.ruta.navigate(['accessDenied'])
      }
    })
  }

  crearFormulario() {
    this.formularioInfoPago = this.fb.group({
      tipoIdentificacion: [Validators.required],
      nombreCliente: ['', Validators.compose([
        Validators.required, Validators.minLength(3), Validators.maxLength(30)
      ])],
      telefonoClente: ['', Validators.compose([
        Validators.required, Validators.minLength(7), Validators.maxLength(10)
      ])],
      numeroIdentificacion: ['', Validators.compose([
        Validators.required
      ])],
      apellidoCliente: ['', Validators.compose([         
      ])],
      emailCliente: ['', Validators.compose([
        Validators.required, Validators.email, Validators.minLength(11), Validators.maxLength(50)
      ])]

    })
  }

  llenarCatalogo() {
    this.VolantesInyectados.consultarCatalogoTipoDoc(this.token).subscribe((catalogoService) => {
      this.tipoDocs = catalogoService;
    });
  }

  redireccionarPSE() {
    this.urlRequest = this.formularioInfoPago.value as UrlPseRequest
    this.urlRequest.codigoOrganismo = this.volante.codigoOrganismo;
    this.urlRequest.valorIva = "0";
    this.urlRequest.totalConIva = this.volante.valorTotal;
    this.urlRequest.inscripcionPersona = "0";
    this.urlRequest.consecutivoLiquidacion = this.volante.referencia;
    this.urlRequest.descripcionPago = this.volante.descripcion;
    this.urlRequest.idTipoPagoPse = this.volante.tipoPago;
    this.urlRequest.liquidacionRetefuente = "0";

    this.VolantesInyectados.consultarUrlPse(this.urlRequest, this.token).subscribe((urlResponse) => {
      console.log(this.urlRequest);
      console.log(urlResponse);
      try {
        if (urlResponse.body.codigo != "-1") {
          window.open(urlResponse.body.url, "_blank");
        } else {
          console.error(`Codigo: ${urlResponse.codigoRespuesta} Descripción: ${urlResponse.descripcion}`)
          throwError(`Codigo: ${urlResponse.codigoRespuesta} Descripción: ${urlResponse.descripcion}`);
          this.error = "Se ha producido un error en el servicio de pago, por favor intentelo de nuevo o contacte al administrador."
          this.mostrarAlert();
        }
      } catch (error) {
        console.log(error)
        this.error = "Se ha producido un error en el servicio de pago, por favor intentelo de nuevo o contacte al administrador."
        this.mostrarAlert();
      }

    });
  }

  mostrarAlert() {
    this.staticAlertClosed = false;
    setTimeout(() => this.staticAlertClosed = true, 10000);
  }

  agregarValidacipon(){
    if(this.formularioInfoPago.get('tipoIdentificacion').value != tipoDocumentoChiaEnum.NIT){
      this.formularioInfoPago.controls['apellidoCliente'].setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(30)]); 
      this.apellidoRequired = true;
    }else{
      this.formularioInfoPago.controls['apellidoCliente'].setValidators([]);
      this.apellidoRequired = false; 
    }

  }

}

import { Component, OnInit } from '@angular/core';
import { DatosPersona } from '../models/DatosPersona';
import { VolantePago } from '../models/VolantePago';
import { ActivatedRoute } from '@angular/router';
import { ReferenciaResponse } from '../models/referenciaPSE/referenciaResponse';
import { TipoDocumento } from '../models/catalogo/TipoDocumento';
import { VolanteDepagoService } from '../services/volanteDePago/volante-depago.service';
import { UrlPseRequest } from '../models/urlPSe/UrlPseRequest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-informacion-pago',
  templateUrl: './informacion-pago.component.html',
  styleUrls: ['./informacion-pago.component.scss']
})
export class InformacionPagoComponent implements OnInit {
  referencia :ReferenciaResponse = new ReferenciaResponse();
  personaPago: DatosPersona =new DatosPersona();
  volante: VolantePago = new VolantePago();
  tipoDocs : Array<TipoDocumento> = new Array<TipoDocumento>();
  tipoDocSelected : string;
  tipoDocumento: String[] = ["Cédula de Ciudadanía","Cédula de extranjería","Registro único tributario"]
  urlRequest : UrlPseRequest = new UrlPseRequest();

  formularioInfoPago : FormGroup;

  constructor(private rutaActiva: ActivatedRoute, private VolantesInyectados: VolanteDepagoService, private fb: FormBuilder) { 
  }

  ngOnInit(): void {
    this.volante = JSON.parse(this.rutaActiva.snapshot.params.infoPago);  
    this.llenarCatalogo(); 
    this.crearFormulario(); 
  }

  crearFormulario(){
    this.formularioInfoPago = this.fb.group({
      tipoIdentificacion : [Validators.required],
      nombreCliente : ['', Validators.required],
      telefonoClente : ['', Validators.required],
      numeroIdentificacion : ['', Validators.required],
      apellidoCliente : ['', Validators.required],
      emailCliente : ['', Validators.compose([
        Validators.required, Validators.email
      ])]

    })
  }

  llenarCatalogo(){
    this.VolantesInyectados.consultarCatalogoTipoDoc().subscribe((catalogoService) =>{
      this.tipoDocs = catalogoService;
      console.log(catalogoService)
    });
  }

  redireccionarPSE(){
    this.urlRequest =  this.formularioInfoPago.value as UrlPseRequest
    this.urlRequest.codigoOrganismo = this.volante.codigoOrganismo;
    this.urlRequest.valorIva = "0";
    this.urlRequest.totalConIva = this.volante.valorTotal;
    this.urlRequest.inscripcionPersona = "0";
    this.urlRequest.consecutivoLiquidacion = this.volante.referencia;
    this.urlRequest.descripcionPago = this.volante.descripcion;
    this.urlRequest.idTipoPagoPse = this.volante.tipoPago;
    this.urlRequest.liquidacionRetefuente = "0";
    
    this.VolantesInyectados.consultarUrlPse(this.urlRequest).subscribe((urlResponse) =>{
      console.log(this.urlRequest);
      console.log(urlResponse);
      if(urlResponse.body.codigo !="-1"){
        window.open(urlResponse.body.url, "_blank");
      }else{
        console.error(`Codigo: ${urlResponse.codigoRespuesta} Descripción: ${urlResponse.descripcion}`)
        throwError(`Codigo: ${urlResponse.codigoRespuesta} Descripción: ${urlResponse.descripcion}`);
        window.alert("Se ha producido un error en el servicio de pago, por favor intentelo de nuevo o contacte al administrador.");
      }
    });
  }

}

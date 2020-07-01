import { Component, OnInit } from '@angular/core';
import { DatosPersona } from '../models/DatosPersona';
import { VolantePago } from '../models/VolantePago';
import { ActivatedRoute } from '@angular/router';
import { ReferenciaResponse } from '../models/referenciaPSE/referenciaResponse';
import { TipoDocumento } from '../models/catalogo/TipoDocumento';
import { VolanteDepagoService } from '../services/volanteDePago/volante-depago.service';
import { UrlPseRequest } from '../models/urlPSe/UrlPseRequest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-informacion-pago',
  templateUrl: './informacion-pago.component.html',
  styleUrls: ['./informacion-pago.component.scss']
})
export class InformacionPagoComponent implements OnInit {
  referencia :ReferenciaResponse = new ReferenciaResponse();
  img :string = "https://images.squarespace-cdn.com/content/v1/553918f7e4b02b8e3a3aa460/1469714663527-M00Q4SME2WMV33CH6NKG/ke17ZwdGBToddI8pDm48kKa3wIE0oEbLgtyTrl2GNlpZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVGGPFFSaPlWlH3aUqVLCpfnGwJHc3-XTFtwYvazHwH4rBur-lC0WofN0YB1wFg-ZW0/logopsenuevo.png";
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
      tipoDocumento : [Validators.required],
      nombre : ['', Validators.required],
      telefono : ['', Validators.required],
      numeroDocumento : ['', Validators.required],
      apellido : ['', Validators.required],
      correoElectronico : ['', Validators.compose([
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
    console.log(this.urlRequest)
    this.VolantesInyectados.consultarUrlPse(this.urlRequest).subscribe((urlResponse) =>{
      if(urlResponse.body.codigo !="-1"){
        //window.location.href = urlResponse.body.url;
      }else{
        window.alert("Se ha producido un error en el servicio de pago, por favor intentelo de nuevo o contacte al administrador.");
      }
    });
  }

}

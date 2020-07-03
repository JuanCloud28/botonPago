import { Component, OnInit } from '@angular/core';
import { PersonaMulta } from '../models/PersonaMulta';
import { VolanteDepagoService } from '../services/volanteDePago/volante-depago.service';
import { Cartera } from '../models/cartera/Cartera';
import { TokenResponse } from '../models/token/TokenResponse';
import { Router, ActivatedRoute } from '@angular/router';
import { ReferenciaRequest } from '../models/referenciaPSE/referenciaRequest';
import { ReferenciaResponse } from '../models/referenciaPSE/referenciaResponse';
import { DetalleCartera } from '../models/cartera/DetalleCartera';
import { VolantePago } from '../models/VolantePago';
import { TipoDocumento } from '../models/catalogo/TipoDocumento';
import { throwError } from 'rxjs';
import { tipoPagoEnum } from '../models/enums/tipoPagoEnum';
import { TipoPagoPSE } from '../models/TipoDePago/TipoPagoPSE';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { datosVolante } from '../models/formControl/datosVolante';
import { CarteraRequest } from '../models/cartera/CarteraRequest';
import { organismoTransitoConst } from '../models/consts/organismoTransitoConst';

@Component({
  selector: 'app-informacion-volantes',
  templateUrl: './informacion-volantes.component.html',
  styleUrls: ['./informacion-volantes.component.scss']
})



export class InformacionVolantesComponent implements OnInit {

  tipoDocs : Array<TipoDocumento> = new Array<TipoDocumento>();
  tiposDePago : Array<TipoPagoPSE> = new Array<TipoPagoPSE>();
  docSelected :string;
  referenciaReq : ReferenciaRequest = new ReferenciaRequest();
  referenciaResp : ReferenciaResponse = new ReferenciaResponse(); 
  volante: VolantePago = new VolantePago();
  token : TokenResponse = new TokenResponse();
  personaMulta: PersonaMulta =  new PersonaMulta();
  cartera : Cartera = new Cartera();
  formularioInfoVolantes : FormGroup;
  datosVolante : datosVolante;
  carteraConsultada : boolean = false;
  carteraRequest : CarteraRequest = new CarteraRequest();

  constructor(private VolantesInyectados: VolanteDepagoService, private ruta : Router, private fb: FormBuilder, private rutaParams : ActivatedRoute) { 
    
  }
  
  ngOnInit(): void {
    this.ajustarEstilos(this.rutaParams.snapshot.params.organismo as string);
    this.llenarCatalogo();
    this.consultarTipoDePago();
    this.crearFormulario();
  }

  crearFormulario(){
    this.formularioInfoVolantes = this.fb.group({
      txtDocumento : ['',Validators.required],
      selectOneMenuDocumento : ['', Validators.required]
    })
  }

  ajustarEstilos(organismo : string){
    if(organismo.toUpperCase() == organismoTransitoConst.CHIA.nombre){
      this.carteraRequest.codigoOrganismo = organismoTransitoConst.CHIA.codigo; 
      console.log(this.carteraRequest);
      document.documentElement.style.setProperty('--organismo-transito','#4CAF50');
      document.documentElement.style.setProperty('--label-color','#016ca0');
      document.documentElement.style.setProperty('--border-button-color','#4CAF50');
      document.documentElement.style.setProperty('--boders-color','#016ca0');
    }else{
      document.documentElement.style.setProperty('--organismo-transito','lightblue');
      document.documentElement.style.setProperty('--label-color','lightblue');
      document.documentElement.style.setProperty('--border-button-color','lightblue');
      document.documentElement.style.setProperty('--boders-color','lightblue');
    }
  }

  consultarCartera(){
    this.datosVolante = this.formularioInfoVolantes.value as datosVolante;
    this.carteraRequest.numeroIdentificacion = this.datosVolante.txtDocumento;
    this.carteraRequest.codigoTipoIdentificacion = this.datosVolante.selectOneMenuDocumento;
    console.log(this.carteraRequest)
    this.VolantesInyectados.consultarCartera(this.carteraRequest).subscribe((carteraService)=>{
        this.cartera = carteraService; 
        //console.log(this.cartera);
        if(this.cartera.codigo == '000'){
          this.carteraConsultada = true;
        }else{
          console.error(`Código de error: ${this.cartera.codigo}
          Detalle:${this.cartera.descripcion}`);          
          return throwError(`Código de error: ${this.cartera.codigo}
                              Detalle:${this.cartera.descripcion}`);
        }
        
    });

  }

  traerReferenciaPSE(detalleCartera : DetalleCartera){
    this.referenciaReq.codigoOrganismo = detalleCartera.codigo_organismo_transito;
    this.referenciaReq.nombreOrganismo = detalleCartera.nombre_organismo_transito;
    this.referenciaReq.tipoDocumento = this.cartera.resumen_cartera.codigo_tipo_documento;
    this.referenciaReq.numeroDocumento = this.cartera.resumen_cartera.numero_documento;
    this.referenciaReq.nombreInfractor = this.concatenarNombre();
    this.referenciaReq.placaVehiculo = detalleCartera.placa_vehiculo;
    this.referenciaReq.numeroComparendo = detalleCartera.numero_comparendo;
    this.referenciaReq.tipoCartera = detalleCartera.tipo_cartera;
    this.referenciaReq.valorAPagar = detalleCartera.saldo_pagar;
    this.referenciaReq.valorTotal = detalleCartera.total_pagar;
    this.referenciaReq.valorIntereses = detalleCartera.valor_intereses;
    this.referenciaReq.valorDescuentoCapital = detalleCartera.valorDelDescuento;

    this.volante.nombreDeudor = this.concatenarNombre();
    this.volante.numeroComparendo = detalleCartera.numero_comparendo;
    this.volante.numeroIdentificacion = this.cartera.resumen_cartera.numero_documento;
    this.volante.razonSocial = detalleCartera.nombre_organismo_transito;
    this.volante.tipoIdentificacion = this.cartera.resumen_cartera.nombre_tipo_documento;
    this.volante.total = detalleCartera.total_pagar;

    this.VolantesInyectados.traerReferenciaPSE(this.referenciaReq).subscribe((serviceResponse)=>{
      this.referenciaResp = serviceResponse;
      this.volante.referencia = serviceResponse.consecutivoPagoPse;
      this.ruta.navigate(['infoPago', {infoPago : JSON.stringify(this.volante)}])
    });
  }

  concatenarNombre() : string{
    if(this.cartera.resumen_cartera.nombres_infractor.length > 0){
      return this.cartera.resumen_cartera.nombres_infractor[0].primer_nombre +" "+ this.cartera.resumen_cartera.nombres_infractor[0].segundo_nombre +" "+ this.cartera.resumen_cartera.nombres_infractor[0].primer_apellido +" "+ this.cartera.resumen_cartera.nombres_infractor[0].segundo_apellido
    }else{
      return "";
    }
    
  }

  llenarCatalogo(){
    this.VolantesInyectados.consultarCatalogoTipoDoc().subscribe((catalogoService) =>{
      this.tipoDocs = catalogoService;
    });
  }

  consultarTipoDePago(){
    this.VolantesInyectados.consultarTiposDePago().subscribe((tiposPagoService) =>{
      this.tiposDePago = tiposPagoService;
      console.log(tiposPagoService)
      if(this.tiposDePago.length > 0){
        for(let tipoPago of this.tiposDePago){
          if(tipoPago.descripcion == tipoPagoEnum.PAGO_COMPARENDO){
            this.referenciaReq.IdTipoPago = tipoPago.idTipoPagoPse;
          }
        }
      }else{
        window.alert("Se ha presentado un error, por favor intente más tarde o consulte con el administrador.");
        return throwError("El servicio de consultar tipos de pago ha retornado vacío.");
      }
    });
  }


}

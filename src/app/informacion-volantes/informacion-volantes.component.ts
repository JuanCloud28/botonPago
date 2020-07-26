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
import { NgxSpinnerService } from 'ngx-spinner';
import * as jwt_decode from "jwt-decode";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../modal/modal-notification';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';


export interface PeriodicElement {
  position: number;
  tipoCartera: string;
  placa: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  fechaCartera: string;
  valorCartera: string;
  totalDescuentoCapital: string;
  valorIntereses: string;
  valorCostas: string;
  cobroSistemantizacion: string;
  totalCartera: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, tipoCartera: '4', placa: 'ASD242', tipoDocumento: 'cedula de ciudadania', numeroDocumento: '12312312', nombre: 'pedro picapiedra', fechaCartera: '22/07/2020', valorCartera: '23424', totalDescuentoCapital: '2342342', valorIntereses: '234234', valorCostas: '234234', cobroSistemantizacion: '23424', totalCartera: '23424' }
];

@Component({
  selector: 'app-informacion-volantes',
  templateUrl: './informacion-volantes.component.html',
  styleUrls: ['./informacion-volantes.component.scss']
})



export class InformacionVolantesComponent implements OnInit {

  tipoDocs: Array<TipoDocumento> = new Array<TipoDocumento>();
  tiposDePago: Array<TipoPagoPSE> = new Array<TipoPagoPSE>();
  docSelected: string;
  referenciaReq: ReferenciaRequest = new ReferenciaRequest();
  referenciaResp: ReferenciaResponse = new ReferenciaResponse();
  volante: VolantePago = new VolantePago();
  token: TokenResponse = new TokenResponse();
  personaMulta: PersonaMulta = new PersonaMulta();
  cartera: Cartera = new Cartera();
  formularioInfoVolantes: FormGroup;
  datosVolante: datosVolante;
  carteraConsultada: boolean = false;
  carteraRequest: CarteraRequest = new CarteraRequest();
  private tokenOrganismo: any;
  public staticAlertClosed = true;
  error: string = "Error";
  private tokenString = "";
  panelOpenState = false;

  constructor(private modalService: NgbModal, private VolantesInyectados: VolanteDepagoService, private ruta: Router, private fb: FormBuilder, private rutaParams: ActivatedRoute, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.tokenOrganismo = this.getDecodedAccessToken(this.rutaParams.snapshot.params.organismo)
    this.tokenString = this.rutaParams.snapshot.params.organismo;
    this.validarToken(this.tokenOrganismo)
    this.ajustarEstilos(this.tokenOrganismo.sub as string);
    this.llenarCatalogo();
    this.consultarTipoDePago();
    this.crearFormulario();
  }

  crearFormulario() {
    this.formularioInfoVolantes = this.fb.group({
      txtDocumento: ['', Validators.required],
      selectOneMenuDocumento: ['', Validators.required],
      recaptcha: ['', [Validators.required]]
    })
  }

  ajustarEstilos(organismo: string) {
    if (organismo == organismoTransitoConst.CHIA.codigo) {
      this.carteraRequest.codigoOrganismo = organismoTransitoConst.CHIA.codigo;
      document.documentElement.style.setProperty('--organismo-transito', '#4CAF50');
      document.documentElement.style.setProperty('--label-color', '#016ca0');
      document.documentElement.style.setProperty('--border-button-color', '#4CAF50');
      document.documentElement.style.setProperty('--boders-color', '#016ca0');
    } else if (organismo == organismoTransitoConst.CARTAGENA.codigo) {
      this.carteraRequest.codigoOrganismo = organismoTransitoConst.CARTAGENA.codigo;

    } else {
      document.documentElement.style.setProperty('--organismo-transito', 'lightblue');
      document.documentElement.style.setProperty('--label-color', 'lightblue');
      document.documentElement.style.setProperty('--border-button-color', 'lightblue');
      document.documentElement.style.setProperty('--boders-color', 'lightblue');
    }
  }

  consultarCartera() {
    this.spinner.show();
    this.datosVolante = this.formularioInfoVolantes.value as datosVolante;
    this.carteraRequest.numeroIdentificacion = this.datosVolante.txtDocumento;
    this.carteraRequest.codigoTipoIdentificacion = this.datosVolante.selectOneMenuDocumento;
    this.VolantesInyectados.consultarCartera(this.carteraRequest, this.tokenString).subscribe((carteraService) => {
      this.cartera = carteraService;
      if (this.cartera.codigo == '000') {
        this.carteraConsultada = true;
        this.spinner.hide();
      } else if (this.cartera.codigo === '008') {
        this.error = this.cartera.descripcion
        this.spinner.hide();
        this.mostrarAlert();
      } else {
        this.spinner.hide();
        this.error = "Se ha presentado un error consultando las obligaciones, por favor intentelo de nuevo."
        this.mostrarAlert();
        console.error(`Código de error: ${this.cartera.codigo}
          Detalle:${this.cartera.descripcion}`);
        return throwError(`Código de error: ${this.cartera.codigo}
                              Detalle:${this.cartera.descripcion}`);
      }

    });

  }

  traerReferenciaPSE(detalleCartera: DetalleCartera) {
    this.referenciaReq.codigoOrganismo = detalleCartera.codigo_organismo_transito;
    this.referenciaReq.nombreOrganismo = detalleCartera.nombre_organismo_transito;
    this.referenciaReq.tipoDocumento = this.datosVolante.selectOneMenuDocumento;
    this.referenciaReq.numeroDocumento = this.cartera.resumen_cartera.numero_documento;
    this.referenciaReq.nombreInfractor = this.concatenarNombre();
    this.referenciaReq.placaVehiculo = detalleCartera.placa_vehiculo;
    this.referenciaReq.numeroComparendo = detalleCartera.numero_comparendo;
    this.referenciaReq.tipoCartera = detalleCartera.tipo_cartera_numero;
    if (detalleCartera.total_con_descuento_decreto678 == '0' || detalleCartera.total_con_descuento_decreto678 == undefined) {
      this.referenciaReq.valorAPagar = detalleCartera.saldo_pagar;
    } else {
      this.referenciaReq.valorAPagar = detalleCartera.total_con_descuento_decreto678;
    }
    this.referenciaReq.valorTotal = detalleCartera.total_pagar;
    this.referenciaReq.valorIntereses = detalleCartera.valor_intereses;
    this.referenciaReq.valorDescuentoCapital = detalleCartera.valorDelDescuento == undefined ? "0" : detalleCartera.valorDelDescuento;

    this.volante.nombreDeudor = this.concatenarNombre();
    this.volante.numeroComparendo = detalleCartera.numero_comparendo;
    this.volante.numeroIdentificacion = this.cartera.resumen_cartera.numero_documento;
    this.volante.razonSocial = detalleCartera.nombre_organismo_transito;
    this.volante.tipoIdentificacion = this.cartera.resumen_cartera.nombre_tipo_documento;
    this.volante.valorTotal = detalleCartera.total_pagar;
    this.volante.codigoOrganismo = detalleCartera.codigo_organismo_transito;
    this.volante.nombreOrganismo = detalleCartera.nombre_organismo_transito;
    this.volante.placaVehiculo = detalleCartera.placa_vehiculo;
    this.volante.tipoCartera = detalleCartera.tipo_cartera_numero;
    if (detalleCartera.total_con_descuento_decreto678 == '0' || detalleCartera.total_con_descuento_decreto678 == undefined) {
      this.volante.valorAPagar = detalleCartera.saldo_pagar;
    } else {
      this.volante.valorAPagar = detalleCartera.total_con_descuento_decreto678;
    }
    this.volante.valorDescuentoCapital = detalleCartera.valorDelDescuento;
    this.volante.valorIntereses = detalleCartera.valor_intereses;
    this.volante.descripcion = detalleCartera.tipo_cartera;

    this.VolantesInyectados.traerReferenciaPSE(this.referenciaReq, this.tokenString).subscribe((serviceResponse) => {
      if (serviceResponse.codigoRespuesta == "000") {
        this.referenciaResp = serviceResponse;
        this.volante.referencia = serviceResponse.consecutivoPagoPse;
        this.ruta.navigate(['infoPago', { infoPago: JSON.stringify(this.volante) }])
      } else {
        this.error = "Se ha presentado un error, por favor intente más tarde o consulte con el administrador."
        this.mostrarAlert();
        console.error(`Codigo: ${serviceResponse.codigoRespuesta} Descripción: ${serviceResponse.descripcion}`)
        throwError(`Codigo: ${serviceResponse.codigoRespuesta} Descripción: ${serviceResponse.descripcion}`);
      }
    });
  }

  concatenarNombre(): string {
    if (this.cartera.resumen_cartera.nombres_infractor.length > 0) {
      return this.cartera.resumen_cartera.nombres_infractor[0].primer_nombre + " " + this.cartera.resumen_cartera.nombres_infractor[0].segundo_nombre + " " + this.cartera.resumen_cartera.nombres_infractor[0].primer_apellido + " " + this.cartera.resumen_cartera.nombres_infractor[0].segundo_apellido
    } else {
      return "";
    }

  }

  llenarCatalogo() {
    this.VolantesInyectados.consultarCatalogoTipoDoc(this.tokenString).subscribe((catalogoService) => {
      this.tipoDocs = catalogoService;
    });
  }

  consultarTipoDePago() {
    this.VolantesInyectados.consultarTiposDePago(this.tokenString).subscribe((tiposPagoService) => {
      this.tiposDePago = tiposPagoService;
      if (this.tiposDePago.length > 0) {
        for (let tipoPago of this.tiposDePago) {
          if (tipoPago.descripcion == tipoPagoEnum.PAGO_COMPARENDO) {
            this.volante.tipoPago = tipoPago.idTipoPagoPse;
          }
        }
      } else {
        this.error = "Se ha presentado un error, por favor intente más tarde o consulte con el administrador."
        this.mostrarAlert();
        return throwError("El servicio de consultar tipos de pago ha retornado vacío.");
      }
    });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      this.ruta.navigate(['accessDenied'])
      console.error('Error decode: ', Error)
      return null;
    }
  }

  validarToken(tokenOrganismo: any) {
    if (tokenOrganismo.sub == organismoTransitoConst.CHIA.codigo || tokenOrganismo.sub == organismoTransitoConst.CARTAGENA.codigo) {
      console.log("Bienvenido ")
    } else {
      this.ruta.navigate(['accessDenied'])
      throw new Error("Token Invalido");
    }
  }

  mostrarAlert() {
    this.staticAlertClosed = false;
    setTimeout(() => this.staticAlertClosed = true, 10000);
  }

  displayedColumns: string[] = ['select', 'tipoCartera', 'placa', 'tipoDocumento', 'numeroDocumento', 'nombre', 'fechaCartera', 'valorCartera', 'totalDescuentoCapital', 'valorIntereses', 'valorCostas', 'cobroSistemantizacion', 'totalCartera'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}

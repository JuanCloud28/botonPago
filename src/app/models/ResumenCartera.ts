import { Infractor } from './Infractor';

export class ResumenCartera{
    "codigo_tipo_documento": string;
    "nombre_tipo_documento": string;
    "numero_documento": string;
    "nombres_infractor": Infractor[];
    "total_multa": string;
    "total_intereses": string;
    "costas_procesales": string;
    "total_cartera": string;
    "cantidad_registros": string;
    "fecha_hora_consulta": string;
    "total_cartera_decreto_678": string;
    "total_valor_del_descuento678":string;

    constructor(){
        this.codigo_tipo_documento = this.codigo_tipo_documento;
        this.nombre_tipo_documento = this.nombre_tipo_documento;
        this.numero_documento = this.numero_documento;
        this.nombres_infractor = new Array<Infractor>();
        this.total_multa = this.total_multa;
        this.total_intereses = this.total_intereses;
        this.costas_procesales = this.costas_procesales;
        this.total_cartera = this.total_cartera;
        this.cantidad_registros = this.cantidad_registros;
        this.fecha_hora_consulta = this.fecha_hora_consulta;
        this.total_cartera_decreto_678 = this.total_cartera_decreto_678;
        this.total_valor_del_descuento678 = this.total_valor_del_descuento678;
    }
}
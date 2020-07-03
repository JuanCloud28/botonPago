import { ResumenCartera } from './ResumenCartera';
import { DetalleCartera } from './DetalleCartera';


export class Cartera{
    codigo: string;
    descripcion : string;
    resumen_cartera: ResumenCartera;
    detalle_cartera: DetalleCartera[];

    constructor(){
        this.resumen_cartera = new ResumenCartera();
    }
}
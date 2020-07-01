import { UrlBody } from './UrlBody';

export class UrlPseResponse{
    codigoRespuesta : string;
    descripcion : string;
    body: UrlBody;

    constructor(){
        this.codigoRespuesta = this.codigoRespuesta;
        this.descripcion = this.descripcion;
        this.body = new UrlBody();
    }
}
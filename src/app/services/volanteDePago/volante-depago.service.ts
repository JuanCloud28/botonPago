import { Injectable } from '@angular/core';
import { PersonaMulta } from 'src/app/models/PersonaMulta';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { VolantePagoRequest } from 'src/app/models/VolantePagoRequest';
import { TokenResponse } from 'src/app/models/token/TokenResponse';
import { LoginToken } from 'src/app/models/token/LoginToken';
import { ReferenciaResponse } from 'src/app/models/referenciaPSE/referenciaResponse';
import { ReferenciaRequest } from 'src/app/models/referenciaPSE/referenciaRequest';
import { TipoDocumento } from 'src/app/models/catalogo/TipoDocumento';
import { catchError } from 'rxjs/operators';
import { UrlPseRequest } from 'src/app/models/urlPSe/UrlPseRequest';
import { UrlPseResponse } from 'src/app/models/urlPSe/UrlPseResponse';
import { TipoPagoPSE } from 'src/app/models/TipoDePago/TipoPagoPSE';
import { environment } from './../../../environments/environment'
import { Cartera } from 'src/app/models/cartera/Cartera';
import { CarteraRequest } from 'src/app/models/cartera/CarteraRequest';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VolanteDepagoService {

  credenciales: LoginToken = new LoginToken();
  volantePagoRequest: VolantePagoRequest = new VolantePagoRequest();
  personaMulta: PersonaMulta = new PersonaMulta();
  constructor(private http: HttpClient) { }

  consultarVolantes(): Observable<PersonaMulta> {
    return this.http.post<PersonaMulta>('https://volantespago.free.beeceptor.com/volantePago', this.volantePagoRequest).pipe(catchError(this.handleError));
  }

  consultarCartera(carteraRequest :CarteraRequest, token:string): Observable<Cartera> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}`});
    return this.http.post<Cartera>( environment.urlApiTest + 'consultaObligaciones',carteraRequest, { headers: headers } ).pipe(catchError(this.handleError));
  }

  traerToken(): Observable<TokenResponse> {
    this.credenciales.contrasena = "12345678";
    this.credenciales.correo_electronico = "cmdatatools@gmail.com";
    return this.http.post<TokenResponse>('http://192.168.44.22:8091/Login/ingresarApp', this.credenciales).pipe(catchError(this.handleError));
  }

  traerReferenciaPSE(referenciaRequest :ReferenciaRequest, token: string) : Observable<ReferenciaResponse>
  {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}`});
    return this.http.post<ReferenciaResponse>( environment.urlApiTest +'generarVolantePago',referenciaRequest, { headers: headers }).pipe(catchError(this.handleError));
  }

  consultarCatalogoTipoDoc(token: string) : Observable<TipoDocumento[]>
  {                                   
    const headers = new HttpHeaders({ 'Authorization':  `Bearer ${token}`});
    return this.http.get<TipoDocumento[]>(environment.urlApiTest + 'obtenerTiposIdentificacion', { headers: headers } ).pipe(catchError(this.handleError));
  }

  consultarUrlPse (urlPseRequest :UrlPseRequest, token: string) :Observable<UrlPseResponse>{
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}`});
    return this.http.post<UrlPseResponse>(environment.urlApiTest + 'iniciarPago',urlPseRequest, { headers: headers } ).pipe(catchError(this.handleError));
  }

  consultarTiposDePago(token: string) : Observable<TipoPagoPSE[]>
  {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}`});
    return this.http.get<TipoPagoPSE[]>( environment.urlApiTest +'obtenerTiposPagoPse', { headers: headers }).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error Desconocido!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}` + JSON.stringify(error);
    }
    window.alert("Se ha presentado un error, por favor intente más tarde o comuniquese con el administrador. ");
    return throwError(errorMessage);
  }
}
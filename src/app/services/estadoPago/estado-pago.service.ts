import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { EstadoPagoResponse } from 'src/app/models/estadoPago/estadoPagoResponse';
import { EstadoPagoRequest } from 'src/app/models/estadoPago/estadoPagoRequest';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadoPagoService {

  
  constructor(private http: HttpClient) { }

  consultaEstadoPago(estadoPagoReq : EstadoPagoRequest, token : string) : Observable<EstadoPagoResponse>
  {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}`});
    return this.http.post<EstadoPagoResponse>(environment.urlApiTest + 'consultarEstadoPagoPse',estadoPagoReq, { headers: headers } ).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error Desconocido!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert("Se ha presentado un error, por favor intente más tarde o comuniquese con el administrador. ");
    return throwError(errorMessage);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  public apiRestUrl: string = environment.urlApiSeguridad;
  constructor(private http: HttpClient) { }

  public generarToken():Observable<any>{
    return this.http.post(`${this.apiRestUrl}AutenticacionRest/authenticate`, {"username": "25175000", "password": "datatools"})
  }
}

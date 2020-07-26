// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlApiTest: 'http://192.168.36.30:8000/PortalPagoAPI/ServiciosRest/',
  //urlApiTest: 'http://172.16.40.44:8086/api/portal_pago/PortalPagoAPI/ServiciosRest/',
  urlApiSeguridad: "http://172.16.40.44:8087/api/seguridad_portal_pago/SeguridadPortalPagoAPI/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

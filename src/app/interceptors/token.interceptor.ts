// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { AuthService } from '../services/auth.service';
// import { Observable } from 'rxjs/Observable';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   constructor(public auth: AuthService) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
//     request = request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${this.auth.getToken()}`,
//         token: 'vishal'
//       }
//     });

//     return next.handle(request);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  	let token = localStorage.getItem('token');
  	let Dbname = localStorage.getItem('DBNAME');
  	if(!token){
  		token = "";
  	}
  	if(!Dbname){
  		Dbname="";
  	}
    const authReq = req.clone({
      // headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('currentUser')}`)
      headers: req.headers.set('Authorization', `Bearer ${token}`)
      .set('IPA', `${Dbname}`)
    });
    return next.handle(authReq);
  }
}
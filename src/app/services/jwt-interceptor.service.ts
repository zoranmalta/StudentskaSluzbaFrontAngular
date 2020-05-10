import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor,HttpRequest ,HttpHandler,HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private inj: Injector,private router:Router,private snackBar:MatSnackBar
            ,private loginService:LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
     // add authorization header with jwt token if available
     let loginService = this.inj.get(LoginService); 
    request = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${loginService.getToken()}`
      }
    });

    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
      if (err instanceof HttpErrorResponse) {
        //ako je error status 401 presrece i navigate na login page
        if(err.status===401){
          this.snackBar.open(`Morate se ponovo ulogovati`,"",{duration:2500})
          this.loginService.logout();
          this.router.navigate(['login']);
        }

      }
    }));
  }
}

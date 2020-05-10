import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

constructor(private route:Router,private loginService:LoginService){}

  canActivate():boolean{
    if(!this.loginService.isLoggedIn()){
      this.route.navigate(["login"]);
      return false
    }
    if(this.loginService.getRoles(this.getToken()).includes("ROLE_ADMIN")){
      return true
    }else{
      this.route.navigate(['**'])
    }
  }

  getToken():string{
    var token= localStorage.getItem("jwtToken")
    return token? token:""
  }
   
}
  

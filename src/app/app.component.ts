import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'StudentskaSluzba-Front';
  loggedIn: boolean=false;
  currentUser ={}

  constructor(private loginService:LoginService,private router:Router){}

  ngOnInit(): void {
    this.loggedIn=this.isLoggedIn();
    console.log( "Pri stvaranju app da li je ulogovan ;"+this.loggedIn)
    if(!this.loggedIn){
      this.removeCurrentUser()
      this.router.navigate(["login"])
    }
    this.currentUser=this.getCurrentUser()
    console.log("currentuser iz localstorage :"+this.currentUser);
    // this.router.navigate([""])
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  getCurrentUser(){
    return this.loginService.getCurrentUser();
  }
  removeCurrentUser(){
    this.loginService.removeCurrentUser();
  }
  
  logout(){
    this.loginService.logout();
    this.router.navigate([{outlets: {primary:'login', sidemenu:"anything"}}])
    this.loggedIn=false;
  }

}

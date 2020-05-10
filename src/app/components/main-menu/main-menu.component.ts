import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  isAdminRole:boolean=false;
  isUserRole:boolean=false;
  isProfRole:boolean=false;

  constructor(route: ActivatedRoute,private loginService:LoginService) {

    // route.params.subscribe(params => {
    //   console.log("side menu id parameter",params['id'])
    // });

}

  ngOnInit(): void {
    this.isAdminRole=this.loginService.getRoles(this.loginService.getToken()).includes("ROLE_ADMIN");
    this.isUserRole=this.loginService.getRoles(this.loginService.getToken()).includes("ROLE_USER");
    this.isProfRole=this.loginService.getRoles(this.loginService.getToken()).includes("ROLE_PROF");
  }

  // checkAdminRole(){
  //   this.isAdminRole=this.loginService.getRoles(this.loginService.getToken()).includes("ROLE_ADMIN");
  // }

}

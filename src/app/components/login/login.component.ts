import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/model/user';
import { LoginService } from 'src/app/services/login.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:User=new User();
  //@Output() public childEvent=new EventEmitter()
  hasError:boolean=false;

  constructor(private loginService:LoginService,private router:Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onSubmit(user:User){
    this.loginService.login(user).subscribe(
      data=>{
        this.hasError=false;
        if(data){
          //this.fireEvent()
          this.router.navigate([{outlets: {primary:"home", sidemenu:"sidemenu"}}])
        }
        console.log( "Success: "+data)
      },
      error=> {
      this.hasError=true;
      user.username="";
      user.password="";
      console.log("Error : "+error)
      }
    )
  }
  // salje event true u app.component da update property isLogged i prikaze home page
  // fireEvent(){
  //   this.childEvent.emit(true);
  // }
  // sklanja poruku o gresci na login stranici
  onFocus(){
    this.hasError=false;
  }

}

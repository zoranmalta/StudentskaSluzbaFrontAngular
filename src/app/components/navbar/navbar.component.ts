import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() logoutEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() loggedIn: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  logout(){
    this.logoutEvent.emit();
  }
}

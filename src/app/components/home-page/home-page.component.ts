import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  template: `
    <h1>Very nice home page</h1>
  `,
  styles: []
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

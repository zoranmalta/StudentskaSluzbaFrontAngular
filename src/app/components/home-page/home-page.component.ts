import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-home-page',
	template: `
		<div style="display: flex ;flex-direction: row; align-items: center; justify-content: center; height: 100%;">
			<img width="60%" src="../../assets/OfficePhoto" alt="" />
		</div>
	`,
	styles: [],
})
export class HomePageComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
	providedIn: 'root',
})
export class LoginService {
	private readonly loginPath = `${environment.apiBaseUri}/auth/login`;
	constructor(private http: HttpClient, private helper: JwtHelperService) {}

	login(user: User): Observable<boolean> {
		var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post<any>(this.loginPath, user, { headers }).pipe(
			map((res: any) => {
				console.log(res);
				let token = res && res['access_token'];
				if (token) {
					localStorage.setItem('jwtToken', token);
					localStorage.setItem(
						'currentUser',
						JSON.stringify({
							id: this.getId(token),
							username: user.username,
							token: token,
							roles: this.getRoles(token),
						})
					);

					// obrisati prikaz ovih korisnih funkcija po zavrsetku
					const helper = new JwtHelperService();

					const decodedToken = helper.decodeToken(token);
					console.log('DecodedToken : ' + decodedToken.sub);
					const expirationDate = helper.getTokenExpirationDate(token);
					console.log('expirationDate : ' + expirationDate);
					const isExpired = helper.isTokenExpired(token);
					console.log('IsExpired : ' + isExpired);

					return true;
				} else return false;
			})
		);
	}

	isLoggedIn() {
		const token = this.getToken();
		console.log('token iz localStorage' + token);
		if (!this.helper.isTokenExpired(token)) {
			return true;
		} else return false;
	}

	getToken(): string {
		var token = localStorage.getItem('jwtToken');
		return token ? token : '';
	}

	getCurrentUser() {
		var currentUser = localStorage.getItem('currentUser');
		return !!currentUser ? currentUser : {};
	}
	removeToken() {
		localStorage.removeItem('jwtToken');
	}
	removeCurrentUser() {
		localStorage.removeItem('currentUser');
	}
	//iz tokena izvlaci payload deo koji ima sve podatke stavljene u token
	decodePayload(token: string) {
		if (token == '') {
			return {};
		}
		let jwtData = token.split('.')[1];
		let decodedJwtJsonData = window.atob(jwtData);
		console.log('dekodiran payload : ' + decodedJwtJsonData);
		console.log('Decodiran jwt json data : ' + JSON.parse(decodedJwtJsonData).user.authorities.map((x) => x.name));
		return JSON.parse(decodedJwtJsonData);
	}

	//funkcija koja se poziva nad payload objektu za sub(subject)
	getId(token: string) {
		let id = this.decodePayload(token).sub;
		console.log(id);
		return id;
	}
	//funkcija koja se poziva nad payload objektu za roles
	getRoles(token: string): string[] {
		if (token == '') {
			return [];
		}
		let authorities = this.decodePayload(token).user.authorities.map((x) => x.authority) || [];
		console.log(authorities);
		return authorities;
	}
	logout() {
		this.removeToken();
		this.removeCurrentUser();
	}
}

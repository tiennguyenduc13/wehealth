import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = false;
  private _userId = null;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  login__(email: string, password: string) {
    console.log('ttt 222 login');
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`,
      { email: email, password: password }
    );
  }
  login(email: string, password: string) {
    console.log('ttt 222 login');
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`,
        { email: email, password: password }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }
  private setUserData(userData: AuthResponseData) {
    console.log('ttt start setUserData userData', userData);
    this._userIsAuthenticated = userData !== null;
  }
  logout() {
    this._userIsAuthenticated = false;
  }
}

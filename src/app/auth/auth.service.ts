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
  private _userId: string = null;
  private _loginName: string = null;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId(): string {
    return this._userId;
  }

  get loginName(): string {
    return this._loginName;
  }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`,
        { email: email, password: password }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }
  private setUserData(userData: AuthResponseData) {
    this._userId = userData.localId;
    this._loginName = userData.email;
    this._userIsAuthenticated = userData !== null;
  }
  logout() {
    this._userIsAuthenticated = false;
  }
}

import { Injectable, Inject } from '@angular/core';
import { BROWSER_STORAGE } from './storage';
import { User } from './user';
import { AuthResponse } from './authresponse';
import { RestlocDataService } from './restloc-data.service'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(@Inject (BROWSER_STORAGE) private storage: Storage,
    private restlocDataService: RestlocDataService
  ) { }

  public getToken(): string {
    return this.storage.getItem('restloc-token');
  }

  public saveToken(token: string): void {
    this.storage.setItem('restloc-token', token);
  }

  public login(user: User): Promise<any> {
    return this.restlocDataService.login(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token));
  }

  public register(user: User): Promise<any> {
    return this.restlocDataService.register(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token));
  }

  public logout(): void {
    this.storage.removeItem('restloc-token');
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  public getCurrentUser(): User {
    if (this.isLoggedIn()) {
      const token: string = this.getToken();
      const { email, name } = JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    }
  }
}


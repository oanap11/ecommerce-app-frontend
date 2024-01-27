import { Component, Inject } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent {

  isAuthenticated: boolean = false;
  userFullName: string = "";

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

  }

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  private getUserDetails() {
    if(this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (result) => {
          this.userFullName = result.name as string;
        }
      );
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }

}

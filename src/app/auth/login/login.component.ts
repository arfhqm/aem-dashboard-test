import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalAuthService } from '../../services/local-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localAuthService: LocalAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['user@aemenersol.com', [Validators.required, Validators.email]],
      password: ['Test@123', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (token: any) => {
        this.authService.saveToken(token);
        this.router.navigate(['/dashboard']);
      },
      error: async () => {
        const isLocalValid = await this.localAuthService.validateCredentials(username, password);

        if (isLocalValid) {
          this.authService.saveLocalSession();
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password. Please try again.';
        }

        this.isLoading = false;
      }
    });
  }
}
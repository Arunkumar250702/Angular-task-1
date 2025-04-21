import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';  
import { FormsModule } from '@angular/forms';
import { routes } from '../app.routes';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule,CommonModule,MatFormField,MatButton,MatInput,MatFormFieldModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
     console.log(this.email,this.password)
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login successful:', response.token);
        // alert("CONGRATS YOU ARE SUCCESSFULLY LOGIN")
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/receipe']);  
      },
      (error) => {
        alert("enter correct email and password")
        console.error('Login failed:', error);
      }
    );
  }
}

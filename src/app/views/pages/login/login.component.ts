import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private router:Router,
    private apiService: ApiService
  ) { }

  login(){
    // this.apiService.login('login', this.loginForm.value).then((response) => {

    // })
    this.router.navigate(['/dashboard']);
  }

}

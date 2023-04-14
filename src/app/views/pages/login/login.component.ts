import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  showAlert:boolean = false;
  isLoading:boolean = false

  loginForm: any
  message: any

  constructor(
    private router:Router,
    private apiService: ApiService
  ) { }

  ngOnInit(){
    this.initiateForm()
  }
  
  initiateForm(){
    this.loginForm = new FormGroup({
      username: new FormControl(""),
      password: new FormControl(""),
   });
  }


  login(){
    this.isLoading = true
    this.apiService.login('login', this.loginForm.value).then((response: any) => {
      if(response.success){
        this.router.navigate(['/dashboard']);
      }else{
        this.message = response.message
        this.showAlert = true
        setTimeout(() => {
          this.showAlert = false
        }, 3000);
      }
      this.isLoading = false
    })
  }

}

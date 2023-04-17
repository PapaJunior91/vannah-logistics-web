import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  showAlert:boolean = false;
  isLoading:boolean = false

  registerForm: any
  severity: any
  message: any

  ngOnInit(){
    this.initiateForm()
  }

  initiateForm(){
    this.registerForm = new FormGroup({
      first_name: new FormControl(""),
      last_name: new FormControl(""),
      company_name: new FormControl(""),
      address: new FormControl(""),
      company_region: new FormControl(""),
      password: new FormControl(""),
      confirm_password: new FormControl(""),
      username: new FormControl(""),
      phone: new FormControl(""),
      email: new FormControl(""),
   });
  }

  register(){
    this.isLoading = true
    this.apiService.postData('register', this.registerForm.value).then((response) => {
      if(response.success){
        this.showNotification(response, 'success')
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 3000);
      }else{
        this.showNotification(response, 'warning')
      }
    })
  }

  showNotification(response:any, color:any){
    this.message = response.message
    this.showAlert = true
    this.severity = color

    setTimeout(() => {
      this.showAlert = false
    }, 3000);

    this.isLoading = false;

  }


}

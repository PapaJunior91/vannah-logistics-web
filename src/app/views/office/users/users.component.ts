import { Component } from '@angular/core';
import { cilArrowLeft } from '@coreui/icons';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  constructor(
    private apiService: ApiService
  ) { }

  showTable:boolean = true
  showForm:boolean = false
  showAlert:boolean = false;
  isLoading:boolean = false

  users: Array<any> = <any>[]
  branches: Array<any> = <any>[]

  userForm: any;
  message:any;

  icons = { cilArrowLeft };

  ngOnInit(){
    this.getUsers()
    this.getBranches()
    this.initiateForm()
  }

  initiateForm(){
    this.userForm = new FormGroup({
      first_name: new FormControl(""),
      last_name: new FormControl(""),
      username: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl(""),
      role: new FormControl(""),
      region: new FormControl(""),
      branch_id: new FormControl("")
   });
  }

  async getUsers(){
    this.users = await this.apiService.getData('users').then((response) => {
      return response.data;
    })
  }

  async getBranches(){
    this.branches = await this.apiService.getData('branches').then((response) => {
      return response.data;
    })
  }

  createUser(){
    this.isLoading = true
    this.apiService.postData('users', this.userForm.value).then((response) => {
      if(response.success){
        this.getUsers()
        this.toggleFormTable('table')
        this.userForm.reset()
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

  toggleFormTable(el: any){
    switch(el){
      case 'table': 
        this.showTable = true
        this.showForm = false
        break;
      case 'form': 
        this.showForm = true
        this.showTable = false
        break;
    }
  }

}

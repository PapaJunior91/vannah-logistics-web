import { Component } from '@angular/core';
import { cilArrowLeft } from '@coreui/icons';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent {
  constructor(
    private apiService: ApiService
  ) { }

  showTable = true
  showForm = false
  showAlert:boolean = false;
  isLoading:boolean = false

  users: Array<any> = <any>[]
  branches: Array<any> = <any>[]
  _branches: Array<any> = <any>[]
  regions: Array<any> = <any>[]

  branchForm: any;
  message:any;

  icons = { cilArrowLeft };

  ngOnInit(){
    this.getBranches()
    this.getRegions()
    this.getUsers()
    this.initiateForm()
  }

  initiateForm(){
    this.branchForm = new FormGroup({
      branch_name: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl(""),
      role: new FormControl(""),
      region: new FormControl(""),
      manager_id: new FormControl("")
   });
  }

  getBranches(){
    this.apiService.getData('branches').then((response) => {
      this.branches = response.data;
      this._branches = response.data;
    })
  }

  async getRegions(){
    this.regions = await this.apiService.getData('regions').then((response) => {
      return response.data;
    })
  }

  async getUsers(){
    this.users = await this.apiService.getData('users').then((response) => {
      return response.data;
    })
  }

  createBranch(){
    this.isLoading = true
    this.apiService.postData('branches', this.branchForm.value).then((response) => {
      if(response.success){
        this.getBranches()
        this.toggleFormTable('table')
        this.branchForm.reset()
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

  searchBranch(e: any){
    let searchKey = e.value
    this.branches = this._branches.filter((branch:any) => {
      return  branch.branch_name.includes(searchKey);
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

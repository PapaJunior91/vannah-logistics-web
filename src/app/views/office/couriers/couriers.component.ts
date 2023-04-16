import { Component } from '@angular/core';
import { cilArrowLeft } from '@coreui/icons';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-couriers',
  templateUrl: './couriers.component.html',
  styleUrls: ['./couriers.component.scss']
})
export class CouriersComponent {
  constructor(
    private apiService: ApiService
  ) { }

  showTable = true
  showForm = false
  showAlert:boolean = false;
  isLoading:boolean = false

  couriers: Array<any> = <any>[]
  _couriers: Array<any> = <any>[]
  branches: Array<any> = <any>[]

  courierForm: any;
  message:any;

  icons = { cilArrowLeft };

  ngOnInit(){
    this.initiateForm()
    this.getCouriers()
  }

  initiateForm(){
    this.courierForm = new FormGroup({
      courier_name: new FormControl(""),
      address: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl(""),
      region: new FormControl(""),
   });
  }

  getCouriers(){
     this.apiService.getData('couriers').then((response) => {
      this.couriers = response.data;
      this._couriers = response.data;
    })
  }

  createCourier(){
    this.isLoading = true
    this.apiService.postData('couriers', this.courierForm.value).then((response) => {
      if(response.success){
        this.getCouriers()
        this.toggleFormTable('table')
        this.courierForm.reset()
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

  searchCourier(e: any){
    let searchKey = e.value
    this.couriers = this._couriers.filter((branch:any) => {
      return  branch.courier_name.includes(searchKey);
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

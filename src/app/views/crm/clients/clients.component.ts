import { Component } from '@angular/core';
import { cilArrowLeft } from '@coreui/icons';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  constructor(
    private apiService: ApiService
  ) { }

  showTable = true
  showForm = false
  showAlert:boolean = false;
  isLoading:boolean = false

  clients: Array<any> = <any>[]

  clientForm: any;
  message:any;

  icons = { cilArrowLeft };

  ngOnInit(){
    this.getClients()
    this.initiateForm()
  }

  initiateForm(){
    this.clientForm = new FormGroup({
      first_name: new FormControl(""),
      last_name: new FormControl(""),
      address: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl(""),
      region: new FormControl(""),
   });
  }

  async getClients(){
    this.clients = await this.apiService.getData('clients').then((response) => {
      return response.data;
    })
  }

  createClient(){
    this.isLoading = true
    this.apiService.postData('clients', this.clientForm.value).then((response) => {
      if(response.success){
        this.getClients()
        this.toggleFormTable('table')
        this.clientForm.reset()
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

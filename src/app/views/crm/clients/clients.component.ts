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

  showTable: boolean = true
  showForm: boolean = false
  showAlert:boolean = false
  isLoading:boolean = false
  showDeliveries:boolean = false

  clients: Array<any> = <any>[]
  regions: Array<any> = <any>[]
  clientDeliveries: Array<any> = <any>[]
  formFields: Array<any> = <any>[
    'first_name',
    'last_name',
    'address',
    'email',
    'phone',
    'region'
  ]

  clientId: number = 0
  formState: string = "create"

  clientForm: any;
  formData: any;
  message:any;
  severity: any;
  client: any

  icons = { cilArrowLeft };

  ngOnInit(){
    this.getClients()
    this.getRegions()
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

  async getRegions(){
    this.regions = await this.apiService.getData('regions').then((response) => {
      return response.data;
    })
  }

  async getClientDeliveries(clientId: number){
    this.toggleFormTable('delivery')
    this.clientDeliveries = await this.apiService.getData(`filter-deliveries?sender_id=${clientId}&reciever_id=${clientId}`).then((response) => {
      return response.data;
    })
  }

  archiveClient(clientId: number){
    this.apiService.updateData(`clients/${clientId}`, {}).then((response) => {
      if(response.success){
        this.showNotification(response, "success")
      }else{
        this.showNotification(response, "warning")
      }
    })
  }

  createClient(){
    // this.isLoading = true

    this.formData.created_by = localStorage.getItem("userId")

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

  updateClient(){

    // this.formData.sender_id = this.delivery.sender_id
    // this.formData.reciever_id = this.delivery.reciever_id

    this.apiService.updateData(`clients/${this.clientId}`, this.formData).then((response) => {
      if(response.success){
        this.showNotification(response, "success")
        this.getClients()
        this.toggleFormTable('table')
        this.clientForm.reset()
      }else{
        this.showNotification(response, "warning")
      }
      this.isLoading = false
    })
  }

  editClient(clientId: number){

    this.formState = "update"
    this.clientId = clientId
    this.client = this.clients.find(element => element.id === clientId);

    this.formFields.forEach((field) =>{
      this.clientForm.get(field)?.setValue(this.client[field])
    })

    // let toSelect = this.couriers.find(c => c.id == this.delivery.courier_id)
    // let _toSelect = this.branches.find(b => b.branch_id == this.delivery.from_branch_id)
    // let __toSelect = this.branches.find(b => b.branch_id == this.delivery.to_branch_id)

    // this.deliveryForm.get('courier_id')?.setValue(toSelect);
    // this.deliveryForm.get('from_branch_id')?.setValue(_toSelect);
    // this.deliveryForm.get('to_branch_id')?.setValue(__toSelect);

    this.toggleFormTable('form')
  }

  toggleFormTable(el: any){
    switch(el){
      case 'table': 
        this.showTable = true
        this.showForm = false
        this.showDeliveries = false

        break;
      case 'form': 
        this.showForm = true
        this.showTable = false
        this.showDeliveries = false

        break;
      case 'delivery': 
        this.showDeliveries = true
        this.showForm = false
        this.showTable = false
        break;
    }
  }

  saveClient(){
    this.isLoading = true
    this.formData = this.clientForm.value
    // this.formData.courier_id = this.deliveryForm.get('courier_id')?.value.id
    // this.formData.from_branch_id = this.deliveryForm.get('from_branch_id')?.value.branch_id
    // this.formData.to_branch_id = this.deliveryForm.get('to_branch_id')?.value.branch_id

    if(this.formState == "create")
      this.createClient()

    if(this.formState == "update")
      this.updateClient()

  }

  showNotification(response:any, color:any){
    this.message = response.message
    this.showAlert = true
    this.severity = color

    setTimeout(() => {
      this.showAlert = false
    }, 3000);

  }

}

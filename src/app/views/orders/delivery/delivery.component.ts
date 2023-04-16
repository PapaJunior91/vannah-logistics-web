import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { cilArrowLeft } from '@coreui/icons';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  @ViewChild('pdfPage') pdfPage!: ElementRef;
  
  
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    ) { }
    
  showForm: boolean = false
  showTable: boolean = true
  showAlert: boolean = false
  isLoading: boolean = false
  showDelivery: boolean = false
  deliveryQrCodeString: string = "";

  companyLogo = localStorage.getItem("companyLogo")
  companyName = localStorage.getItem("companyName")
  companyEmail = localStorage.getItem("companyEmail")
  companyPhone = localStorage.getItem("companyPhone")
  companyAddress = localStorage.getItem("companyAddress")

  deliveries: Array<any> = <any>[]
  branches: Array<any> = <any>[]
  couriers: Array<any> = <any>[]
  formFields: Array<any> = <any>[
    'sender_first_name', 
    'sender_last_name', 
    'sender_phone',
    'sender_email',
    'reciever_first_name',
    'reciever_last_name',
    'reciever_phone',
    'reciever_email',
    'package_value',
    'description',
    'amount_paid',
    'arrival_date',
    'delivery_status',
    'payment_option'
  ]
  
  deliveryId: number = 0
  formState: string = "create"

  deliveryForm: any;
  formData: any;
  message: any;
  severity: any;
  delivery: any;
  notification_message: any;

  icons = { cilArrowLeft };

  ngOnInit(){
    this.getBranches()
    this.getCouriers()
    this.getDeliveries()
    this.initiateForm()
  }

  initiateForm(){
    this.deliveryForm = this.formBuilder.group({
      sender_first_name: new FormControl(""),
      sender_last_name: new FormControl(""),
      sender_phone: new FormControl(""),
      sender_email: new FormControl(""),
      reciever_first_name: new FormControl(""),
      reciever_last_name: new FormControl(""),
      reciever_phone: new FormControl(""),
      reciever_email: new FormControl(""),
      from_branch_id: new FormControl(""),
      to_branch_id: new FormControl(""),
      courier_id: new FormControl(),
      package_value: new FormControl(""),
      delivery_status: new FormControl(""),
      arrival_date: new FormControl(""),
      description: new FormControl(""),
      payment_option: new FormControl(""),
      amount_paid: new FormControl(""),
      sms_notification: new FormControl(""),
      email_notification: new FormControl({value: '', disabled: true}),
      whatsapp_notification: new FormControl({value: '', disabled: true}),
      no_notification: new FormControl(""),
      notification_message: new FormControl("")
   });
  }

  async getBranches(){
    this.branches = await this.apiService.getData('branches').then((response) => {
      return response.data;
    })
  }

  async getDeliveries(){
    this.deliveries = await this.apiService.getData('deliveries').then((response) => {
      return response.data;
    })
  }

  async getCouriers(){
    this.couriers = await this.apiService.getData('couriers').then((response) => {
      return response.data;
    })
  }

  archiveDelivery(deliveryId: number){
    this.apiService.updateData(`archive-deliveries/${deliveryId}`, {}).then((response) => {
      if(response.success){
        this.showNotification(response, "success")
        this.getDeliveries()
      }else{
        this.showNotification(response, "warning")
      }
    })
  }

  saveDelivery(){
    this.isLoading = true
    this.formData = this.deliveryForm.value
    this.formData.courier_id = this.deliveryForm.get('courier_id')?.value.id
    this.formData.from_branch_id = this.deliveryForm.get('from_branch_id')?.value.branch_id
    this.formData.to_branch_id = this.deliveryForm.get('to_branch_id')?.value.branch_id

    if(this.formState == "create")
      this.createDelivery()

    if(this.formState == "update")
      this.updateDelivery()

  }

  createDelivery(){

    this.formData.created_by = localStorage.getItem("userId")
    this.formData.notification_message = this.notification_message

    this.apiService.postData('deliveries', this.formData).then((response) => {
      if(response.success){
        this.message = response.message
        this.showAlert = true
        this.severity = "success"
        this.getDeliveries()
        this.toggleFormTable('table')
        this.deliveryForm.reset()
      }else{
        this.severity = "warning"
        this.message = response.message
        this.showAlert = true
        setTimeout(() => {
          this.showAlert = false
        }, 3000);
      }
      this.isLoading = false
    })
  }

  updateDelivery(){

    this.formData.sender_id = this.delivery.sender_id
    this.formData.reciever_id = this.delivery.reciever_id

    this.apiService.updateData(`deliveries/${this.deliveryId}`, this.formData).then((response) => {
      if(response.success){
        this.showNotification(response, "success")
        this.getDeliveries()
        this.toggleFormTable('table')
        this.deliveryForm.reset()
      }else{
        this.showNotification(response, "warning")
      }
      this.isLoading = false
    })
  }

  editDelivery(deliveryId: number){

    
    this.formState = "update"
    this.deliveryId = deliveryId
    this.delivery = this.deliveries.find(element => element.id === deliveryId);

    this.formFields.forEach((field) =>{
      this.deliveryForm.get(field)?.setValue(this.delivery[field])
    })

    let toSelect = this.couriers.find(c => c.id == this.delivery.courier_id)
    let _toSelect = this.branches.find(b => b.branch_id == this.delivery.from_branch_id)
    let __toSelect = this.branches.find(b => b.branch_id == this.delivery.to_branch_id)

    this.deliveryForm.get('courier_id')?.setValue(toSelect);
    this.deliveryForm.get('from_branch_id')?.setValue(_toSelect);
    this.deliveryForm.get('to_branch_id')?.setValue(__toSelect);

    this.toggleFormTable('form')
  }

  getDelivery(deliveryId: number){
    console.log(this.delivery = this.deliveries.find(element => element.id == deliveryId));
    this.deliveryQrCodeString = this.delivery.tracking_code
    this.toggleFormTable('print')
  }

  printDelivery() {

    let _node:any = document.getElementById('pdfPage');

    htmlToImage.toPng(_node)
  .then(function (dataUrl) {
    var img = new Image();
    img.src = dataUrl;
    document.body.appendChild(img);
  })
  .catch(function (error) {
    console.error('oops, something went wrong!', error);
  });

  return
    const pdfPage = this.pdfPage.nativeElement;
    var html = htmlToPdfmake(pdfPage.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download(); 

  }

  toggleFormTable(el: any){
    switch(el){
      case 'table': 
        this.showTable = true
        this.showForm = false
        this.showDelivery = false

        break;
      case 'form': 
        this.showForm = true
        this.showTable = false
        this.showDelivery = false

        break;
      case 'print': 
        this.showDelivery = true
        this.showTable = false
        this.showForm = false
        break;
    }
  }

  showNotification(response:any, color:any){
    this.message = response.message
    this.showAlert = true
    this.severity = color

    setTimeout(() => {
      this.showAlert = false
    }, 3000);

  }

  sendNotification(){
    // generate message
    let sender_fname = this.deliveryForm.get('sender_first_name')?.value
    let sender_lname = this.deliveryForm.get('sender_last_name')?.value
    let reciever_fname = this.deliveryForm.get('reciever_first_name')?.value
    let reciever_lname = this.deliveryForm.get('reciever_last_name')?.value
    let arrival_date = this.deliveryForm.get('arrival_date')?.value

    let message = `Parcel from ${sender_fname} ${sender_lname} to ${reciever_fname} ${reciever_lname} is on the way, it will arrive at ${arrival_date}`

    this.notification_message = message
    this.deliveryForm.get('notification_message').setValue(message)

  }

}

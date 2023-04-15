import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { cilArrowLeft } from '@coreui/icons';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormControl } from '@angular/forms';


declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  @ViewChild('pdfPage') pdfPage!: ElementRef;

  constructor(
    private apiService: ApiService
  ) { }

  showTable = true
  showForm = false
  showDelivery = false
  showAlert:boolean = false;
  isLoading:boolean = false

  delivery: any
  deliveries: Array<any> = <any>[]
  branches: Array<any> = <any>[]
  couriers: Array<any> = <any>[]

  deliveryForm: any;
  message:any;

  icons = { cilArrowLeft };

  ngOnInit(){
    this.getBranches()
    this.getCouriers()
    this.getDeliveries()
    this.initiateForm()
  }

  initiateForm(){
    this.deliveryForm = new FormGroup({
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
      courier_id: new FormControl(""),
      package_value: new FormControl(""),
      delivery_status: new FormControl(""),
      arrival_date: new FormControl(""),
      description: new FormControl(""),
      payment_option: new FormControl(""),
      amount_paid: new FormControl("")
   });
  }

  async getBranches(){
    this.branches = await this.apiService.getData('branches').then((response) => {
      return response.data;
    })
  }

  async getCouriers(){
    this.couriers = await this.apiService.getData('couriers').then((response) => {
      return response.data;
    })
  }

  async getDeliveries(){
    this.deliveries = await this.apiService.getData('deliveries').then((response) => {
      return response.data;
    })
  }

  createDelivery(){
    this.isLoading = true
    this.apiService.postData('deliveries', this.deliveryForm.value).then((response) => {
      if(response.success){
        this.getDeliveries()
        this.toggleFormTable('table')
        this.deliveryForm.reset()
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

  editDelivery(deliveryId: number){
    this.delivery = this.deliveries.find(element => element.id === deliveryId);
    this.toggleFormTable('form')
  }

  getDelivery(deliveryId: number){
    this.delivery = this.deliveries.find(element => element.id === deliveryId);
    this.toggleFormTable('print')
  }

  printDelivery() {
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

}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  baseUrl = environment.baseUrl

  isLoggedin = localStorage.getItem("isLoggedin")

  constructor(
    private httpClient: HttpClient
  ) { }

  getAuthStatus(){
    if(this.isLoggedin)
      return true
    
    return false
  }

  login(url: any, data: any){
    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(this.baseUrl + url, data, {
      }).subscribe((value) => {
        resolve(value)
      })
    })
  }

  async getData(url: any){
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(this.baseUrl + url,{
      }).subscribe((value) => {
        resolve(value)
      })
    })
  }

  async postData(url: any, data: any){
    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(this.baseUrl + url, data, {
      }).subscribe((value) => {
        resolve(value)
      })
    })
  }

  async updateData(url: any, data: any){
    return new Promise<any>((resolve, reject) => {
      this.httpClient.put(this.baseUrl + url, data, {
      }).subscribe((value) => {
        resolve(value)
      })
    })
  }

}

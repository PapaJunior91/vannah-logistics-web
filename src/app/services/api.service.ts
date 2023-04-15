import { Injectable } from '@angular/core';
import axio from 'axios';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  _baseUrl = 'http://127.0.0.1:8000/api/'
  baseUrl = 'https://tms.server.nexent.dev/api/'

  constructor(
    private httpClient: HttpClient
  ) { }

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

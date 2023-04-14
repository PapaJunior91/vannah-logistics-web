import { Injectable } from '@angular/core';
import axio from 'axios';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://127.0.0.1:8000/api/'

  constructor(
    private httpClient: HttpClient
  ) { }

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

}

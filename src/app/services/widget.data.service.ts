import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WidgetDataService {

  private numberOfDeliveries = new BehaviorSubject([]);
  currentNumberOfDeliveries= this.numberOfDeliveries.asObservable();

  private income = new BehaviorSubject(0);
  currentIncome= this.income.asObservable();

  constructor() { }

  updateNumberOfDeliveries(deliveries: any) {
    this.numberOfDeliveries.next(deliveries)
  }

  updateIncome(income: number) {
    this.income.next(income)
  }

}

import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { WidgetDataService } from '../../services/widget.data.service';
import { ApiService } from 'src/app/services/api.service';
import { cilChartPie, cilArrowRight } from '@coreui/icons';
import * as moment from 'moment';



interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  message:string="";
  approvalText:string="";
  numberOfDeliveries: any = 0
  totalIncome: any;
  deliveriesCount: any;
  todayArrivals: any;
  totalDeliveries: any
  onTransit:any
  arrived:any

  icons = { cilChartPie, cilArrowRight };

  constructor(
    private chartsData: DashboardChartsData,
    private widgetDataService:WidgetDataService,
    private apiService:ApiService
    ) {
  }

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/img/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/img/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/img/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/img/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/img/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/img/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];
  public mainChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month')
  });

  ngOnInit(): void {
    this.initCharts();
    this.getDeliveries()
    this.getTotalIncome()
    this.widgetDataService.currentNumberOfDeliveries.subscribe(value => this.numberOfDeliveries = value);
  }

  initCharts(): void {
    this.mainChart = this.chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initMainChart(value);
    this.initCharts();
  }

  getDeliveries(){
    this.apiService.getData('deliveries').then((response) => {

      this.totalDeliveries = response.data.length


      let today_date = moment().format('YYYY-MM-DD')

      this.todayArrivals = response.data.filter((delivery:any) => {
        return today_date === moment(delivery.arrival_date).format('YYYY-MM-DD');
      })

      let on_transit_count = response.data.filter((delivery:any) => {
        return 'on transit' === delivery.delivery_status;
      })

      let arrived_count = response.data.filter((delivery:any) => {
        return 'arrived' === delivery.delivery_status;
      })

        this.onTransit =  on_transit_count.length
        this.arrived = arrived_count.length
      

      // this.widgetDataService.updateNumberOfDeliveries(deliveries)
    })
  }

  getTotalIncome(){
    this.apiService.getData('total-income').then((response) => {
      this.totalIncome = response.data
      this.widgetDataService.updateIncome(response.data)
    })
  }

  submit(){
  console.log(this.numberOfDeliveries)
  }
 

}

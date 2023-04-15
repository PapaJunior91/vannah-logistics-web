import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './views/login/login.component';
import { Page404Component } from './views/page404/page404.component';
import { Page500Component } from './views/page500/page500.component';
import { BranchesComponent } from './views/office/branches/branches.component';
import { UsersComponent } from './views/office/users/users.component';
import { CouriersComponent } from './views/office/couriers/couriers.component';
import { DeliveryComponent } from './views/orders/delivery/delivery.component';
import { ClientsComponent } from './views/crm/clients/clients.component';
import { RegisterComponent } from './views/register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Orders'
    },
    children: [
      {
        path: 'order/deliveries',
        component: DeliveryComponent,
        data: {
          title: 'Deliveries'
        },
      },
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'CRM'
    },
    children: [
      {
        path: 'crm/clients',
        component: ClientsComponent,
        data: {
          title: 'Clients'
        },
      },
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Office'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'office/couriers',
        component: CouriersComponent,
        data: {
          title: 'Courier'
        },
      },
      {
        path: 'office/branches',
        component: BranchesComponent,
        data: {
          title: 'Branch'
        },
      },
      {
        path: 'office/users',
        component: UsersComponent,
        data: {
          title: 'Users'
        },
      }
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

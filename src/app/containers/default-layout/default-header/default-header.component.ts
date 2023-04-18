import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(
    private classToggler: ClassToggleService,
    private apiService: ApiService,
    private router:Router,

    ) {
    super();
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['/login']);
  }
}

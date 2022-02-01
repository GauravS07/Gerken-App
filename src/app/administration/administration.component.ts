import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
declare var $: any;

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css'],
})
export class AdministrationComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {
    this.apiService.externalLogoutCheck();
    console.log('Construct Account');
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    }else{
      this.apiService.startupChain2(1);
    }
  }

  ngOnInit() {}
}

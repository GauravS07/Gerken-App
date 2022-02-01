import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
declare var $: any;

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css'],
})
export class ProcessComponent implements OnInit {
  weiterleitung: string = '';
  constructor(private apiService: ApiService, private router: Router) {
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    }else{
      this.apiService.startupChain2(1);
    }
  }

  ngOnInit() {}
}

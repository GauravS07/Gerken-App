import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
declare var $: any;

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  endpunkt: string = '';
  storage!: JSON;
  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    }else{
      this.apiService.startupChain2(1);
    }
  }

  ngOnInit() {
  }
}

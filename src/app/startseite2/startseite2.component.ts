import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-startseite2',
  templateUrl: './startseite2.component.html',
  styleUrls: ['./startseite2.component.css'],
})
export class Startseite2Component implements OnInit {
  mode = '';
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    }
    this.route.params.subscribe((params) => {
      //console.log(params);
      if (params['mode']) {
        this.mode = params['mode'];
        console.log(this.mode);
      }
    });
  }

  ngOnInit() {
    if (sessionStorage.getItem('Usertoken')) {
      if (sessionStorage.getItem('Usertoken')!.length > 0) {
        document.getElementById('id_account_btn')!.classList.add('loggedin');
        var usertoken = sessionStorage.getItem('Usertoken');
        console.log(usertoken);
      } else {
        this.router.navigate(['startseite'], {});
      }
    } else {
      this.router.navigate(['startseite'], {});
    }
  }

  loadmore(what: string) {
    console.log(what);
  }

  onload() {
    this.apiService.externalLogoutCheck2();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
declare var $: any;

@Component({
  selector: 'app-standorte',
  templateUrl: './standorte.component.html',
  styleUrls: ['./standorte.component.css'],
})
export class StandorteComponent implements OnInit {
  eingeloggt = false;
  email = '';
  token = '';
  constructor(private apiService: ApiService, private router: Router) {
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    } else {
      this.apiService.startupChain2(1);
    }
  }

  ngOnInit() {
    if (
      sessionStorage.getItem('Email') &&
      sessionStorage.getItem('Usertoken')
    ) {
      this.eingeloggt = true;
      this.email = sessionStorage.getItem('Email');
      this.token = sessionStorage.getItem('Usertoken');
    }
  }
  reconf(id1: string, id2: string, id3: string) {
    this.apiService.reconf(id1, id2, id3);
  }

  onload() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log("Index: "+index);
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    }else{
      document.getElementById('id_c2a').style.display = 'none';
    }
    scroll(0, 0);
    this.apiService.externalLogoutCheck2();
    if (document.getElementById('testmarker')) {
      if (document.getElementById('testmarker').innerHTML == 'TEST') {
        this.apiService.loadMenue(this.router);
      }
    }
    this.loadStandort();
  }

  loadStandort() {
    var email = sessionStorage.getItem('Email');
    var token = sessionStorage.getItem('Usertoken');
    var input = this.apiService.generateInput([
      ['email', email],
      ['token', token],
    ]);
    if (sessionStorage.getItem('Standorte')) {
      var data = sessionStorage.getItem('Standorte');
      console.log(data);
      this.constructStandort(JSON.parse(data)['standorte']);
    } else {
      this.apiService.postEndpunkt(input, 'standorte1').subscribe((data) => {
        console.log(data);
        sessionStorage.setItem('Standorte', JSON.stringify(data));
        this.constructStandort(data['standorte']);
      });
    }
  }

  closeStandort() {
    $.fancybox.close();
  }

  saveStandort() {
    var hash = this.apiService.makeid(7);
    if ((document.getElementById('new_id') as HTMLInputElement).value != '') {
      hash = (document.getElementById('new_id') as HTMLInputElement).value;
    }
    var name = (document.getElementById('new_name') as HTMLInputElement).value;
    var zusatz = (document.getElementById('new_zusatz') as HTMLInputElement)
      .value;
    var strasse = (document.getElementById('new_strasse') as HTMLInputElement)
      .value;
    var plz = (document.getElementById('new_plz') as HTMLInputElement).value;
    var ort = (document.getElementById('new_ort') as HTMLInputElement).value;
    var land = (document.getElementById('new_land') as HTMLSelectElement).value;
    var aktive = '0';
    if (
      (document.getElementById('new_aktive') as HTMLInputElement).value != '0'
    ) {
      aktive = (document.getElementById('new_aktive') as HTMLInputElement)
        .value;
    }

    var email = sessionStorage.getItem('Email');
    var token = sessionStorage.getItem('Usertoken');
    var input = this.apiService.generateInput([
      ['email', email],
      ['token', token],
      ['id', hash],
      ['name', name],
      ['zusatz', zusatz],
      ['strasse', strasse],
      ['plz', plz],
      ['ort', ort],
      ['land', land],
    ]);

    this.apiService.postEndpunkt(input, 'standorte2').subscribe((data) => {
      console.log(data);
      if (data['result_check']) {
        (document.getElementById('new_name') as HTMLInputElement).value = '';
        (document.getElementById('new_zusatz') as HTMLInputElement).value = '';
        (document.getElementById('new_strasse') as HTMLInputElement).value = '';
        (document.getElementById('new_plz') as HTMLInputElement).value = '';
        (document.getElementById('new_ort') as HTMLInputElement).value = '';

        this.apiService.postEndpunkt(input, 'standorte1').subscribe((data2) => {
          console.log(data2);
          sessionStorage.setItem('Standorte', JSON.stringify(data2));
          console.log('reconstruct');
          this.constructStandort(data2['standorte']);
        });
      }
    });
    $.fancybox.close();
  }
  newStandort() {
    (document.getElementById('new_name') as HTMLInputElement).value = '';
    (document.getElementById('new_strasse') as HTMLInputElement).value = '';
    (document.getElementById('new_plz') as HTMLInputElement).value = '';
    (document.getElementById('new_ort') as HTMLInputElement).value = '';
    (document.getElementById('new_zusatz') as HTMLInputElement).value = '';
    (document.getElementById('new_land') as HTMLSelectElement).value =
      'Deutschland';
    (document.getElementById('new_id') as HTMLInputElement).value = '';
    document.getElementById('new_title').innerHTML = 'Standort anlegen';
    (document.getElementById('new_aktive') as HTMLInputElement).value = '0';
    $.fancybox.open({
      touch: false,
      src: '#id_modal_adress',
      type: 'inline',
      opts: {},
    });
  }

  constructStandort(data: any) {
    var count = data['count'];
    var border = document.getElementById('standorte');
    border.innerHTML = '';
    console.log('construction');
    //console.log(data);
    for (let i = 0; i < count; i++) {
      var ele = this.apiService.constructHTML('Standorte', [
        this.router,
        data[i],
      ]);
      var hash = ele.getAttribute('data-hash');
      console.log('Hash: ' + hash);

      border.appendChild(ele);

      (
        document.getElementById('b' + hash) as HTMLAnchorElement
      ).addEventListener('click', function (event) {
        console.log('Edit');
        $.fancybox.open({
          touch: false,
          src: '#id_modal_adress',
          type: 'inline',
          opts: {},
        });
        //lade die infos in das Modal:
        var fallback = this.getAttribute('data-fallback').split('|');
        console.log(fallback);
        (document.getElementById('new_name') as HTMLInputElement).value =
          fallback[0];
        (document.getElementById('new_strasse') as HTMLInputElement).value =
          fallback[1];
        (document.getElementById('new_plz') as HTMLInputElement).value =
          fallback[2];
        (document.getElementById('new_ort') as HTMLInputElement).value =
          fallback[3];
        (document.getElementById('new_zusatz') as HTMLInputElement).value =
          fallback[7];
        (document.getElementById('new_land') as HTMLSelectElement).value =
          fallback[6];
        (document.getElementById('new_id') as HTMLInputElement).value =
          fallback[5];
        (document.getElementById('new_aktive') as HTMLInputElement).value =
          fallback[4];
        document.getElementById('new_title').innerHTML = 'Standort bearbeiten';
        event.preventDefault();
      });

      (
        document.getElementById('c' + hash) as HTMLAnchorElement
      ).addEventListener('click', function (event) {
        console.log('Delete');
        console.log(hash);
        document
          .getElementById('approve')
          .setAttribute('data-src', this.getAttribute('data-hash'));
        $.fancybox.open({
          touch: false,
          src: '#id_modal_delete',
          type: 'inline',
          opts: {},
        });
        event.preventDefault();
      });
    }
  }

  deleteStandort() {
    var hash = document.getElementById('approve').getAttribute('data-src');
    console.log(hash);
    var name = 'a' + hash;
    var id = document.getElementById(name).getAttribute('data-id');
    document.getElementById(name).remove();
    //email, usertoken, id
    //var input={{}}
    var input = this.apiService.generateInput([
      ['email', sessionStorage.getItem('Email')],
      ['token', sessionStorage.getItem('Usertoken')],
      ['id', id],
    ]);
    console.log(input);
    this.apiService.postEndpunkt(input, 'standorte3').subscribe((data) => {
      console.log(data);
      sessionStorage.setItem('Standorte', JSON.stringify(data['erfolg']));
      this.constructStandort(data['erfolg']);
    });
    $.fancybox.close();
  }
}

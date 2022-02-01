import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router
  ) {
    var t = sessionStorage.getItem('DEV');
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    } else {
      this.apiService.startupChain2(1);
    }
  }

  bug1() {
    if (document.getElementById('bugbtn').innerHTML == 'Bugreport') {
      document.getElementById('bugreport').style.display = 'block';
      document.getElementById('bugreport').style.opacity = '1';
      document.getElementById('bugbtn').innerHTML = 'zuklappen';
    } else {
      document.getElementById('bugreport').style.display = '';
      document.getElementById('bugbtn').innerHTML = 'Bugreport';
      document.getElementById('bugreport').style.opacity = '';
    }
  }

  bug2() {
    var menue = document.getElementById('debug_menue');
    console.log(menue.style.top);
    var btn = document.getElementById('bug2');
    if (menue.style.top == '' || !menue.style.top) {
      menue.style.top = '0px';
      btn.style.transform = 'rotate(180deg)';
      document.getElementById('muep').innerHTML = '';
    } else {
      menue.style.top = '';
      btn.style.transform = '';
      if (document.getElementById('bugbtn').innerHTML != 'Bugreport') {
        document.getElementById('bugreport').style.display = '';
        document.getElementById('bugbtn').innerHTML = 'Bugreport';
      }
      document.getElementById('muep').innerHTML =
        '.debug_menue a, .debug_menue label {        display:none;      }';
    }
  }

  bug3() {
    var place = (document.getElementById('place') as HTMLInputElement).value;
    var comment = (document.getElementById('comment') as HTMLInputElement)
      .value;
    var zeit = new Date();
    var link = this.overdrive3();
    var input = this.apiService.generateInput([
      ['seite', place],
      ['comment', comment],
      ['zeit', zeit],
      ['link', link],
    ]);
    this.apiService.postEndpunkt(input, 'bugreport').subscribe((data) => {
      console.log('Bugreport');
      console.log(data);
    });
    console.log(place + ', ' + comment);
    this.bug1();
    this.bug2();
  }

  overdrive3(): string {
    var url = window.location;
    var lg = '&login=false';
    if (sessionStorage.getItem('Usertoken')) {
      lg = '&login=true';
    }
    console.log(url.href);
    console.log(url.pathname);
    var link = url.href;
    if (url.pathname != '/') {
      link = url.href.split(url.pathname)[0];
    }

    if (url.pathname.includes('geraete-mieten')) {
      link +=
        '/geraete-mieten?overdrive=' + url.pathname.split('geraete-mieten')[1];
    } else {
      link += '?overdrive=' + url.pathname;
    }

    link += lg;
    console.log(link);
    document.getElementById('ov4').innerHTML = link;
    return link;
  }

  orderresume() {
    var id = parseInt(sessionStorage.getItem('Stateindex'));
    var slug = sessionStorage.getItem('last');
    id = id - 1;
    sessionStorage.setItem('Stateindex', id.toString());
    //sessionStorage.setItem("resume","true");
    var input = this.apiService.generateInput([['slug', slug]]);
    this.apiService.postEndpunkt(input, 'produktbyslug').subscribe((data) => {
      console.log(data);
      localStorage.setItem('Produkt' + slug, JSON.stringify(data['produkt']));
      this.router.navigate(['/mietprozess/auswahl', slug], {});
    });
  }

  orderbreak() {
    console.log('lösche orderstates und setzte index auf 0');
    sessionStorage.setItem('Stateindex', '0');
    sessionStorage.removeItem('ZEIT');
    sessionStorage.removeItem('STANDORT');
    var email = sessionStorage.getItem('Email');
    var token = sessionStorage.getItem('Usertoken');
    var input = this.apiService.generateInput([
      ['email', email],
      ['token', token],
    ]);
    this.apiService.postEndpunkt(input, 'clearauswahl').subscribe((data) => {
      console.log(data);
      sessionStorage.removeItem('last');
      document.getElementById('id_c2a').style.display = 'none';
      var url = window.location;
      if (url.pathname.includes('mietprozess')) {
        this.router.navigate(['/mietprozess'], {});
      }
    });
  }

  ngOnInit() {
    console.log('initalize Topbar');
  }
  delete() {
    this.bug2();
    console.log('delete');
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/'], {});
    if (document.getElementById('eingeloggt')) {
      window.location.reload();
    }
  }

  overdrive2(a: string, b: string) {
    this.bug2();
    this.overdrive(a, b);
  }

  endpunkt() {
    if (!sessionStorage.getItem('Endpunkt')) {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie =
        'angular=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      sessionStorage.setItem('Endpunkt', 'overview2');
    } else {
      if (sessionStorage.getItem('Endpunkt') == 'overview') {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem('Endpunkt', 'overview2');
      } else {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem('Endpunkt', 'overview');
      }
    }
    this.router.navigate(['/'], {});
    window.location.reload();
  }

  overdrive(login: string, weiterleitung: string) {
    var weiterleitung2 = weiterleitung;
    if (weiterleitung == '0') {
      weiterleitung2 = '';
    }
    if ((login = 'true')) {
      var loginstring = this.apiService.generateInput([
        ['username', 'sophia.pimpels@codersunlimited.com'],
        ['password', 'test'],
      ]);
      this.apiService.postEndpunkt(loginstring, 'login').subscribe((data) => {
        sessionStorage.setItem('Usertoken', data['usertoken']);
        sessionStorage.setItem('Stateindex', data['order']['index']);
        var index = parseInt(data['order']['index']);
        console.log('Index: ' + index);
        if (index != 0 && index) {
          var data2 = data['order']['data'];
          console.log(data2);
          var slug = '';
          document.getElementById('id_c2a').style.display = 'block';
          for (let i = 0; i < data2.length; i++) {
            slug = data2[i]['produkt']['slug'];
            var e= data2[i];
            console.log(e);
          }
          sessionStorage.setItem('last', slug);
        }
        this.saveMiethistorie(data['miethistorie']);
        this.apiService.loadMenue(this.router);
        sessionStorage.setItem('Email', 'sophia.pimpels@codersunlimited.com');
        document.getElementById('id_account_btn')!.classList.add('loggedin');
        if (weiterleitung == '0') {
          window.location.reload();
        }
        this.router.navigate(['/' + weiterleitung2], {});
      });
    } else {
      this.router.navigate(['/' + weiterleitung2], {});
    }
  }

  demo() {
    document.getElementById('id_menu_btn')!.classList.remove('open');
    document.getElementById('id_menu_wrapper')!.style.display = 'none';
    if (sessionStorage.getItem('DEV') == 'false') {
      sessionStorage.setItem('DEV', 'true');
      console.log('DEV BETRIEB EINGESCHALTET');
    } else {
      sessionStorage.setItem('DEV', 'false');
      console.log('LIVE BETRIEB EINGESCHALTET');
    }
  }

  demo2() {
    var inputs = document.getElementsByTagName('input');
    var range = Array<any>();
    //console.log(input);
    var index = 0;
    Array.from(inputs).forEach((item) => {
      //console.log(item.getAttribute('type'));
      if (item.getAttribute('type') == 'range') {
        range.push(item);
      }
      index++;
    });
    //console.log(range);
    for (let j = 0; j < range.length; j++) {
      if (!range[j].classList.contains('doublerange')) {
        range[j].value = 24;
      }
    }
  }

  sub(x: number) {
    console.log('Inner Topbar:' + x);
    if (sessionStorage.getItem('DEV') == 'true') {
      this.apiService.sub(x);
    }
  }

  setCookie(cname: string, cvalue: string, exdays: number) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 2 * 60 * 60 * 1000);
    var expires = -1;
    document.cookie = cname + '=' + cvalue + ';expires=' + d + ';path=/';
  }

  menue_tmp() {
    console.log('LOCAL TOPBAR');
    console.log(sessionStorage.getItem('DEV'));
    this.apiService.setupDOM(this.router);
    if (sessionStorage.getItem('DEV') == 'true') {
      var menue = document.getElementById('id_menu_wrapper');
      var menue2 = document.getElementById('id_menu_btn');
      //console.log(menue!.classList!.contains('open'));
      if (!menue2!.classList!.contains('open')) {
        menue2!.classList.add('open');
        menue!.style.display = 'block';
      } else {
        menue2!.classList.remove('open');
        menue!.style.display = 'none';
      }
    }
  }

  account_tmp() {
    //sessionStorage.clear();
    if (sessionStorage.getItem('Usertoken')) {
      sessionStorage.removeItem('Usertoken');
      sessionStorage.removeItem('User');
      sessionStorage.removeItem('aktuelle_miethistorie');
      sessionStorage.removeItem('vergangene_miethistorie');
      sessionStorage.clear();
      document.getElementById('id_c2a').style.display = 'none';
      this.apiService.loadMenue(this.router);
      document.getElementById('id_account_btn')!.classList.remove('loggedin');
      document.cookie =
        'angular=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    if (document.getElementById('eingeloggt1')) {
      document.getElementById('eingeloggt1')!.style.display = 'none';
      document.getElementById('eingeloggt2')!.style.display = 'none';

      document.getElementById('uneingeloggt1')!.style.display = 'block';
      document.getElementById('uneingeloggt2')!.style.display = 'block';
    }
    this.router.navigate(['/'], {});
  }

  lang_tmp() {
    if (sessionStorage.getItem('DEV') == 'true') {
      if (
        !(document.getElementById('id_languages') as HTMLElement).style
          .display ||
        (document.getElementById('id_languages') as HTMLElement).style
          .display == 'none'
      ) {
        (document.getElementById('id_languages') as HTMLElement).style.display =
          'block';
      } else {
        (document.getElementById('id_languages') as HTMLElement).style.display =
          'none';
      }
    }
  }

  langswitch(lang: string) {
    this.apiService.langswitch(lang);
  }

  saveMiethistorie(input: any) {
    console.log('saveMiethistorie');
    var aktuelle = input['aktuelle'];
    sessionStorage.setItem('aktuelle_miethistorie', JSON.stringify(aktuelle));

    var vergangen = input['vergangen'];
    sessionStorage.setItem(
      'vergangene_miethistorie',
      JSON.stringify(vergangen)
    );
  }

  onload() {
    this.apiService.externalLogoutCheck2();
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    if (index != 0) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
  }
}

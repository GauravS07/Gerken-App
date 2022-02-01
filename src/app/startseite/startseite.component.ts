import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-startseite',
  templateUrl: './startseite.component.html',
  styleUrls: ['./startseite.component.css'],
})
export class StartseiteComponent implements OnInit {
  mode = '';
  token = '';
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
    console.log('Construct Startseite');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams);
    console.log(queryString);
    if (urlParams.get('overdrive')) {
      console.log('overdrinve');
      var login = urlParams.get('login');
      var weiterleitung = urlParams.get('overdrive');
      this.overdrive(login, weiterleitung);
    }
    //var name = this.title + sessionStorage.getItem('language');
    //this.texte = JSON.parse(sessionStorage.getItem(name));
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    } else {
      this.apiService.startupChain2(1);
    }
    //console.log(this.apiService.getData('menue'));
    //var x = this;
    //this.apiService.getData('menue', this.reciever, x);
    this.route.params.subscribe((params) => {
      //console.log(params);
      if (params['mode']) {
        this.mode = params['mode'];
        console.log(this.mode);
      }
    });
    console.log('test3');
  }

  texte: Array<any> = Array<any>();
  title = 'Startseite';
  id = '0'; //wichtig für die Labels (index in den Sprachdateien)

  reciever(data: any, x: any) {
    console.log(data);
    //console.log(x);
    x!.loop(0);
  }

  loadmore(what: string) {
    console.log(what);
  }

  loop(state: number) {
    console.log('test?');
    console.log(state);
    console.log('Loop State: ' + state);
  }

  ngOnInit() {
    document
      .getElementById('login2')!
      .addEventListener('click', function (event) {
        event.preventDefault();
      });
    console.log('initalize Startseite');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('overdrive')) {
      console.log('overdrinve');
      var login = urlParams.get('login');
      var weiterleitung = urlParams.get('overdrive');
      this.overdrive(login, weiterleitung);
    }
    console.log(urlParams.get('mode'));
    const code = urlParams.get('weiterleitung');
    //console.log(code);
    var prio = true;
    //Registrierung
    if (urlParams.get('reg')) {
      const code2 = urlParams.get('reg');
      this.router.navigate(['/registrierung/' + code2], {});
    }
    if (urlParams.get('mode')) {
      var code3 = urlParams.get('mode');
      if (code3 == 'approve') {
        var filename = urlParams.get('name');
        var hash = urlParams.get('hash');
        this.apiService.doi(filename, hash).subscribe((data) => {
          if (data['error']) {
            document.getElementById('doi_output').innerHTML = data['error'];
          } else {
            document.getElementById('doi_output').innerHTML = data['success'];
          }
        });

        document.getElementById('eingeloggt1')!.style.display = 'none';
        document.getElementById('eingeloggt2')!.style.display = 'none';

        document.getElementById('uneingeloggt1')!.style.display = 'none';
        document.getElementById('uneingeloggt2')!.style.display = 'none';

        document.getElementById('reset1')!.style.display = 'none';
        document.getElementById('reset2')!.style.display = 'none';

        document.getElementById('approve1')!.style.display = 'block';
        document.getElementById('approve2')!.style.display = 'block';
      } else {
        if (code3 == 'reset') {
          console.log('eingeloggt');
          document.getElementById('eingeloggt1')!.style.display = 'none';
          document.getElementById('eingeloggt2')!.style.display = 'none';

          console.log('uneingeloggt');
          document.getElementById('uneingeloggt1')!.style.display = 'none';
          document.getElementById('uneingeloggt2')!.style.display = 'none';

          console.log('reset1');
          document.getElementById('reset1')!.style.display = 'none';
          document.getElementById('reset2')!.style.display = 'none';

          console.log('reset2');
          document.getElementById('reset3')!.style.display = 'block';
          document.getElementById('reset4')!.style.display = 'block';
        }
        if (code3 == 'doi2') {
          var ele = document.getElementById('doi2');

          var filename = urlParams.get('name');
          var hash = urlParams.get('hash');
          this.apiService.doi(filename, hash).subscribe((data) => {
            console.log(data);
            if (sessionStorage.getItem('Usertoken')) {
              /*
              console.log('eingeloggt');
              if (data['error']) {
                document.getElementById('doi2').innerHTML = data['error'];
              } else {
                document.getElementById('doi2').innerHTML = data['success'];
              }
              */
              sessionStorage.removeItem('Usertoken');
              this.token = '';
              sessionStorage.removeItem('User');
              console.log('eingeloggt');
              document.getElementById('eingeloggt1')!.style.display = 'none';
              document.getElementById('eingeloggt2')!.style.display = 'none';

              console.log('uneingeloggt');
              document.getElementById('uneingeloggt1')!.style.display = 'block';
              document.getElementById('uneingeloggt2')!.style.display = 'block';
              if (data['error']) {
                document.getElementById('doi1').innerHTML = data['error'];
              } else {
                document.getElementById('doi1').innerHTML = data['success'];
              }
              document
                .getElementById('id_account_btn')!
                .classList.remove('loggedin');
            } else {
              console.log('uneingeloggt');
              if (data['error']) {
                document.getElementById('doi1').innerHTML = data['error'];
              } else {
                document.getElementById('doi1').innerHTML = data['success'];
              }
            }
            //ele.style.display = 'block';
          });
        }
      }
      //this.router.navigate(['/registrierung/' + code2], {});
    }
    document
      .getElementById('login')!
      .addEventListener('click', function (event) {
        event.preventDefault();
      });
    document
      .getElementById('reset')!
      .addEventListener('click', function (event) {
        event.preventDefault();
      });
    document
      .getElementById('reset17')!
      .addEventListener('click', function (event) {
        event.preventDefault();
      });
    if (sessionStorage.getItem('Usertoken')) {
      this.token = sessionStorage.getItem('Usertoken');
      if (sessionStorage.getItem('Usertoken')!.length > 0 && prio) {
        document.getElementById('id_account_btn')!.classList.add('loggedin');
        if (document.getElementById('eingeloggt1')) {
          document.getElementById('eingeloggt1')!.style.display = 'block';
          document.getElementById('eingeloggt2')!.style.display = 'block';

          document.getElementById('uneingeloggt1')!.style.display = 'none';
          document.getElementById('uneingeloggt2')!.style.display = 'none';
          document.getElementById('reset1')!.style.display = 'none';
          document.getElementById('reset2')!.style.display = 'none';
          //document.getElementById('doi1')!.style.display = 'none';
          //document.getElementById('doi2')!.style.display = 'none';
        }
      }
    }
  }

  doi2() {}

  password_reset_open() {
    document.getElementById('eingeloggt1')!.style.display = 'none';
    document.getElementById('eingeloggt2')!.style.display = 'none';

    document.getElementById('uneingeloggt1')!.style.display = 'none';
    document.getElementById('uneingeloggt2')!.style.display = 'none';

    document.getElementById('reset1').style.display = 'block';
    document.getElementById('reset2').style.display = 'block';
  }

  password_reset_close() {
    document.getElementById('eingeloggt1')!.style.display = 'none';
    document.getElementById('eingeloggt2')!.style.display = 'none';

    document.getElementById('uneingeloggt1')!.style.display = 'block';
    document.getElementById('uneingeloggt2')!.style.display = 'block';

    document.getElementById('reset1')!.style.display = 'none';
    document.getElementById('reset2')!.style.display = 'none';

    document.getElementById('reset3')!.style.display = 'none';
    document.getElementById('reset4')!.style.display = 'none';
  }

  reset() {
    console.log('Passwort zurücksetzen');
    var username = (
      document.getElementById('reset_username') as HTMLInputElement
    ).value;
    var vorname = (document.getElementById('reset_vorname') as HTMLInputElement)
      .value;
    var nachname = (
      document.getElementById('reset_nachname') as HTMLInputElement
    ).value;
    var liste = [
      ['username', username],
      ['vorname', vorname],
      ['nachname', nachname],
    ];
    var post = this.apiService.generateInput(liste);
    console.log(post);
    document.getElementById('resetform').style.display = 'none';
    //document.getElementById('reset').remove();
    this.apiService.postEndpunkt(post, 'reset').subscribe((data) => {
      if (data['success']) {
        document.getElementById('resetform').innerHTML =
          '<p>Ihnen wurde ein Link zum ändern ihres Passworts zugeschickt.</p>';
        setTimeout(function () {
          //console.log("Callback Funktion wird aufgerufen");
          document.getElementById('eingeloggt1')!.style.display = 'none';
          document.getElementById('eingeloggt2')!.style.display = 'none';

          document.getElementById('uneingeloggt1')!.style.display = 'block';
          document.getElementById('uneingeloggt2')!.style.display = 'block';

          document.getElementById('reset1')!.style.display = 'none';
          document.getElementById('reset2')!.style.display = 'none';

          document.getElementById('reset3')!.style.display = 'none';
          document.getElementById('reset4')!.style.display = 'none';
        }, 2000);
      } else {
        document.getElementById('resetform').innerHTML =
          document.getElementById('resetform').innerHTML +
          '<p>' +
          data['error'] +
          '</p>';
      }
      document.getElementById('resetform').style.display = 'block';
    });
  }

  reset2() {
    console.log('Passwort speichern');
    var password1 = (document.getElementById('password2') as HTMLInputElement)
      .value;
    var password2 = (document.getElementById('password3') as HTMLInputElement)
      .value;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams.get('name'));
    const filename = urlParams.get('name');

    console.log(urlParams.get('hash'));
    const hash = urlParams.get('hash');

    if (password1 == password2) {
      var liste = [
        ['password', password1],
        ['filename', filename],
        ['hash', hash],
      ];
      var post = this.apiService.generateInput(liste);
      console.log(post);
      document.getElementById('approveform').style.display = 'none';
      //document.getElementById('reset').remove();
      this.apiService.postEndpunkt(post, 'reset2').subscribe((data) => {
        console.log(data);
        if (data['success']) {
          document.getElementById('resultreset').innerHTML =
            '<p>Das Password wurde erfolgreich geändert.</p>';
        } else {
          document.getElementById('resultreset').innerHTML =
            '<p>' + data['error'] + '</p>';
        }
        document.getElementById('approveform').style.display = 'block';
      });
    } else {
      document.getElementById('approveform').innerHTML =
        document.getElementById('approveform').innerHTML +
        '<p>Die Passwörter müssen übereinstimmen</p>';
    }
  }
  check() {
    scroll(0, 0);
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    //ON LOAD CHECK
    this.apiService.externalLogoutCheck2();
    if (sessionStorage.getItem('Usertoken')) {
      this.token = sessionStorage.getItem('Usertoken');
      //eingeloggt
      if (sessionStorage.getItem('aktuelle_miethistorie')) {
        this.loadMiethistorie();
        console.log('test');
      }
    }
    console.log('test2');
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      console.log('test2b2');
      this.apiService.loadMenue(this.router);
      console.log('test2b');
    }
  }

  login() {
    var username = (document.getElementById('username') as HTMLInputElement)
      .value;
    var password = (document.getElementById('password') as HTMLInputElement)
      .value;
    console.log(username + ':' + password);
    var lg_data = new credentials();
    lg_data.username = username;
    lg_data.password = password;
    this.apiService.login(lg_data).subscribe((data) => {
      console.log(data);
      console.log('test?');
      if (data['usertoken']) {
        this.setCookie('angular', data['usertoken'], 1);
        sessionStorage.setItem('Usertoken', data['usertoken']);
        this.token = sessionStorage.getItem('Usertoken');
        sessionStorage.setItem('Stateindex', data['order']['index']);
        var index = parseInt(data['order']['index']);
        console.log('Index: ' + index);
        var zeit: Array<any> = [
          '',
          'Uhrzeit',
          '',
          'Uhrzeit',
          false,
          0,
          false,
          0,
        ];
        var standort: Array<any>;
        if (index != 0 && index) {
          var data2 = data['order']['data'];
          console.log(data2);
          var slug = '';
          document.getElementById('id_c2a').style.display = 'block';
          for (let i = 0; i < data2.length; i++) {
            slug = data2[i]['produkt']['slug'];
            var e = data2[i];
            console.log(e);
            if (data2[i]['zeit']) {
              var a = new Date(data2[i]['zeit']['startdatum']).getTime();
              var b = new Date(data2[i]['zeit']['enddatum']).getTime();

              if (a > b) {
                var c = a;
                a = b;
                b = c;
              }
              var d = (b - a) / (1000 * 24 * 60 * 60);
              var weekends = false;
              var weekends_counter = 0;
              for (let i = 0; i < d + 1; i++) {
                var daynum =
                  (new Date(a + i * 1000 * 24 * 60 * 60).getDay() + 6) % 7;
                console.log(daynum);
                var datu = new Date(a + i * 1000 * 24 * 60 * 60);
                console.log(datu);
                if (daynum == 5 || daynum == 6) {
                  weekends = true;
                  weekends_counter++;
                }
              }
              var weekends2 = data2[i]['zeit']['wochenende'];
              var d2 = d;
              if (!weekends2) {
                d2 = d2 - weekends_counter;
              }
              console.log('Mietdauer (raw): ' + d);
              console.log('Wochenendtage: ' + weekends_counter);
              console.log('Mietdauer in Tagen: ' + d2);
              if (d2 < 1) {
                d2 = 1;
              }
              console.log('INDEX ' + i);
              console.log(data2[i]['zeit']);
              zeit = [
                data2[i]['zeit']['startdatum'],
                data2[i]['zeit']['startzeit'],
                data2[i]['zeit']['enddatum'],
                data2[i]['zeit']['endzeit'],
                data2[i]['zeit']['openend'],
                data2[i]['zeit']['wochenendtage'],
                data2[i]['zeit']['wochenende'],
                d2,
              ];
            }
            if (data2[i]['standort']) {
              console.log('INDEX ' + i);
              console.log(data2[i]['standort']);
              var betaput = this.apiService.generateInput([
                ['id', data2[i]['standort']['id']],
                ['name', data2[i]['standort']['name']],
                ['zusatz', data2[i]['standort']['zusatz']],
                ['strasse', data2[i]['standort']['strasse']],
                ['plz', data2[i]['standort']['plz']],
                ['ort', data2[i]['standort']['ort']],
                ['land', data2[i]['standort']['land']],
                ['aktive', data2[i]['standort']['aktive']],
              ]);
              var beta2 = JSON.parse(betaput);
              standort = [
                beta2,
                data2[i]['standort']['lieferungabholung'],
                data2[i]['standort']['bedienung'],
              ];
            }
          }
          console.log('State Zeit:');
          console.log(zeit);
          console.log('State Standort:');
          console.log(standort);
          sessionStorage.setItem('ZEIT', JSON.stringify(zeit));
          sessionStorage.setItem('STANDORT', JSON.stringify(standort));
          sessionStorage.setItem('last', slug);
        } else {
          document.getElementById('id_c2a').style.display = 'none';
        }
        console.log('LAST: ' + sessionStorage.getItem('last'));
        this.apiService.loadMenue(this.router);
        this.saveMiethistorie(data['miethistorie']);
        this.loadMiethistorie();
        sessionStorage.setItem('Email', username);
        //this.router.navigate(['/eingeloggt'], {});
        scrollTo(0, 0);
        document.getElementById('id_account_btn')!.classList.add('loggedin');
        document.getElementById('eingeloggt1')!.style.display = 'block';
        document.getElementById('eingeloggt2')!.style.display = 'block';

        document.getElementById('uneingeloggt1')!.style.display = 'none';
        document.getElementById('uneingeloggt2')!.style.display = 'none';

        document.getElementById('reset1')!.style.display = 'none';
        document.getElementById('reset2')!.style.display = 'none';

        document.getElementById('approve1')!.style.display = 'none';
        document.getElementById('approve2')!.style.display = 'none';
      } else {
        //Fail output
        var ele = document.getElementById('loginform');
        var feld1 = document.getElementById('username');
        var feld2 = document.getElementById('password');
        var errortext = document.createElement('p');
        errortext.setAttribute('color', 'red');
        if (data['fail1']) {
          //Passwort falsch
          feld2.setAttribute('style', 'border:1px solid red');
          errortext.innerHTML = data['fail1'];
        }
        if (data['fail2']) {
          //Nutzer existiert nicht
          feld1.setAttribute('style', 'border:1px solid red!important');
          feld2.setAttribute('style', 'border:1px solid red!important');
          errortext.innerHTML = data['fail2'];
        }
        if (data['fail3']) {
          //Nutzer existiert nicht
          feld1.setAttribute('style', 'border:1px solid red!important');
          feld2.setAttribute('style', 'border:1px solid red!important');
          errortext.innerHTML = data['fail3'];
        }
        ele.appendChild(errortext);
      }
      console.log(data);
    });
  }

  login2() {
    var username = (document.getElementById('username17') as HTMLInputElement)
      .value;
    var password = (document.getElementById('password17') as HTMLInputElement)
      .value;
    console.log(username + ':' + password);
    var lg_data = new credentials();
    lg_data.username = username;
    lg_data.password = password;
    this.apiService.login(lg_data).subscribe((data) => {
      console.log(data);
      if (data['usertoken']) {
        this.setCookie('angular', data['usertoken'], 1);
        sessionStorage.setItem('Usertoken', data['usertoken']);
        this.token = sessionStorage.getItem('Usertoken');
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
            var e = data2[i];
            console.log(e);
          }
          sessionStorage.setItem('last', slug);
        } else {
          document.getElementById('id_c2a').style.display = 'none';
        }
        console.log('LAST: ' + sessionStorage.getItem('last'));
        this.saveMiethistorie(data['miethistorie']);
        this.loadMiethistorie();
        this.apiService.loadMenue(this.router);
        sessionStorage.setItem('Email', username);
        //this.router.navigate(['/eingeloggt'], {});
        scrollTo(0, 0);
        document.getElementById('id_account_btn')!.classList.add('loggedin');
        document.getElementById('eingeloggt1')!.style.display = 'block';
        document.getElementById('eingeloggt2')!.style.display = 'block';

        document.getElementById('uneingeloggt1')!.style.display = 'none';
        document.getElementById('uneingeloggt2')!.style.display = 'none';

        document.getElementById('reset1')!.style.display = 'none';
        document.getElementById('reset2')!.style.display = 'none';

        document.getElementById('approve1')!.style.display = 'none';
        document.getElementById('approve2')!.style.display = 'none';
      } else {
        //Fail output
        var ele = document.getElementById('loginform');
        var feld1 = document.getElementById('username');
        var feld2 = document.getElementById('password');
        var errortext = document.createElement('p');
        errortext.setAttribute('color', 'red');
        if (data['fail1']) {
          //Passwort falsch
          feld2.setAttribute('style', 'border:1px solid red');
          errortext.innerHTML = data['fail1'];
        }
        if (data['fail2']) {
          //Nutzer existiert nicht
          feld1.setAttribute('style', 'border:1px solid red!important');
          feld2.setAttribute('style', 'border:1px solid red!important');
          errortext.innerHTML = data['fail2'];
        }
        if (data['fail3']) {
          //Nutzer existiert nicht
          feld1.setAttribute('style', 'border:1px solid red!important');
          feld2.setAttribute('style', 'border:1px solid red!important');
          errortext.innerHTML = data['fail3'];
        }
        ele.appendChild(errortext);
      }
      console.log(data);
    });
  }

  setCookie(cname: string, cvalue: string, exdays: number) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 2 * 60 * 60 * 1000);
    var expires = -1;
    document.cookie = cname + '=' + cvalue + ';expires=' + d + ';path=/';
  }

  saveMiethistorie(input: any) {
    console.log('saveMiethistorie');
    sessionStorage.setItem('raw_miethistorie', JSON.stringify(input));
    var aktuelle = input['aktuelle'];
    sessionStorage.setItem('aktuelle_miethistorie', JSON.stringify(aktuelle));

    var vergangen = input['vergangen'];
    sessionStorage.setItem(
      'vergangene_miethistorie',
      JSON.stringify(vergangen)
    );
  }

  loadMiethistorie() {
    console.log('loadMiethistorie');
    //reconstruct from strings <-ApiServie because useful
    var Miethistorie = this.apiService.reconstructMiethistorie();
    //changeHTML
    var aktuell = document.getElementById('miethistorie_aktuell');
    var aktuellb = JSON.parse(sessionStorage.getItem('aktuelle_miethistorie'));
    aktuell.innerHTML = '';
    var paket = Array<any>();
    if (Miethistorie.aktuell.length > 0) {
      document.getElementById('miethistorie_aktuell2').style.display = 'block';
      document.getElementById('miethistorie_aktuell3').style.display = 'block';
      paket.push(this.router);
      paket.push(Miethistorie.aktuell[0]);
      paket.push(aktuellb[0]);
      paket.push(this);
      var produkt1 = this.apiService.constructHTML('Miethistorie', paket);
      console.log('i6: ' + 1);
      aktuell.appendChild(produkt1);
    } else {
      document.getElementById('miethistorie_aktuell2').style.display = 'none';
      document.getElementById('miethistorie_aktuell3').style.display = 'none';
    }
    if (Miethistorie.aktuell.length > 1) {
      var paket = Array<any>();
      paket.push(this.router);
      paket.push(Miethistorie.aktuell[1]);
      paket.push(aktuellb[1]);
      paket.push(this);
      var produkt2 = this.apiService.constructHTML('Miethistorie', paket);
      console.log('i6: ' + 2);
      aktuell.appendChild(produkt2);
    } else {
      document.getElementById('aktuell').style.display = 'none';
    }
    var vergangen = document.getElementById('miethistorie_vergangen');
    var vergangenb = JSON.parse(
      sessionStorage.getItem('vergangene_miethistorie')
    );
    vergangen.innerHTML = '';
    if (Miethistorie.vergangen.length > 0) {
      document.getElementById('miethistorie_vergangen2').style.display =
        'block';
      var paket = Array<any>();
      paket.push(this.router);
      paket.push(Miethistorie.vergangen[0]);
      paket.push(vergangenb[0]);
      paket.push(this);
      var produkt3 = this.apiService.constructHTML('Miethistorie', paket);
      console.log('i5: ' + 1);
      vergangen.appendChild(produkt3);
    } else {
      document.getElementById('miethistorie_vergangen2').style.display = 'none';
    }
    if (Miethistorie.vergangen.length > 1) {
      var paket = Array<any>();
      paket.push(this.router);
      paket.push(Miethistorie.vergangen[1]);
      paket.push(vergangenb[1]);
      paket.push(this);
      var produkt4 = this.apiService.constructHTML('Miethistorie', paket);
      console.log('i5: ' + 2);
      vergangen.appendChild(produkt4);
    } else {
      document.getElementById('vergangen').style.display = 'none';
    }
  }

  loadAllMiethistorie2(mode: string) {
    console.log('hideAllMiethistorie');
    var Miethistorie = this.apiService.reconstructMiethistorie();
    if (mode == 'vergangen') {
      console.log('vergangen');
      var vergangen = document.getElementById('miethistorie_vergangen');
      var vergangenb = JSON.parse(
        sessionStorage.getItem('vergangene_miethistorie')
      );
      vergangen.innerHTML = '';
      for (let i = 0; i < 2; i++) {
        var paket = Array<any>();
        paket.push(this.router);
        paket.push(Miethistorie.vergangen[i]);
        paket.push(vergangenb[i]);
        paket.push(this);
        var produkt = this.apiService.constructHTML('Miethistorie', paket);
        console.log('i4: ' + i);
        vergangen.appendChild(produkt);
      }
      document.getElementById('vergangen').style.display = 'block';
      document.getElementById('vergangen_weniger').style.display = 'none';
    }
    if (mode == 'aktuell') {
      console.log('aktuell');
      var aktuell = document.getElementById('miethistorie_aktuell');
      var aktuellb = JSON.parse(
        sessionStorage.getItem('aktuelle_miethistorie')
      );
      aktuell.innerHTML = '';
      for (let i = 0; i < 2; i++) {
        var paket = Array<any>();
        paket.push(this.router);
        paket.push(Miethistorie.aktuell[i]);
        paket.push(aktuellb[i]);
        paket.push(this);
        var produkt = this.apiService.constructHTML('Miethistorie', paket);
        console.log('i3: ' + i);
        aktuell.appendChild(produkt);
      }
      document.getElementById('aktuell').style.display = 'block';
      document.getElementById('aktuell_weniger').style.display = 'none';
    }
    scroll(0, 0);
  }

  loadAllMiethistorie(mode: string) {
    console.log('loadAllMiethistorie');
    var Miethistorie = this.apiService.reconstructMiethistorie();
    if (mode == 'vergangen') {
      console.log('vergangen');
      if (Miethistorie.vergangen.length > 2) {
        var vergangen = document.getElementById('miethistorie_vergangen');
        var vergangenb = JSON.parse(
          sessionStorage.getItem('aktuelle_miethistorie')
        );
        for (let i = 2; i < Miethistorie.vergangen.length; i++) {
          var paket = Array<any>();
          paket.push(this.router);
          paket.push(Miethistorie.vergangen[i]);
          paket.push(vergangenb[i]);
          paket.push(this);
          var produkt = this.apiService.constructHTML('Miethistorie', paket);
          console.log('i2: ' + i);
          vergangen.appendChild(produkt);
        }
      }
      document.getElementById('vergangen').style.display = 'none';
      document.getElementById('vergangen_weniger').style.display = 'block';
    }
    if (mode == 'aktuell') {
      console.log('aktuell');
      if (Miethistorie.aktuell.length > 2) {
        var aktuell = document.getElementById('miethistorie_aktuell');
        var aktuellb = JSON.parse(
          sessionStorage.getItem('aktuelle_miethistorie')
        );
        for (let i = 2; i < Miethistorie.aktuell.length; i++) {
          var paket = Array<any>();
          paket.push(this.router);
          paket.push(Miethistorie.aktuell[i]);
          paket.push(aktuellb[i]);
          paket.push(this);
          var produkt = this.apiService.constructHTML('Miethistorie', paket);
          console.log('i1: ' + i);
          aktuell.appendChild(produkt);
        }
      }
      document.getElementById('aktuell').style.display = 'none';
      document.getElementById('aktuell_weniger').style.display = 'block';
    }
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
        this.token = sessionStorage.getItem('Usertoken');
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
            var e = data2[i];
            console.log(e);
          }
          sessionStorage.setItem('last', slug);
        } else {
          document.getElementById('id_c2a').style.display = 'none';
        }
        console.log('LAST: ' + sessionStorage.getItem('last'));
        console.log(data);
        this.apiService.loadMenue(this.router);
        this.saveMiethistorie(data['miethistorie']);
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

  timeAdjust_start(slug: string) {
    var token = sessionStorage.getItem('Usertoken');
    this.token = sessionStorage.getItem('Usertoken');
    var email = sessionStorage.getItem('Email');

    var miethistorie = JSON.parse(
      sessionStorage.getItem('aktuelle_miethistorie')
    );
    console.log(miethistorie);
  }

  timeAdjust_miethistorie() {
    var enddatum = document.getElementById(
      'ende_miethistorie'
    ) as HTMLInputElement;
    var endzeit = document.getElementById(
      'ende-zeit_miethistorie'
    ) as HTMLInputElement;
    var endeoffen = document.getElementById(
      'the_end_miethistorie'
    ) as HTMLInputElement;

    var frame_zeitdate = document.getElementById('mietende1_miethistorie');
    var frame_offen = document.getElementById('mietende1_miethistorie');
  }
}

export class credentials {
  username: string;
  password: string;
  constructor() {
    this.username = '';
    this.password = '';
  }
}

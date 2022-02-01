import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  mode = 'privat';
  user: User;
  constructor(private apiService: ApiService, private router: Router) {
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    } else {
      this.apiService.startupChain2(1);
    }
    if (
      sessionStorage.getItem('Usertoken') &&
      !sessionStorage.getItem('User')
    ) {
      console.log('Usertoken:' + sessionStorage.getItem('Usertoken'));
      var names = ['token', 'email'];
      var data = [
        sessionStorage.getItem('Usertoken'),
        sessionStorage.getItem('Email'),
      ];
      var end = 'user';
      var sending = [
        ['token', sessionStorage.getItem('Usertoken')],
        ['email', sessionStorage.getItem('Email')],
      ];
      var input = this.apiService.generateInput(sending);
      this.apiService.postEndpunkt(input, 'user').subscribe((data) => {
        console.log(data);
        if (data['user']['accountstatus']) {
          console.log('USER 1');
          this.user = new User(data['user']);
          this.setupUser();
          if (data['user']['art'] == 'Geschäftskunde') {
            this.mode = 'geschaeft';
          }
          if (sessionStorage.getItem('Usertoken')) {
            console.log(document.getElementById('id_account_btn'));
            document
              .getElementById('id_account_btn')!
              .classList.add('loggedin');
          } else {
            console.log('NO USERTOKEN');
          }
          sessionStorage.setItem('User', JSON.stringify(data['user']));
        }
      });
    }
  }
  reconf(id1: string, id2: string, id3: string) {
    this.apiService.reconf(id1, id2, id3);
  }

  ngOnInit() {
    console.log('Account start');
    /*
    var check = document.getElementById('testmarker').innerHTML;
    if (check == 'TEST') {
      console.log('TESTMARKER 1');
      //this.apiService.loadMenue(this.router);
    }
    */
    var mode = this.mode;

    if (sessionStorage.getItem('User')) {
      var userdata_raw = sessionStorage.getItem('User');
      console.log(userdata_raw);
      var user = JSON.parse(userdata_raw);
      console.log(user);
      if (user['business']) {
        this.mode = 'geschaeft';
      }
      console.log('construct User');
      console.log('USER 2');
      this.user = new User(user);
      this.setupUser();
      console.log(this.user);
    } else {
      console.log('übersprungen');
    }
  }

  updateForm(input: string): void {
    console.log('YES');
    sessionStorage.setItem('User', input);
  }

  refresh() {
    if (
      sessionStorage.getItem('Usertoken') &&
      sessionStorage.getItem('Email')
    ) {
      var sending = [
        ['token', sessionStorage.getItem('Usertoken')],
        ['email', sessionStorage.getItem('Email')],
      ];
      var input = this.apiService.generateInput(sending);
      this.apiService.postEndpunkt(input, 'user').subscribe((data) => {
        console.log(data);
        if (data['user']['accountstatus']) {
          console.log('USER 3');
          this.user = new User(data['user']);
          this.setupUser();
          if (data['user']['art'] == 'Geschäftskunde') {
            this.mode = 'geschaeft';
          }
          if (sessionStorage.getItem('Usertoken')) {
            console.log(document.getElementById('id_account_btn'));
            document
              .getElementById('id_account_btn')!
              .classList.add('loggedin');
          } else {
            console.log('NO USERTOKEN');
          }
          sessionStorage.setItem('User', JSON.stringify(data['user']));
        }
      });
    }
  }

  setupUser() {
    this.apiService.externalLogoutCheck2();
    if (document.getElementById('send')) {
      document
        .getElementById('send')!
        .addEventListener('click', function (event) {
          console.log('TOASTBROT');
          //sending(this.apiService);
          event.preventDefault();
        });
    }
    console.log('USER SETUP');
    console.log(this.user);
    if (!this.user) {
      this.refresh();
    }
    if (sessionStorage.getItem('Usertoken')) {
      //console.log(document.getElementById('id_account_btn'));
      document.getElementById('id_account_btn')!.classList.add('loggedin');
    } else {
      console.log('NO USERTOKEN');
    }
    if (document.getElementById('testmarker')) {
      if (document.getElementById('testmarker').innerHTML == 'TEST') {
        this.apiService.loadMenue(this.router);
      }
    }
    if (this.user && document.getElementById('anrede')) {
      if (this.user.anrede == 'Frau') {
        document.getElementById('anrede').innerHTML =
          '<div class="radio-wrapper"><label>Herr<input type="radio" name="radio" value="Herr" required="required" id="anrede1"/><span class="checkmark checkmark-radio"></span></label>     </div>        <div class="radio-wrapper">          <label            >Frau            <input type="radio" name="radio" value="Frau" checked/>            <span class="checkmark checkmark-radio"></span>          </label>        </div>        <div style="clear:both;"><div></div></div>';
      } else {
        document.getElementById('anrede').innerHTML =
          '<div class="radio-wrapper"><label>Herr<input type="radio" name="radio" value="Herr" required="required" checked  id="anrede1"/><span class="checkmark checkmark-radio"></span></label>     </div>        <div class="radio-wrapper">          <label            >Frau            <input type="radio" name="radio" value="Frau" />            <span class="checkmark checkmark-radio"></span>          </label>        </div>        <div style="clear:both;"><div></div></div>';
      }
      console.log(document.getElementById('anrede').innerHTML);
      var land = document.getElementById('land') as HTMLSelectElement;
      land.value = this.user.land;

      if (this.user.art == 'Privatkunde') {
        console.log('Privatkunde');
        var alter = document.getElementById('alter') as HTMLSelectElement;
        alter.value = this.user.privat.alter;
        var fuehrerschein = document.getElementById(
          'fuehrerschein'
        ) as HTMLSelectElement;
        fuehrerschein.value = this.user.privat.fuehrerschein;
        //console.log(land);
      } else {
        console.log('Geschäftskunde');
      }
    }
  }

  sending() {
    console.log('Send');
    sending(this.apiService);
  }

  loadRechnungsadressen() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    var email = sessionStorage.getItem('Email');
    var token = sessionStorage.getItem('Usertoken');
    var input = this.apiService.generateInput([
      ['email', email],
      ['token', token],
    ]);
    if (sessionStorage.getItem('Rechnungsadressen')) {
      var data = sessionStorage.getItem('Rechnungsadressen');
      this.constructRechnungsadressen(JSON.parse(data)['rechnungsadressen']);
    } else {
      this.apiService
        .postEndpunkt(input, 'rechnungsadressen1')
        .subscribe((data) => {
          console.log(data);
          sessionStorage.setItem('Rechnungsadressen', JSON.stringify(data));
          this.constructRechnungsadressen(data['rechnungsadressen']);
        });
    }
  }

  closeRechnungsadresse() {
    $.fancybox.close();
  }

  saveRechnungsadresse() {
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
      ['aktive', aktive],
    ]);

    this.apiService
      .postEndpunkt(input, 'rechnungsadressen2')
      .subscribe((data) => {
        console.log(data);
        if (data['result_check']) {
          (document.getElementById('new_name') as HTMLInputElement).value = '';
          (document.getElementById('new_zusatz') as HTMLInputElement).value =
            '';
          (document.getElementById('new_strasse') as HTMLInputElement).value =
            '';
          (document.getElementById('new_plz') as HTMLInputElement).value = '';
          (document.getElementById('new_ort') as HTMLInputElement).value = '';

          this.apiService
            .postEndpunkt(input, 'rechnungsadressen1')
            .subscribe((data2) => {
              console.log(data2);
              sessionStorage.setItem(
                'Rechnungsadressen',
                JSON.stringify(data2['rechnungsadressen'])
              );
              console.log('reconstruct');
              this.constructRechnungsadressen(data2['rechnungsadressen']);
            });
        }
      });
    $.fancybox.close();
  }
  newRechnungsadresse() {
    (document.getElementById('new_name') as HTMLInputElement).value = '';
    (document.getElementById('new_strasse') as HTMLInputElement).value = '';
    (document.getElementById('new_plz') as HTMLInputElement).value = '';
    (document.getElementById('new_ort') as HTMLInputElement).value = '';
    (document.getElementById('new_zusatz') as HTMLInputElement).value = '';
    (document.getElementById('new_land') as HTMLSelectElement).value =
      'Deutschland';
    (document.getElementById('new_id') as HTMLInputElement).value = '';
    document.getElementById('new_title').innerHTML = 'Rechnungsadresse anlegen';
    $.fancybox.open({
      touch: false,
      src: '#id_modal_adress',
      type: 'inline',
      opts: {},
    });
  }

  constructRechnungsadressen(data: any) {
    var count = data['count'];
    var border = document.getElementById('rechnungsadressen');
    border.innerHTML = '';
    console.log('construction');
    //console.log(data);
    for (let i = 0; i < count; i++) {
      var ele = this.apiService.constructHTML('Rechnungsadressen', [
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
        document.getElementById('new_title').innerHTML =
          'Rechnungsadresse bearbeiten';
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

  deleteRechnungsadresse() {
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
    this.apiService
      .postEndpunkt(input, 'rechnungsadressen3')
      .subscribe((data) => {
        console.log(data);
        sessionStorage.setItem(
          'Rechnungsadressen',
          JSON.stringify(data['erfolg'])
        );
        this.constructRechnungsadressen(data['erfolg']);
      });
    $.fancybox.close();
  }
}

function sending(x: ApiService) {
  scrollTo(0, 0);
  var userdata_raw = sessionStorage.getItem('User');
  //console.log(userdata_raw);
  var user = JSON.parse(userdata_raw);
  console.log(user);
  console.log('USER 4');
  var user2 = new User(user);
  var sendinguser = user2;

  var password1 = (document.getElementById('password1') as HTMLInputElement)
    .value;
  var password2 = (document.getElementById('password2') as HTMLInputElement)
    .value;
  //console.log((document.getElementById('anrede') as HTMLInputElement).value);
  if ((document.getElementById('anrede1') as HTMLInputElement).checked) {
    sendinguser.anrede = 'Herr';
  } else {
    sendinguser.anrede = 'Frau';
  }
  sendinguser.vorname = (
    document.getElementById('vorname') as HTMLInputElement
  ).value;
  sendinguser.nachname = (
    document.getElementById('nachname') as HTMLInputElement
  ).value;
  sendinguser.email = (
    document.getElementById('email') as HTMLInputElement
  ).value;
  sendinguser.strasse = (
    document.getElementById('strasse') as HTMLInputElement
  ).value;
  sendinguser.zusatz = (
    document.getElementById('zusatz') as HTMLInputElement
  ).value;
  sendinguser.plz = (document.getElementById('plz') as HTMLInputElement).value;
  sendinguser.ort = (document.getElementById('ort') as HTMLInputElement).value;
  sendinguser.land = (
    document.getElementById('land') as HTMLSelectElement
  ).value;

  if (sendinguser.art == 'Privatkunde') {
    sendinguser.privat.alter = (
      document.getElementById('alter') as HTMLSelectElement
    ).value;
    sendinguser.privat.fuehrerschein = (
      document.getElementById('fuehrerschein') as HTMLSelectElement
    ).value;
    sendinguser.privat.tel = (
      document.getElementById('tel') as HTMLSelectElement
    ).value;
  } else {
    sendinguser.business.company = (
      document.getElementById('company') as HTMLSelectElement
    ).value;
    sendinguser.business.fax = (
      document.getElementById('fax') as HTMLInputElement
    ).value;
    sendinguser.business.kundennummer = (
      document.getElementById('kundennummer') as HTMLInputElement
    ).value;
    sendinguser.business.position = (
      document.getElementById('position') as HTMLInputElement
    ).value;
    sendinguser.business.tel = (
      document.getElementById('tel') as HTMLInputElement
    ).value;
    sendinguser.business.website = (
      document.getElementById('website') as HTMLInputElement
    ).value;
  }

  if (password1 == password2 && password1 != '') {
    sendinguser.password = password1;
  }
  if (password1 == password2) {
    var sendstring = JSON.stringify(sendinguser);
    //Existiert nicht auf einer globalen Funktion
    x.updateUser(
      sendstring,
      sessionStorage.getItem('Email'),
      sessionStorage.getItem('Usertoken')
    ).subscribe((data) => {
      console.log(data);
      document.getElementById('msgtothemax').innerHTML = data['message'];
      if (data['response'] == 'success') {
        if (sendinguser.email != sessionStorage.getItem('Email')) {
          document.getElementById('msgtothemax').innerHTML =
            'Es wurde ein Link zur Bestätigung der neuen E-Mail Adresse an Sie gesendet.<br><br>';
          document.getElementById('msgtothemax').innerHTML += data['message'];
        }
        sessionStorage.setItem('User', sendstring);
        sessionStorage.setItem('Email', sendinguser.email);
      }
    });
  } else {
    document.getElementById('msgtothemax').innerHTML =
      'Die eingegebenen Passwörter stimmen nicht überein.';
  }
  console.log(sendinguser);
}

export class User {
  accountstatus: string;
  agb: string;
  anrede: string;
  art: string;
  bonitaet: string;
  datenschutz: string;
  email: string;
  land: string;
  marketing: string;
  nachname: string;
  ort: string;
  password: string;
  strasse: string;
  usertoken: string;
  vorname: string;
  zusatz: string;
  plz: string;
  privat: privat;
  business: business;

  constructor(input: Array<any>) {
    console.log('Whut?');
    this.accountstatus = input['accountstatus'];
    this.agb = input['agb'];
    this.anrede = input['anrede'];
    this.art = input['art'];
    this.bonitaet = input['bonitaet'];
    this.datenschutz = input['datenschutz'];
    this.email = input['email'];
    this.land = input['land'];
    this.marketing = input['marketing'];
    this.nachname = input['nachname'];
    this.ort = input['ort'];
    this.strasse = input['strasse'];
    this.usertoken = input['usertoken'];
    this.vorname = input['vorname'];
    this.zusatz = input['zusatz'];
    this.plz = input['plz'];
    if (input['art'] == 'Privatkunde') {
      this.privat = new privat(
        input['privat']['alter'],
        input['privat']['fuehrerschein'],
        input['privat']['tel']
      );
    } else {
      this.business = new business(
        input['business']['alter'],
        input['business']['anzahl'],
        input['business']['briefbogen'],
        input['business']['company'],
        input['business']['companysize'],
        input['business']['durchschnitt'],
        input['business']['fax'],
        input['business']['kundennummer'],
        input['business']['position'],
        input['business']['tel'],
        input['business']['website']
      );
    }
  }
}

export class business {
  alter: string;
  anzahl: string;
  briefbogen: string;
  company: string;
  companysize: string;
  durchschnitt: string;
  fax: string;
  kundennummer: string;
  position: string;
  tel: string;
  website: string;

  constructor(
    alter: string,
    anzahl: string,
    briefbogen: string,
    company: string,
    companysize: string,
    durchschnitt: string,
    fax: string,
    kundennummer: string,
    position: string,
    tel: string,
    website: string
  ) {
    this.alter = alter;
    this.anzahl = anzahl;
    this.briefbogen = briefbogen;
    this.company = company;
    this.companysize = companysize;
    this.durchschnitt = durchschnitt;
    this.fax = fax;
    this.kundennummer = kundennummer;
    this.position = position;
    this.tel = tel;
    this.website = website;
  }
}

export class privat {
  alter: string;
  fuehrerschein: string;
  tel: string;

  constructor(alter: string, fuehrerschein: string, tel: string) {
    this.alter = alter;
    this.fuehrerschein = fuehrerschein;
    this.tel = tel;
  }
}

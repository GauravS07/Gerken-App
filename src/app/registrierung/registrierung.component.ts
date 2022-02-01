import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InputFields } from '../inputfields';
import { FormvalidationService } from '../formvalidation.service';
declare var $: any;

@Component({
  selector: 'app-registrierung',
  templateUrl: './registrierung.component.html',
  styleUrls: ['./registrierung.component.css'],
})
export class RegistrierungComponent implements OnInit {
  link = 'https://diesdas.codersunlimited.de/diesdas/api/overview2.php';
  result: string = 'normal';
  formfields = [
    new InputFields('anrede1', '', true, 'all', 0, 'anrede', 'checked', false),
    new InputFields('anrede2', '', true, 'all', 0, 'anrede', 'checked', false),
    new InputFields('vorname', '', true, 'all', 1, 'vorname', 'value', false),
    new InputFields('nachname', '', true, 'all', 1, 'nachname', 'value', false),
    new InputFields('email', '', true, 'all', 5, 'email', 'value', false),
    new InputFields('strasse', '', true, 'all', 1, 'strasse', 'value', false),
    new InputFields('zusatz', '', false, 'all', 0, 'zusatz', 'value', false),
    new InputFields('plz', '', true, 'all', 5, 'plz', 'value', true),
    new InputFields('ort', '', true, 'all', 1, 'ort', 'value', false),
    new InputFields('land', '', false, 'all', 0, 'land', 'value', false),
    new InputFields(
      'password1',
      '',
      true,
      'all',
      1,
      'password',
      'value',
      false
    ),
    new InputFields(
      'password2',
      '',
      true,
      'all',
      1,
      'password2',
      'value',
      false
    ),
    new InputFields('art1', '', false, 'privat', 0, 'art', 'checked', false),
    new InputFields('art2', '', false, 'business', 0, 'art', 'checked', false),
    new InputFields(
      'alter1',
      'Alter*',
      true,
      'privat',
      0,
      'category[privat][alter]',
      'value',
      false
    ),
    new InputFields(
      'alter2',
      'Alter*',
      true,
      'business',
      0,
      'category[business][alter]',
      'value',
      false
    ),
    new InputFields(
      'fuehrerschein',
      'Führerscheinklasse*',
      true,
      'privat',
      0,
      'category[privat][fuehrerschein]',
      'value',
      false
    ),
    new InputFields(
      'tel1',
      '',
      true,
      'privat',
      7,
      'category[privat][tel]',
      'value',
      true
    ),
    new InputFields(
      'tel2',
      '',
      true,
      'business',
      7,
      'category[business][tel]',
      'value',
      true
    ),
    new InputFields(
      'company',
      '',
      false,
      'business',
      0,
      'category[business][company]',
      'value',
      false
    ),
    new InputFields(
      'fax',
      '',
      false,
      'business',
      7,
      'category[business][fax]',
      'value',
      true
    ),
    new InputFields(
      'website',
      '',
      false,
      'business',
      6,
      'category[business][website]',
      'value',
      false
    ),
    new InputFields(
      'position',
      '',
      true,
      'business',
      1,
      'category[business][position]',
      'value',
      false
    ),
    new InputFields(
      'kundennummer',
      '',
      false,
      'business',
      0,
      'category[business][kundennummer]',
      'value',
      false
    ),
    new InputFields(
      'companysize',
      'Unternehmensgröße',
      false,
      'business',
      0,
      'category[business][companysize]',
      'value',
      false
    ),
    new InputFields(
      'branche',
      'Branche',
      false,
      'business',
      0,
      'category[business][branche]',
      'value',
      false
    ),
    new InputFields(
      'anzahl',
      'Anzahl Mieten pro Jahr',
      false,
      'business',
      0,
      'category[business][anzahl]',
      'value',
      false
    ),
    new InputFields(
      'durchschnitt',
      'Durchschnittliche Mietdauer',
      false,
      'business',
      0,
      'category[business][durchschnitt]',
      'value',
      false
    ),
    new InputFields(
      'bonitaet',
      '',
      true,
      'all',
      0,
      'bonitaet',
      'checked',
      false
    ),
    new InputFields('agb', '', true, 'all', 0, 'agb', 'checked', false),
    new InputFields(
      'datenschutz',
      '',
      true,
      'all',
      0,
      'datenschutz',
      'checked',
      false
    ),
    new InputFields(
      'marketing',
      '',
      false,
      'all',
      0,
      'marketing',
      'checked',
      false
    ),
  ];
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private formService: FormvalidationService,
    private router: Router
  ) {
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    } else {
      this.apiService.startupChain2(1);
    }
    this.link = this.apiService.baseURL + '?mode=registration';
    this.route.params.subscribe((params) => {
      if (params['result']) {
        this.result = params['result'];
      } else {
        this.result = 'normal';
      }
    });
    console.log(this.result);
    console.log('submitbutton');
    //console.log(document.getElementById('submit'));
  }
  reconf(id1: string, id2: string, id3: string) {
    this.apiService.reconf(id1, id2, id3);
  }

  show() {
    var ele = document.getElementById('file') as HTMLInputElement;
    console.log(ele);
    //var value = ele.value.split('fakepath')[1];
    var value = ele.value.split(/(\\|\/)/g).pop();
    console.log(value);
    document.getElementById('screeny').innerHTML = 'PDF Upload: ' + value;
  }

  onload() {
    scroll(0, 0);
    this.apiService.externalLogoutCheck2();
    this.formService.implementPresets('land', 'land');
    this.formService.implementPresets('position', 'position');
    this.formService.implementPresets('branche', 'branche');

    for (let i = 0; i < this.formfields.length; i++) {
      if (this.formfields[i].required) {
        document
          .getElementById(this.formfields[i].id)!
          .classList.add('required');
      }
      if (this.formfields[i].numbersonly) {
        document
          .getElementById(this.formfields[i].id)
          .addEventListener('input', function (event) {
            var val = (this as HTMLInputElement).value.replace(/[^\d]/g, '');
            (this as HTMLInputElement).value = val;
          });
      }
    }
  }

  ngOnInit() {
    var result = this.result;
    var formfields = this.formfields;
    console.log(result);
    scroll(0, 0);
    var url = window.location.href;
    url = url.split('registrierung')[0];
    (document.getElementById('root') as HTMLInputElement).value = url;
    console.log(url);
    if (result == 'normal') {
      document
        .getElementById('submit')!
        .addEventListener('click', function (event) {
          scroll(0, 0);
          //console.log('Send: ' + result);
          var valid = true;
          //12 und 13
          //event.preventDefault();
          var art = 'privat';
          var id = formfields[12].id;
          //console.log(document.getElementById(id));
          if ((document.getElementById(id) as HTMLInputElement).checked) {
            //console.log('business');
            art = 'business';
          } else {
            //console.log('privat');
          }
          //console.log(art);
          var errormsgs = document.getElementsByClassName('errormsg');
          Array.from(errormsgs).forEach((item) => {
            var id2 = item.id;
            document.getElementById(id2)!.remove();
          });
          var error1 = 'Die Eingabe ist zu kurz';
          var error2 = 'Die Eingabe enthält einen ungültigen Wert';
          var error3 =
            'Dieses Feld ist notwendig um die Registrierung abzuschließen';
          var error4 = 'Die Passwörter stimmen nicht überein';
          var error5 = 'Die Email Adresse scheint ungültig zu sein';
          var error6 = '';
          for (let i = 0; i < formfields.length; i++) {
            if (
              formfields[i].category == 'all' ||
              formfields[i].category == art
            ) {
              id = formfields[i].id;
              var disallow = formfields[i].notallowed;
              var required = formfields[i].required;
              var mother = formfields[i].name;
              var minlength = formfields[i].minlength;
              var target = formfields[i].target;
              var error = '';
              var ele = document.getElementById(id) as HTMLInputElement;

              if (ele.classList.contains('required')) {
                if (ele.value.length < minlength) {
                  //console.log();
                  var error_ele = document.createElement('p');
                  error_ele.setAttribute('style', 'color: red');
                  error_ele.innerHTML = error1;
                  error_ele.classList.add('errormsg');
                  error_ele.id = 'errormsg' + i;
                  ele.parentElement.appendChild(error_ele);
                  console.log('added ad ' + mother);
                  ele.setAttribute('style', 'border:1px solid red');
                  console.log('-------------------------');
                  valid = false;
                }
                if (ele.value == disallow && ele.value.length > 0) {
                  //console.log();
                  var error_ele = document.createElement('p');
                  error_ele.setAttribute('style', 'color: red');
                  error_ele.innerHTML = error2;
                  error_ele.classList.add('errormsg');
                  error_ele.id = 'errormsg' + i;
                  ele.parentElement.appendChild(error_ele);
                  console.log('added ad ' + mother);
                  ele.setAttribute('style', 'border:1px solid red');
                  console.log('-------------------------');
                  valid = false;
                }
                if (ele.type == 'checkbox' && !ele.checked) {
                  //console.log();
                  var error_ele = document.createElement('p');
                  error_ele.setAttribute('style', 'color: red');
                  error_ele.innerHTML = error3;
                  error_ele.classList.add('errormsg');
                  error_ele.id = 'errormsg' + i;
                  ele.parentElement.appendChild(error_ele);
                  console.log('added ad ' + mother);
                  ele.setAttribute('style', 'border:1px solid red');
                  console.log('-------------------------');
                  valid = false;
                }
                if (ele.type == 'radio' && !ele.checked) {
                  var both = document.getElementsByName(ele.name);
                  var checked = true;
                  Array.from(both).forEach((item) => {
                    if (
                      item.id != ele.id &&
                      !(item as HTMLInputElement).checked
                    ) {
                      checked = false;
                    }
                  });
                  if (!checked) {
                    var name7 = 'output.' + ele.name;
                    console.log(name7);
                    var error_ele2 = document.getElementById(name7);
                    //error_ele2.setAttribute('style', 'color: red');
                    error_ele2.innerHTML =
                      "<p class='errormsg' id='errormsg" +
                      i +
                      "' style='color:red'>" +
                      error3 +
                      '</p>';
                    //error_ele.classList.add('errormsg');
                    //error_ele.id = 'errormsg' + i;
                    //ele.parentElement.appendChild(error_ele);
                    console.log('added ad ' + mother);
                    ele.setAttribute('style', 'border:1px solid red');
                    console.log('-------------------------');
                    valid = false;
                  }
                }
              }
            }
          }
          var pass1 = (
            document.getElementById('password1')! as HTMLInputElement
          ).value;
          var pass2 = (
            document.getElementById('password2')! as HTMLInputElement
          ).value;
          if (pass1 !== pass2) {
            var error_ele = document.createElement('p');
            error_ele.setAttribute('style', 'color: red');
            error_ele.innerHTML = error4;
            error_ele.classList.add('errormsg');
            document
              .getElementById('password1')
              .parentElement.appendChild(error_ele);
            console.log('added ad ' + mother);
            ele.setAttribute('style', 'border:1px solid red');
            console.log('-------------------------');
            var error_ele = document.createElement('p');
            error_ele.setAttribute('style', 'color: red');
            error_ele.innerHTML = error4;
            error_ele.classList.add('errormsg');
            document
              .getElementById('password2')
              .parentElement.appendChild(error_ele);
            console.log('added ad ' + mother);
            ele.setAttribute('style', 'border:1px solid red');
            console.log('-------------------------');
            valid = false;
          }
          var mail = document.getElementById('email') as HTMLInputElement;
          var emailCheck =
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
          if (!emailCheck.test(mail.value)) {
            valid = false;
            var error_ele = document.createElement('p');
            error_ele.setAttribute('style', 'color: red');
            error_ele.innerHTML = error5;
            error_ele.classList.add('errormsg');
            mail.parentElement.appendChild(error_ele);
            console.log('added ad ' + mother);
            ele.setAttribute('style', 'border:1px solid red');
            console.log('-------------------------');
          }
          if (result != 'normal') {
            console.log('BLOCKED: ' + result);
            valid = false;
          }
          //valid = false;
          if (!valid) {
            console.log('BLOCKED: ' + result);
            event.preventDefault();
          }
        });
    } else {
      document.getElementById('form').style.display = 'none';
    }
    //console.log(this.formfields);
  }

  toggle(input: string) {
    if (input == 'privat') {
      document.getElementById('id_registration_private').style.display =
        'block';
      document.getElementById('id_registration_business').style.display =
        'none';
      document.getElementById('zusatzinfos1').style.display = 'none';
      document.getElementById('zusatzinfos1a').innerHTML = '4';
      document.getElementById('zusatzinfos2a').innerHTML = '5';
    } else {
      document.getElementById('id_registration_private').style.display = 'none';
      document.getElementById('id_registration_business').style.display =
        'block';
      document.getElementById('zusatzinfos1').style.display = 'block';
      document.getElementById('zusatzinfos1a').innerHTML = '5';
      document.getElementById('zusatzinfos2a').innerHTML = '6';
    }
  }
}

import { HarnessEnvironment } from '@angular/cdk/testing/public-api';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
declare var $: any;

@Component({
  selector: 'app-nutzerverwaltung',
  templateUrl: './nutzerverwaltung.component.html',
  styleUrls: ['./nutzerverwaltung.component.css'],
})
export class NutzerverwaltungComponent implements OnInit {
  user: Array<string>;
  bratfisch: number;

  constructor(private apiService: ApiService, private router: Router) {
    console.log('Construct Nutzerverwaltung');
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
      this.user = data;
    }
  }

  ngOnInit() {}

  loadUser(id: string) {
    //console.log('test?');
    //var output = 'Lade Nutzer #' + id + ' aus dem Profil von :' + this.user[1];
    if (this.user) {
      console.log(
        'Lade Nutzer #' + id + ' aus dem Profil von : ' + this.user[1]
      );
    }
  }

  onload() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    scroll(0, 0);
    this.apiService.externalLogoutCheck2();
    console.log('Ich habe geladen ^-^');
    $('.accordeon-link').click(function () {
      console.log('Aua');
    });
    document.getElementById('nutzertarget').innerHTML = '';
    this.apiService.loadMenue(this.router);
    if (
      sessionStorage.getItem('Email') &&
      sessionStorage.getItem('Usertoken')
    ) {
      if (!sessionStorage.getItem('Nutzerverwaltung')) {
        var input = this.apiService.generateInput([
          ['email', sessionStorage.getItem('Email')],
          ['token', sessionStorage.getItem('Usertoken')],
        ]);
        this.apiService
          .postEndpunkt(input, 'nutzerverwaltung')
          .subscribe((data) => {
            console.log(data);
            sessionStorage.setItem('Nutzerverwaltung', JSON.stringify(data));
            this.rebuildDom();
          });
      } else {
        //var nutzerverwaltung=sessionStorage.getItem("Nutzerverwaltung");
        this.rebuildDom();
      }
    }
  }

  rebuildDom() {
    var nutzerverwaltung = JSON.parse(
      sessionStorage.getItem('Nutzerverwaltung')
    );
    console.log(nutzerverwaltung);
    var env = this;
    if (nutzerverwaltung['count'] > 0) {
      for (let i = 0; i < nutzerverwaltung['count']; i++) {
        console.log(nutzerverwaltung[i]);
        var entry = this.apiService.constructHTML('Nutzerverwaltung', [
          this.router,
          nutzerverwaltung[i],
        ]);
        document.getElementById('nutzertarget').appendChild(entry);
        (
          document.getElementById(
            'a17a' + entry.getAttribute('data-hash')
          ) as HTMLAnchorElement
        ).addEventListener('click', function (event) {
          console.log('EDIT');
          //console.log(this.id);
          var id = String(this.id.split('a17a')[1]);
          //console.log(id);
          open_func(id, env);
          event.preventDefault();
        });

        (
          document.getElementById(
            'a18a' + entry.getAttribute('data-hash')
          ) as HTMLAnchorElement
        ).addEventListener('click', function (event) {
          console.log('DELETE');
          //console.log(this.id);
          var id = String(this.id.split('a18a')[1]);
          //console.log(id);
          delete_func(id);
          event.preventDefault();
        });
        //console.log(entry);
        sessionStorage.setItem(
          entry.getAttribute('data-hash'),
          JSON.stringify(nutzerverwaltung[i])
        );
      }
    }
    this.loadProduktliste();
  }

  add(email: string, name: string) {
    var env = this;
    var entry = this.apiService.constructHTML('Nutzerverwaltung2', [
      this.router,
      [name, email],
    ]);
    document.getElementById('nutzertarget').appendChild(entry);
    (
      document.getElementById(
        'a17a' + entry.getAttribute('data-hash')
      ) as HTMLAnchorElement
    ).addEventListener('click', function (event) {
      console.log('EDIT');
      //console.log(this.id);
      var id = String(this.id.split('a17a')[1]);
      //console.log(id);
      open_func(id, env);
      event.preventDefault();
    });

    (
      document.getElementById(
        'a18a' + entry.getAttribute('data-hash')
      ) as HTMLAnchorElement
    ).addEventListener('click', function (event) {
      console.log('DELETE');
      //console.log(this.id);
      var id = String(this.id.split('a18a')[1]);
      //console.log(id);
      delete_func(id);
      event.preventDefault();
    });
    //console.log(entry);
  }

  calc() {
    var fields = document.getElementsByClassName('inputfield');
    var output = Array<any>();
    for (let i = 0; i < fields.length; i++) {
      var name = (fields[i] as HTMLInputElement).name;
      var id = (fields[i] as HTMLInputElement).id;
      var checked = (fields[i] as HTMLInputElement).checked;
      var beta = this.apiService.generateInput([
        ['name', name],
        ['id', id],
        ['checked', checked],
      ]);
      output.push(JSON.parse(beta));
    }
    var send = JSON.stringify(output);
    //console.log(send);
    this.apiService.postEndpunkt(send, 'nutzerextra').subscribe((data) => {
      //console.log(data);
      const objectArray = Object.entries(data['success']);
      objectArray.forEach(([key, value]) => {
        //console.log(key);
        //console.log(value);
        //console.log('-------Subkategorie--------');
        if (value['childs']) {
          const objectArray = Object.entries(value['childs']);
          objectArray.forEach(([key2, value2]) => {
            //console.log(key2);
            //console.log(value2);
            //console.log('-------Produkte--------');
            if (value2['childs']) {
              const objectArray = Object.entries(value2['childs']);
              objectArray.forEach(([key3, value3]) => {
                //console.log(key3);
                //console.log(value3);
                //console.log(key3 + ': ' + value3['checked']);
                var namez = key + '-+-' + key2 + '-+-' + key3;
                var el = document.getElementsByName(namez);
                for (let x = 0; x < el.length; x++) {
                  var wet = false;
                  if (value3['checked'] == 'true') {
                    wet = true;
                  }
                  (
                    document.getElementById(el[x].id) as HTMLInputElement
                  ).checked = wet;
                }
              });
            }
            var namez = key + '-+-' + key2;
            var ele2 = document.getElementsByName(namez);
            for (let x = 0; x < ele2.length; x++) {
              var wet2 = false;
              if (value2['checked'] == 'true') {
                wet2 = true;
              }
              (
                document.getElementById(ele2[x].id) as HTMLInputElement
              ).checked = wet2;
            }
            document.getElementById('z' + key2).innerHTML =
              ' (' + value2['value'] + ')';
          });
        }
        var namez = key;
        var el = document.getElementsByName(namez);
        for (let x = 0; x < el.length; x++) {
          var wet3 = false;
          if (value['checked'] == 'true') {
            wet3 = true;
          }
          (document.getElementById(el[x].id) as HTMLInputElement).checked =
            wet3;
        }
        document.getElementById('z' + key).innerHTML =
          ' (' + value['value'] + ')';
      });
    });
    console.log('-----------');
  }

  loadProduktliste() {
    var produktliste = document.getElementById('produktkategorien');
    produktliste.innerHTML = '';
    var env = this;
    this.apiService.getEndpunkt('produktliste').subscribe((data) => {
      console.log(data);
      var kategorien = JSON.parse(localStorage.getItem('kategorie'));
      console.log(kategorien);
      for (let i = 0; i < kategorien.length; i++) {
        var li = document.createElement('li');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('accordeon-checkbox');
        input.id = kategorien[i]['title'];
        input.checked = true;

        var a = document.createElement('a');
        a.classList.add('accordeon-link');
        a.href = 'javascript:void(0);';

        var div1 = document.createElement('div');
        div1.classList.add('radio-checkbox-wrapper');

        var label = document.createElement('label');
        label.innerHTML =
          kategorien[i]['title'] +
          '<id id="z' +
          kategorien[i]['title'] +
          '"></id>';
        var input_inner = document.createElement('input');
        input_inner.type = 'checkbox';
        //input_inner.name = kategorien[i]['title'];
        input_inner.name = kategorien[i]['title'];
        input_inner.classList.add('inputfield');
        input_inner.id = this.apiService.makeid(8);
        input_inner.value = '1';
        input_inner.required = true;
        input_inner.checked = true;

        label.appendChild(input_inner);
        label.innerHTML += '<span class="checkmark checkmark-checkbox"></span>';
        div1.appendChild(label);
        div1.innerHTML += '<div style="clear:both;"><div></div></div></div>';
        a.appendChild(div1);

        li.appendChild(input);
        li.appendChild(a);

        var content = document.createElement('div');
        content.classList.add('content');

        var content2 = document.createElement('div');
        content2.classList.add('content-inner');

        //content.appendChild(content2);

        var content3 = document.createElement('div');
        content3.classList.add('accordeon-wrapper');

        var ul = document.createElement('ul');
        ul.classList.add('accordeon');

        var unterkategorien = kategorien[i]['unterkategorien'];
        for (let j = 0; j < unterkategorien.length; j++) {
          var li2 = document.createElement('li');
          var input2 = document.createElement('input');
          input2.type = 'checkbox';
          input2.classList.add('accordeon-checkbox');
          input2.id =
            kategorien[i]['title'] + '-+-' + unterkategorien[j]['title'];
          input2.checked = true;
          input2.value = '1';
          li2.appendChild(input2);

          var a2 = document.createElement('a');
          a2.href = 'javascript:void(0);';
          a2.classList.add('accordeon-link');

          var div3 = document.createElement('div');
          div3.classList.add('radio-checkbox-wrapper');

          var label2 = document.createElement('label');
          label2.innerHTML =
            unterkategorien[j]['title'] +
            '<id id="z' +
            unterkategorien[j]['title'] +
            '"></id><input type="checkbox" class="inputfield" name="' +
            kategorien[i]['title'] +
            '-+-' +
            unterkategorien[j]['title'] +
            '" id="' +
            this.apiService.makeid(8) +
            '"/><span class="checkmark checkmark-checkbox"></span>';
          div3.appendChild(label2);
          div3.innerHTML += '<div style="clear: both;"><div></div></div>';

          a2.appendChild(div3);

          li2.appendChild(a2);

          var div4 = document.createElement('div');
          div4.classList.add('content');

          var div5 = document.createElement('div');
          div5.classList.add('content-inner');

          //console.log(unterkategorien[j]['slug']);
          if (data[unterkategorien[j]['slug']]) {
            //console.log('FOUND:' + data[unterkategorien[j]['slug']]);
            //console.log(unterkategorien[j]['slug']);
            var entry2 = data[unterkategorien[j]['slug']];
            //console.log(entry2.produkte.count);
            for (let k = 0; k < entry2.produkte.count; k++) {
              var div6 = document.createElement('div');
              div6.classList.add('radio-checkbox-wrapper');

              var label3 = document.createElement('label');
              label3.innerHTML =
                entry2.produkte[k] +
                '<input type="checkbox" class="inputfield" name="' +
                kategorien[i]['title'] +
                '-+-' +
                unterkategorien[j]['title'] +
                '-+-' +
                entry2.produkte[k] +
                '" id="' +
                this.apiService.makeid(8) +
                '"/><span class="checkmark checkmark-checkbox"></span>';

              div6.appendChild(label3);
              div6.innerHTML += '<div style="clear: both;"><div></div></div>';
              div5.appendChild(div6);
              div4.appendChild(div5);
              li2.appendChild(div4);
            }
          }

          div5.innerHTML += '<div style="clear: both;"><div></div></div>';
          ul.appendChild(li2);
          content3.appendChild(ul);
        }
        content2.appendChild(content3);
        content.appendChild(content2);
        content.innerHTML += '<div style="clear: both;"><div></div></div>';
        li.appendChild(content);
        produktliste.appendChild(li);
      }
      var checkboxen = document.getElementsByClassName('accordeon-checkbox');
      for (let i = 0; i < checkboxen.length; i++) {
        var ele = checkboxen[i] as HTMLInputElement;
        //console.log(ele.id + ':' + ele.checked);
        if (!ele.checked) {
          var b = document.getElementById(ele.id) as HTMLInputElement;
          b.checked = true;
        }
      }

      var checkboxen = document.getElementsByClassName('accordeon-checkbox');
      for (let i = 0; i < checkboxen.length; i++) {
        var ele = checkboxen[i] as HTMLInputElement;
        //console.log(ele.id + ':' + ele.checked);
      }

      var xyz = document.getElementsByClassName('inputfield');
      //console.log(xyz);
      var env = this;
      for (let i = 0; i < xyz.length; i++) {
        var xyz2 = xyz[i] as HTMLInputElement;
        if (xyz[i].id) {
          document
            .getElementById(xyz[i].id)
            .addEventListener('click', function (event) {
              env.calc();
            });
        }
      }
    });
  }

  open_func(input: string) {
    var env = this;
    open_func(input, env);
  }

  delete_func(input: string) {
    delete_func(input);
  }

  close() {
    document.getElementById('specific').style.display = 'none';
    document.getElementById('generell').style.display = 'block';
  }

  speichern() {
    scroll(0, 0);
    var inputs = document.getElementsByClassName('inputfield');
    //console.log(inputs);
    var env = this;
    var result = new Array<any>();
    //var name = new Array<string>();
    //var value = new Array<string>();
    for (let i = 0; i < inputs.length; i++) {
      var ele = inputs[i] as HTMLInputElement;
      //console.log(.checked);
      if (ele.checked) {
        var line = ele.name + ':' + ele.checked;
        //result.push(line);
        //name.push('kat-' + ele.name);
        result.push(['kategoriewert-' + ele.name, '1']);
      }
      /*
      //works
      if (ele.checked) {
        ele.checked = false;
      } else {
        ele.checked = true;
      }
      */
    }
    var nutzername = (document.getElementById('ad_mail') as HTMLInputElement)
      .innerHTML;

    var nutzername2 = (
      document.getElementById('ad_username') as HTMLInputElement
    ).innerHTML;
    result.push(['email', nutzername]);
    result.push(['name', nutzername2]);
    var additional = document.getElementsByClassName('additional');

    for (let j = 0; j < additional.length; j++) {
      console.log(
        (additional[j] as HTMLInputElement).name +
          ': ' +
          (additional[j] as HTMLInputElement).checked
      );
      //name.push((additional[j] as HTMLInputElement).name);
      //value.push((additional[j] as HTMLInputElement).checked);
      if ((additional[j] as HTMLInputElement).checked) {
        //value.push('true');
        result.push([(additional[j] as HTMLInputElement).name, 'true']);
      } else {
        //value.push('false');
        result.push([(additional[j] as HTMLInputElement).name, '']);
      }
    }
    result.push(['email_main', sessionStorage.getItem('Email')]);
    result.push(['token_main', sessionStorage.getItem('Usertoken')]);
    var output = this.apiService.generateInput(result);
    console.log(output);
    this.apiService
      .postEndpunkt(output, 'updatenutzerverwaltung')
      .subscribe((data) => {
        console.log(data);

        sessionStorage.setItem(
          'Nutzerverwaltung',
          JSON.stringify(data['result'])
        );

        //window.location.reload();
        /*
        var input = env.apiService.generateInput([
          ['email', sessionStorage.getItem('Email')],
          ['token', sessionStorage.getItem('Usertoken')],
        ]);
        env.apiService
          .postEndpunkt(input, 'nutzerverwaltung')
          .subscribe((data) => {
            console.log(data);
            sessionStorage.setItem('Nutzerverwaltung', JSON.stringify(data));
            env.rebuildDom();
          });
        */
        env.refreshComponent();
      });
  }

  refreshComponent() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  cry() {
    console.log('sad crying noises');
    var name = (document.getElementById('new_name') as HTMLInputElement).value;
    var email = (document.getElementById('new_email') as HTMLInputElement)
      .value;

    if (name && email) {
      //do something smart
      console.log(name + ' : ' + email);
      this.add(email, name);
      (document.getElementById('new_name') as HTMLInputElement).value = '';
      (document.getElementById('new_email') as HTMLInputElement).value = '';
      (document.getElementById('new_name') as HTMLInputElement).style.border =
        'none';
      (document.getElementById('new_email') as HTMLInputElement).style.border =
        'none';
      //$('#id_modal_user').modal('hide');
      $.fancybox.close();
    } else {
      if (!name) {
        (document.getElementById('new_name') as HTMLInputElement).style.border =
          '1px solid red';
      }
      if (!email) {
        (
          document.getElementById('new_email') as HTMLInputElement
        ).style.border = '1px solid red';
      }
    }
  }

  cry2() {
    console.log('JA');
    var todelete = sessionStorage.getItem('todelete');
    var mail = document.getElementById('d' + todelete).innerHTML;
    var entry = JSON.parse(sessionStorage.getItem('user_' + mail));
    console.log(entry);
    todelete = 'c' + todelete;
    var objekt = document.getElementById(todelete);
    console.log(todelete);
    var input = this.apiService.generateInput([
      ['email_main', sessionStorage.getItem('Email')],
      ['email', entry.email],
    ]);
    console.log(input);

    this.apiService
      .postEndpunkt(input, 'deletenutzerverwaltung')
      .subscribe((data) => {
        console.log(data);
        if (data['result']['success']) {
          objekt.remove();
          if (document.getElementById('error_output')) {
            document.getElementById('error_output').remove();
          }
          var input = this.apiService.generateInput([
            ['email', sessionStorage.getItem('Email')],
            ['token', sessionStorage.getItem('Usertoken')],
          ]);
          this.apiService
            .postEndpunkt(input, 'nutzerverwaltung')
            .subscribe((data) => {
              console.log(data);
              sessionStorage.setItem('Nutzerverwaltung', JSON.stringify(data));
              document.getElementById('nutzertarget').innerHTML = '';
              this.rebuildDom();
            });
        } else {
          if (document.getElementById('error_output')) {
            document.getElementById('error_output').innerHTML =
              data['result']['error'];
          } else {
            var p7 = document.createElement('p');
            p7.style.color = 'red';
            p7.id = 'error_output';
            p7.innerHTML = data['result']['error'];
            document.getElementById('nutzertarget').prepend(p7);
          }
        }
      });

    $.fancybox.close();
  }

  cry3() {
    console.log('NEIN');
    //document.getElementById('id_modal_delete').style.display = 'none';
    $.fancybox.close();
  }
}

function open_func(input: string, env: any) {
  console.log('open: ' + input);
  var entry = JSON.parse(sessionStorage.getItem(input));
  console.log(entry);
  if (entry['name']) {
    document.getElementById('ad_username').innerHTML = entry['name'];
    (document.getElementById('ad_mail') as HTMLAnchorElement).href =
      'mailto:' + entry['email'];
    (document.getElementById('ad_mail') as HTMLAnchorElement).innerHTML =
      entry['email'];
  } else {
    var ele = document.getElementById('c' + input);
    console.log(ele);
    document.getElementById('ad_username').innerHTML =
      ele.getAttribute('data-name');
    (document.getElementById('ad_mail') as HTMLAnchorElement).href =
      'mailto:' + ele.getAttribute('data-email');
    (document.getElementById('ad_mail') as HTMLAnchorElement).innerHTML =
      ele.getAttribute('data-email');
  }

  if (entry['admin']) {
    (document.getElementById('ad_admin') as HTMLInputElement).checked = true;
  }

  if (entry['unternehmensdaten']) {
    (
      document.getElementById('ad_verwaltung1') as HTMLInputElement
    ).checked = true;
  }

  if (entry['rechnungen']) {
    (
      document.getElementById('ad_verwaltung2') as HTMLInputElement
    ).checked = true;
  }

  if (entry['baustellen']) {
    (
      document.getElementById('ad_verwaltung3') as HTMLInputElement
    ).checked = true;
  }

  if (entry['preise']) {
    (
      document.getElementById('ad_mietprozess1') as HTMLInputElement
    ).checked = true;
  }

  if (entry['mietdauerverlaengerung']) {
    (
      document.getElementById('ad_mietprozess2') as HTMLInputElement
    ).checked = true;
  }

  if (entry['bestellen']) {
    (
      document.getElementById('ad_mietprozess3') as HTMLInputElement
    ).checked = true;
  }

  if (entry['auswahl']) {
    (
      document.getElementById('ad_mietprozess4') as HTMLInputElement
    ).checked = true;
  }

  if (entry['kategorien']) {
    var kategorien = entry['kategorien'];
    //console.log(kategorien);
    var fields = document.getElementsByClassName('inputfield');

    var tocheck = new Array<string>();
    //console.log(kategorien['count']);
    for (let y = 0; y < kategorien['count']; y++) {
      //console.log(kategorien[y]);
      if (kategorien[y]['value'] == 1) {
        var line1 = kategorien[y]['name'];
        tocheck.push(line1);
      }
      for (let y2 = 0; y2 < kategorien[y]['count']; y2++) {
        //console.log(kategorien[y][y2]);
        if (kategorien[y][y2]['value'] == 1) {
          var line2 = kategorien[y]['name'] + '-+-' + kategorien[y][y2]['name'];
          tocheck.push(line2);
        }
        for (let y3 = 0; y3 < kategorien[y][y2]['count']; y3++) {
          //console.log(kategorien[y][y2][y3]);
          if (kategorien[y][y2][y3]['value'] == 1) {
            var line3 =
              kategorien[y]['name'] +
              '-+-' +
              kategorien[y][y2]['name'] +
              '-+-' +
              kategorien[y][y2][y3]['name'];
            tocheck.push(line3);
          }
        }
      }
    }

    for (let x = 0; x < fields.length; x++) {
      //console.log((fields[x] as HTMLInputElement).name);
      var found = false;
      for (let x2 = 0; x2 < tocheck.length; x2++) {
        //console.log('TO Check: ' + tocheck[x2]);
        if ((fields[x] as HTMLInputElement).name == tocheck[x2]) {
          found = true;
        }
      }
      if (found) {
        (fields[x] as HTMLInputElement).checked = true;
      } else {
        (fields[x] as HTMLInputElement).checked = false;
      }
    }
  }
  //console.log(tocheck);
  document.getElementById('specific').style.display = 'block';
  document.getElementById('generell').style.display = 'none';
  //console.log(entry);
  env.calc();
}

function delete_func2(input: string) {
  console.log('delete: ' + input);
  //A Modal "Sind sie sich sicher?"
  //B Speichern button
  var ele = document.getElementById('c' + input);
  console.log(ele);
  //API Call zum löschen
  ele.remove();
}

function delete_func(input: string) {
  console.log('Modal öffne dich');
  sessionStorage.setItem('todelete', input);
  //document.getElementById('id_modal_delete').style.display = 'block';
  $.fancybox.open({
    touch: false,
    src: '#id_modal_delete',
    type: 'inline',
    opts: {
      beforeShow: function () {},
    },
  });
}

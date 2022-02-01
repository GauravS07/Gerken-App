import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
declare var $: any;

@Component({
  selector: 'app-rechnungshistorie',
  templateUrl: './rechnungshistorie.component.html',
  styleUrls: ['./rechnungshistorie.component.css'],
})
export class RechnungshistorieComponent implements OnInit {
  index = 1;

  constructor(private apiService: ApiService, private router: Router) {
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    } else {
      this.apiService.startupChain2(1);
    }
    sessionStorage.setItem('page', this.index.toString());
  }

  ngOnInit() {
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    } else {
      this.apiService.startupChain2(1);
    }
    console.log(sessionStorage.getItem('Email'));
    console.log(sessionStorage.getItem('Usertoken'));
  }

  loadMore() {
    document.getElementById('less').style.display = 'inline-block';
    var page = this.index;
    this.index++;
    sessionStorage.setItem('page', this.index.toString());
    var outputdata = [
      ['email', sessionStorage.getItem('Email')],
      ['token', sessionStorage.getItem('Usertoken')],
      ['page', page],
    ];
    var outputjson = this.apiService.generateInput(outputdata);
    if (!sessionStorage.getItem('Rechnung_' + page)) {
      this.apiService
        .postEndpunkt(outputjson, 'rechnungen')
        .subscribe((data) => {
          var rechnungen = data;
          console.log(data);
          var count = rechnungen['count'];
          console.log('Speichere : Rechnung_' + page);
          sessionStorage.setItem(
            'Rechnung_' + page,
            JSON.stringify(rechnungen)
          );
          this.addRechnungen(rechnungen);
          if (!rechnungen['hasmore']) {
            document.getElementById('more').style.display = 'none';
          }
        });
    } else {
      console.log('Speichere : Rechnung_' + page);
      console.log(JSON.parse(sessionStorage.getItem('Rechnung_' + page)));
      this.addRechnungen(
        JSON.parse(sessionStorage.getItem('Rechnung_' + page))
      );
      if (!JSON.parse(sessionStorage.getItem('Rechnung_' + page))['hasmore']) {
        document.getElementById('more').style.display = 'none';
      }
    }
  }

  loadLess() {
    scroll(0, 0);
    document.getElementById('more').style.display = 'inline-block';
    var page = this.index;
    this.index--;
    sessionStorage.setItem('page', this.index.toString());
    if (this.index == 1) {
      document.getElementById('less').style.display = 'none';
    }
    var rechnungen: Array<any> = JSON.parse(
      sessionStorage.getItem('Rechnung_start')
    );
    var output = document.getElementById('output');
    output.innerHTML = '';
    this.buildRechnungen(rechnungen);
    for (let i = 1; i < page - 1; i++) {
      this.addRechnungen(JSON.parse(sessionStorage.getItem('Rechnung_' + i)));
    }
  }

  loadRechnungen() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log("Index: "+index);
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    }else{
      document.getElementById('id_c2a').style.display = 'none';
    }
    scroll(0, 0);
    this.apiService.externalLogoutCheck2();
    console.log('loadRechnungen');
    var output = document.getElementById('output');
    output.innerHTML = '';
    var select1 = document.getElementById('Typ');
    select1.innerHTML = '<option class="typ_option" id="b7">Typ..</option>';
    var select2 = document.getElementById('Zeitraum');
    select2.innerHTML =
      '<option class="time_option" id="b8">Zeitraum..</option>';
    var select3 = document.getElementById('Standort');
    select3.innerHTML =
      '<option class="place_option" id="b9">Standort..</option>';

    select1.addEventListener('change', function () {
      sort();
    });
    select2.addEventListener('change', function () {
      sort();
    });
    select3.addEventListener('change', function () {
      sort();
    });

    var outputdata = [
      ['email', sessionStorage.getItem('Email')],
      ['token', sessionStorage.getItem('Usertoken')],
      ['page', 0],
    ];
    var outputjson = this.apiService.generateInput(outputdata);
    console.log(outputjson);
    if (!sessionStorage.getItem('Rechnung_start')) {
      this.apiService
        .postEndpunkt(outputjson, 'rechnungen')
        .subscribe((data) => {
          var rechnungen = data;
          console.log('RECHNUNGEN');
          console.log(data);
          var count = rechnungen['count'];
          sessionStorage.setItem('Rechnung_start', JSON.stringify(rechnungen));
          this.buildRechnungen(rechnungen);
        });
    } else {
      console.log(JSON.parse(sessionStorage.getItem('Rechnung_start')));
      this.buildRechnungen(
        JSON.parse(sessionStorage.getItem('Rechnung_start'))
      );
    }
  }

  buildRechnungen(input: Array<any>) {
    var count = input['count'];
    var output = document.getElementById('output');
    var select1 = document.getElementById('Typ');
    var select2 = document.getElementById('Zeitraum');
    var select3 = document.getElementById('Standort');
    for (let i = 0; i < count; i++) {
      var rechnung = input[i];
      output.appendChild(
        this.apiService.constructHTML('Rechnungshistorie', [
          this.router,
          rechnung,
        ])
      );
      var option1 = rechnung['typ'];
      if (!select1.innerHTML.includes(option1)) {
        select1.innerHTML +=
          '<option class="typ_option" id="' +
          this.apiService.makeid(7) +
          '">' +
          option1 +
          '</option>';
      }
      var option3 = rechnung['standortgerken'];
      if (!select3.innerHTML.includes(option3)) {
        select3.innerHTML +=
          '<option class="place_option" id="' +
          this.apiService.makeid(7) +
          '">' +
          option3 +
          '</option>';
      }
      var option2 =
        rechnung['datum'].split('.')[1] + '.' + rechnung['datum'].split('.')[2];
      if (!select2.innerHTML.includes(option2)) {
        select2.innerHTML +=
          '<option class="time_option" id="' +
          this.apiService.makeid(7) +
          '">' +
          option2 +
          '</option>';
      }
    }
    adjustFilter();
  }

  addRechnungen(input: Array<any>) {
    var count = input['count'];
    var output = document.getElementById('output');
    var select1 = document.getElementById('Typ');
    var select2 = document.getElementById('Zeitraum');
    var select3 = document.getElementById('Standort');
    for (let i = 0; i < count; i++) {
      var rechnung = input[i];
      output.appendChild(
        this.apiService.constructHTML('Rechnungshistorie', [
          this.router,
          rechnung,
        ])
      );
      var option1 = rechnung['typ'];
      if (!select1.innerHTML.includes(option1)) {
        select1.innerHTML +=
          '<option class="typ_option" id="' +
          this.apiService.makeid(7) +
          '">' +
          option1 +
          '</option>';
      }
      var option3 = rechnung['standortgerken'];
      if (!select3.innerHTML.includes(option3)) {
        select3.innerHTML +=
          '<option class="place_option" id="' +
          this.apiService.makeid(7) +
          '">' +
          option3 +
          '</option>';
      }
      var option2 =
        rechnung['datum'].split('.')[1] + '.' + rechnung['datum'].split('.')[2];
      if (!select2.innerHTML.includes(option2)) {
        select2.innerHTML +=
          '<option class="time_option" id="' +
          this.apiService.makeid(7) +
          '">' +
          option2 +
          '</option>';
      }
    }
    adjustFilter();
  }
}

function adjustFilter() {
  var page = parseInt(sessionStorage.getItem('page'));
  console.log('Page: ' + page);
  var entrys = JSON.parse(sessionStorage.getItem('Rechnung_start'));
  var eintraege = Array<any>();
  for (let i = 0; i < entrys['count']; i++) {
    eintraege.push(entrys[i]);
  }
  if (page > 1) {
    console.log('Load more pages');
    for (let i = 1; i < page; i++) {
      console.log('Lade : Rechnung_' + i);
      var entrys = JSON.parse(sessionStorage.getItem('Rechnung_' + i));
      console.log('Entrys');
      console.log(entrys);
      for (let i = 0; i < entrys['count']; i++) {
        eintraege.push(entrys[i]);
      }
    }
  }
  console.log('Einträge (Länge: ' + eintraege.length + ')');
  console.log(eintraege);

  var placeoption = Array<any>();
  var c = document.getElementsByClassName('place_option');
  for (let i = 0; i < c.length; i++) {
    placeoption.push([c[i].innerHTML, c[i].id]);
  }

  var timeoption = Array<any>();
  var c = document.getElementsByClassName('time_option');
  for (let i = 0; i < c.length; i++) {
    timeoption.push([c[i].innerHTML, c[i].id]);
  }

  var typoption = Array<any>();
  var c = document.getElementsByClassName('typ_option');
  for (let i = 0; i < c.length; i++) {
    typoption.push([c[i].innerHTML, c[i].id]);
  }
  console.log(placeoption);
  console.log(timeoption);
  console.log(typoption);

  var select1 = document.getElementById('Typ') as HTMLSelectElement;
  var select2 = document.getElementById('Zeitraum') as HTMLSelectElement;
  var select3 = document.getElementById('Standort') as HTMLSelectElement;

  var typ = select1.value;
  var place = select3.value;
  var zeit = select2.value;

  console.log('PLACE');
  for (let i = 0; i < placeoption.length; i++) {
    var set = placeoption[i][0];
    document.getElementById(placeoption[i][1]).style.color = 'lightgrey';
    for (let j = 0; j < eintraege.length; j++) {
      var typ = select1.value;
      var place = select3.value;
      var zeit = select2.value;
      var set = placeoption[i][0];
      if (typ == 'Typ..') {
        console.log('egal, typ');
        typ = eintraege[j]['typ'];
      }

      if (set == 'Standort..') {
        console.log('egal, place');
        set = eintraege[j]['standortgerken'];
      }

      var tmp_datum =
        eintraege[j]['datum'].split('.')[1] +
        '.' +
        eintraege[j]['datum'].split('.')[2];
      if (zeit == 'Zeitraum..') {
        console.log('egal, zeit');
        zeit = tmp_datum;
      }
      console.log(
        'found: Typ=' +
          eintraege[j]['typ'] +
          ', Place=' +
          eintraege[j]['standortgerken'] +
          ', Zeit=' +
          tmp_datum +
          ', Name: ' +
          eintraege[j]['rechnungsid']
      );
      console.log('test');
      console.log(
        typ +
          ':' +
          set +
          ':' +
          zeit +
          ' Ergebnis: ' +
          (eintraege[j]['typ'] == typ &&
            tmp_datum == zeit &&
            eintraege[j]['standortgerken'] == set)
      );
      if (
        eintraege[j]['typ'] == typ &&
        tmp_datum == zeit &&
        eintraege[j]['standortgerken'] == set
      ) {
        document.getElementById(placeoption[i][1]).style.color = 'black';
      }
    }
  }

  var typ = select1.value;
  var place = select3.value;
  var zeit = select2.value;

  //console.log('ZEIT');
  for (let i = 0; i < timeoption.length; i++) {
    var set = timeoption[i][0];
    //console.log(timeoption[i]);
    //console.log('time set:' + set);
    document.getElementById(timeoption[i][1]).style.color = 'lightgrey';
    for (let j = 0; j < eintraege.length; j++) {
      var typ = select1.value;
      var place = select3.value;
      var zeit = select2.value;
      var set = timeoption[i][0];
      if (typ == 'Typ..') {
        typ = eintraege[j]['typ'];
      }

      //console.log(place);
      if (place == 'Standort..') {
        //console.log(true);
        place = eintraege[j]['standortgerken'];
      } else {
        //console.log(false);
      }

      var tmp_datum =
        eintraege[j]['datum'].split('.')[1] +
        '.' +
        eintraege[j]['datum'].split('.')[2];

      if (set == 'Zeitraum..') {
        set = tmp_datum;
      }

      /*
      console.log(
        'found: Typ=' +
          eintraege[j]['typ'] +
          ', Place=' +
          eintraege[j]['standortgerken'] +
          ', Zeit=' +
          tmp_datum
      );
      */
      //console.log('test');
      //console.log(typ + ':' + place + ':' + set);
      if (
        eintraege[j]['typ'] == typ &&
        tmp_datum == set &&
        eintraege[j]['standortgerken'] == place
      ) {
        document.getElementById(timeoption[i][1]).style.color = 'black';
      }
    }
  }

  var typ = select1.value;
  var place = select3.value;
  var zeit = select2.value;

  //console.log('TYP');
  for (let i = 0; i < typoption.length; i++) {
    var set = typoption[i][0];
    document.getElementById(typoption[i][1]).style.color = 'lightgrey';
    for (let j = 0; j < eintraege.length; j++) {
      var typ = select1.value;
      var place = select3.value;
      var zeit = select2.value;
      var set = typoption[i][0];
      if (set == 'Typ..') {
        set = eintraege[j]['typ'];
      }

      if (place == 'Standort..') {
        place = eintraege[j]['standortgerken'];
      }

      var tmp_datum =
        eintraege[j]['datum'].split('.')[1] +
        '.' +
        eintraege[j]['datum'].split('.')[2];
      if (zeit == 'Zeitraum..') {
        zeit = tmp_datum;
      }
      /*
      console.log(
        'found: Typ=' +
          eintraege[j]['typ'] +
          ', Place=' +
          eintraege[j]['standortgerken'] +
          ', Zeit=' +
          tmp_datum
      );
      */
      //console.log('test');
      //console.log(set + ':' + place + ':' + zeit);
      if (
        eintraege[j]['typ'] == set &&
        tmp_datum == zeit &&
        eintraege[j]['standortgerken'] == place
      ) {
        //console.log(true);
        document.getElementById(typoption[i][1]).style.color = 'black';
      } else {
        //console.log(false);
      }
    }
  }
}

function sort() {
  var select1 = document.getElementById('Typ') as HTMLSelectElement;
  var select2 = document.getElementById('Zeitraum') as HTMLSelectElement;
  var select3 = document.getElementById('Standort') as HTMLSelectElement;

  console.log(
    'Sorting:' + select1.value + ':' + select2.value + ':' + select3.value
  );
  var found_typ = Array<string>();
  var found_time = Array<string>();
  var found_place = Array<string>();

  var rechnungen = document.getElementsByClassName('invoice');
  //console.log(rechnungen);
  for (let i = 0; i < rechnungen.length; i++) {
    var ele = document.getElementById(rechnungen[i].id);
    //console.log(ele);
    var zeitraum = ele.getAttribute('data-zeitraum');
    var typ = ele.getAttribute('data-typ');
    var standort = ele.getAttribute('data-standort');
    var visible = true;
    if (select1.value != 'Typ..') {
      if (select1.value != typ) {
        visible = false;
      }
    }

    if (select2.value != 'Zeitraum..') {
      if (select2.value != zeitraum) {
        visible = false;
      }
    }

    if (select3.value != 'Standort..') {
      if (select3.value != standort) {
        visible = false;
      }
    }

    if (!visible) {
      ele.style.display = 'none';
    } else {
      ele.style.display = 'block';
      found_typ.push(typ);
      found_time.push(zeitraum);
      found_place.push(standort);
    }
  }
  adjustFilter();
}

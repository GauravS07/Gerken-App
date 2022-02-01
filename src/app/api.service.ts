import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { credentials } from './startseite/startseite.component';
import {
  Hauptkategorie,
  Subkategorie,
  Props,
  WizardStage,
  Fragen,
  Input,
  Miethistorie,
  Mieten,
  Rechnungen,
  Standort,
} from './mietprozess/mietprozess.component';
declare var $: any;

@Injectable({ providedIn: 'root' })
export class ApiService {
  //baseURL: string = 'http://localhost:3000/';
  baseURL: string =
    'https://diesdas.codersunlimited.de/diesdas/api/overview.php';

  first =
    'https://diesdas.codersunlimited.de/diesdas/api/overview.php?mode=endpunkte';
  Apikey = '540cbd6b79f6a406737e09f00adfb8828b3b920ec8ce050b9b466b76f68197cc';
  constructor(private http: HttpClient, private router: Router) {
    /*
    if (document.getElementById('id_menu_wrapper')) {
      if (document.getElementById('id_menu_wrapper').style.display == 'block') {
        document.getElementById('id_menu_btn').classList.remove('open');
        document.getElementById('id_menu_btn').classList.add('open');
      } else {
        document.getElementById('id_menu_btn').classList.remove('open');
      }
    }
    */
    //console.log("BACKFISCH");
  }

  generateInput(eingabe: Array<any>): string {
    var result = '';
    for (let i = 0; i < eingabe.length; i++) {
      if (result == '') {
        result = '{"' + eingabe[i][0] + '":"' + eingabe[i][1] + '"';
      } else {
        result += ',"' + eingabe[i][0] + '":"' + eingabe[i][1] + '"';
      }
    }
    result += '}';
    return result;
  }

  loadByCategories(haupt: string, sub: string, callback: any, x: any) {
    var input =
      '{"hauptkategorie":"' + haupt + '","subkategorie":"' + sub + '"}';
    this.postEndpunkt(input, 'produktbycat').subscribe((data) => {
      //result = data;
      console.log('getData=> produktbycat: ');
      //console.log(data);
      callback(data['produkte'], x);
    });
  }

  getCookie(cname: string) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  externalLogoutCheck() {
    if (!sessionStorage.getItem('Usertoken')) {
      console.log('LOGOUT');
      //document.getElementById('extraorder').style.display = 'none';
      sessionStorage.clear();
    }
  }

  externalLogoutCheck2() {
    if (!sessionStorage.getItem('Usertoken')) {
      if (document.getElementById('id_account_btn')) {
        document.getElementById('id_account_btn').classList.remove('loggedin');
        if (document.getElementById('extraorder')) {
          document.getElementById('extraorder').style.display = 'none';
        }
      }
    } else {
      if (document.getElementById('id_account_btn')) {
        if (
          !document
            .getElementById('id_account_btn')
            .classList.contains('loggedin')
        ) {
          document.getElementById('id_account_btn').classList.add('loggedin');
        }
      }
    }
  }

  getData(file: string, callback: any, x: any) {
    this.getEndpunkt(file).subscribe((data) => {
      //result = data;
      //console.log('getData=> ' + file + ': ' + JSON.stringify(data));

      callback(data, x);
    });
  }

  doi(filename: string, hash: string): Observable<any> {
    var title = 'doi_end';
    if (localStorage.getItem(title)) {
      var url = JSON.parse(localStorage.getItem(title))['endpunkt'];
    }
    //console.log(url);
    url += '&filename=' + filename + '&hash=' + hash;
    //console.log(url);

    var result = this.http.get<any>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
    //console.log(result);
    return result;
  }

  getEndpunkt(file: string): Observable<any> {
    /*
    var url = 'https://diesdas.codersunlimited.de/diesdas/api/overview.php';
    console.log(url + '?mode=' + file);
    var modifier = '?mode=' + file;
    */
    var url = this.baseURL + '?mode=' + file;
    var title = file + '_end';
    if (localStorage.getItem(title)) {
      var ra = JSON.parse(localStorage.getItem(title));
      url = ra['endpunkt'];
      var url_b = window.location;
      if (ra['alt'] && url_b.pathname.includes('geraete-mieten')) {
        url = ra['alt'];
      }
    }
    console.log(url);

    var result = this.http.get<any>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
    //console.log(result);
    return result;
  }

  updateUser(input: string, email: string, usertoken: string): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = input;
    //console.log('TO SEND: ' + body);
    var url = this.baseURL;
    var title = 'user2_end';
    url = JSON.parse(localStorage.getItem(title))['endpunkt'];
    url += '&filename=' + email + '&token=' + usertoken;
    console.log(url);
    return this.http.post(url, body, {
      headers: headers,
    });
  }

  ostern(input: string): Observable<any> {
    console.log('Get Endpunkte');
    var result = this.http.get<any>(
      'https://customsearch.googleapis.com/customsearch/v1?cx=f0ec6c2cb84dace21&num=6&q=' +
        input +
        '&searchType=image&alt=json&key=AIzaSyCt1vlX_NkxBgwYTuGfDUAIwYTf8eYoH-o',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
    //console.log(result);
    return result;
  }

  postEndpunkt(input: string, file: string): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = input;
    //console.log(body);
    var url = this.baseURL;
    var title = file + '_end';
    console.log(JSON.parse(input));
    console.log(title);
    if (localStorage.getItem(title)) {
      url = JSON.parse(localStorage.getItem(title))['endpunkt'];
    }
    console.log(url);
    /*
    if (!url) {
      url =
        'https://diesdas.codersunlimited.de/diesdas/api/overview2.php?mode=' +
        file;
    }
    */
    return this.http.post(url, body, {
      headers: headers,
    });
  }

  endpunkte(): Observable<any> {
    console.log('Get Endpunkte');
    var result = this.http.get<any>(this.first, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
    //console.log(result);
    return result;
  }

  login(cred: credentials): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(cred);
    //console.log(body);
    var url = this.baseURL;
    var title = 'login_end';
    url = JSON.parse(localStorage.getItem(title));
    //console.log(url);
    //console.log(title);
    return this.http.post(url['endpunkt'], body, {
      headers: headers,
    });
  }

  language(lang: string): Observable<string> {
    /*
    var url = 'https://diesdas.codersunlimited.de/diesdas/api/overview.php';
    console.log('apiservice start');
    console.log(url + '?mode=language&lang=' + lang);
    var modifier = '?mode=language&lang=' + lang;
    */
    var url = this.baseURL + '?mode=language&lang=' + lang;
    var title = 'language' + lang.toUpperCase() + '_end';
    //console.log(title);

    //console.log('Endpunkt:');
    //console.log(localStorage.getItem(title));

    url = JSON.parse(localStorage.getItem(title));
    var result = this.http.get<any>(url['endpunkt'], {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
    //console.log(result);
    //console.log('apiservice end');
    return result;
  }

  startupChain(step: number) {
    //1. Endpunkte laden
    //2. Menü laden
    //3. Labels laden
    sessionStorage.setItem('DEV', 'true');
    if (step == 1) {
      console.log('Lade Endpunkte');
      this.endpunkte().subscribe((data) => {
        //endpunkte geladen
        console.log(data);
        var endstring = JSON.stringify(data);
        var count = data['count'];
        for (let i = 0; i < count; i++) {
          var tmp = data[i];
          localStorage.setItem(tmp['title'] + '_end', JSON.stringify(tmp));
          console.log(localStorage.getItem(tmp['title'] + '_end'));
          //console.log(tmp['endpunkt']);
          console.log('set as ' + tmp['title'] + '_end'); //Alle geladenen Endpunkte
          var changed = new Date(tmp['changed'] * 1000);
          //console.log( tmp['title'] +              ' stellt Daten bereit vom ' +              changed +              ' bereit.(api)'          );
        }
        localStorage.setItem('endpunkte', endstring);
        //this.followUp();
        this.startupChain(2);
      });
    }
    if (step == 2) {
      console.log('Lade Menü');
      var reload = true;
      if (localStorage.getItem('menue')) {
        var menue = JSON.parse(localStorage.getItem('menue'));
        var local_changed = parseInt(menue['changed']);
        //console.log(local_changed);

        var endpunkt = JSON.parse(localStorage.getItem('menue_end'));
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;
          this.startupChain(3);
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Menü!');
        //Wenn nichts aktuelles vorhanden ist, lade Menü
        this.getEndpunkt('menue').subscribe((data) => {
          //console.log('--------');
          //console.log(data);
          //console.log('--------');
          localStorage.setItem('menue', JSON.stringify(data));
          localStorage.setItem('menue_changed', data['changed']);
          this.startupChain(3);
        });
      }
    }
    if (step == 3) {
      console.log('Lade Sprache');
      var reload = true;

      var lang = 'DE';
      if (sessionStorage.getItem('language')) {
        lang = sessionStorage.getItem('language');
      }

      if (localStorage.getItem(lang + '_changed')) {
        //var menue = JSON.parse(localStorage.getItem('Startseite_end'));
        var local_changed = parseInt(localStorage.getItem(lang + '_changed'));

        var endpunkt = JSON.parse(
          localStorage.getItem('language' + lang + '_end')
        );
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;
          this.startupChain(4);
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Sprache!');
        //Wenn nichts aktuelles vorhanden ist, lade Sprache
        this.language(lang).subscribe((data) => {
          //console.log('--------');
          //console.log(data);
          //console.log('--------');
          sessionStorage.setItem('language', lang);
          localStorage.setItem(lang + '_changed', data['changed']);
          var count = data['count'];
          for (let i = 0; i < count; i++) {
            var tmp = data[i];
            var name = tmp['title_element'] + '_' + lang;
            localStorage.setItem(name, JSON.stringify(tmp));
          }
          this.startupChain(4);
        });
      }
    }
    if (step == 4) {
      console.log('Lade Sprachen');
      var reload = true;
      if (localStorage.getItem('sprachen')) {
        var sprachen = JSON.parse(localStorage.getItem('sprachen'));
        var local_changed = parseInt(sprachen['changed']);

        var endpunkt = JSON.parse(localStorage.getItem('languages_end'));
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;
          this.startupChain(5);
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Sprachen!');
        //Wenn nichts aktuelles vorhanden ist, lade Sprachen
        this.getEndpunkt('languages').subscribe((data) => {
          //console.log('--------');
          //console.log(data);
          //console.log('--------');
          localStorage.setItem('sprachen', JSON.stringify(data));
          this.startupChain(5);
        });
      }
    }
    if (step == 5) {
      console.log('Lade Kategorien');
      var reload = true;
      if (localStorage.getItem('kategorie')) {
        var kategorien = JSON.parse(localStorage.getItem('kategorie'));
        var local_changed = parseInt(kategorien['changed']);
        var endpunkt = JSON.parse(localStorage.getItem('kategorie_end'));
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;

          this.startupChain(6);
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Kategorien!');
        //Wenn nichts aktuelles vorhanden ist, lade Sprachen
        this.getEndpunkt('kategorie').subscribe((data) => {
          localStorage.setItem('kategorie', JSON.stringify(data));
          //console.log('--------');
          //console.log(data['toastbrot']);
          //console.log('--------');
          console.log(data);
          var kategorien2 = Array<Hauptkategorie>();
          var kats = data['toastbrot'];
          var main = kats['Hauptkategorie'];
          var sub = kats['Subkategorie'];
          var count = main['count'];
          for (let i = 0; i < count; i++) {
            var neu = new Hauptkategorie(
              main[i]['title'],
              main[i]['link'],
              main[i]['slug']
            );
            var rel = sub[main[i]['slug']];
            var count2 = rel['count'];
            //console.log(main[i]['slug'] + ': ' + count2);
            for (let j = 0; j < count2; j++) {
              //console.log(rel[j]['title'] + ': ' + j);
              var neusub = new Subkategorie(
                rel[j]['title'],
                rel[j]['link'],
                rel[j]['slug']
              );
              neu.add(neusub);
            }
            kategorien2.push(neu);
          }
          localStorage.setItem('kategorie', JSON.stringify(kategorien2));
          this.startupChain(6);
        });
      }
    }
    //Wizard
    if (step == 6) {
      console.log('Lade Wizard');
      var reload = true;
      if (localStorage.getItem('wizard_raw')) {
        var wizard = JSON.parse(localStorage.getItem('wizard_raw'));
        var local_changed = parseInt(wizard['changed']);

        var endpunkt = JSON.parse(localStorage.getItem('wizard_end'));
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;
          this.constructWizard(wizard);
          this.followUp();
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Wizard!');
        //Wenn nichts aktuelles vorhanden ist, lade Sprachen
        this.getEndpunkt('wizard').subscribe((data) => {
          //localStorage.setItem('kategorie', JSON.stringify(data));
          //console.log('--------');
          //console.log(data);
          //console.log('--------');
          localStorage.setItem('wizard_raw', JSON.stringify(data));
          var wizard = JSON.parse(localStorage.getItem('wizard_raw'));
          this.constructWizard(wizard);
          this.followUp();
        });
      }
    }
  }

  startupChain2(step: number) {
    //1. Endpunkte laden
    //2. Menü laden
    //3. Labels laden
    sessionStorage.setItem('DEV', 'true');
    if (step == 1) {
      console.log('Lade Endpunkte');
      this.endpunkte().subscribe((data) => {
        //endpunkte geladen
        //console.log(data);
        var endstring = JSON.stringify(data);
        var count = data['count'];
        for (let i = 0; i < count; i++) {
          var tmp = data[i];
          localStorage.setItem(tmp['title'] + '_end', JSON.stringify(tmp));
          //console.log('set as ' + tmp['title'] + '_end'); //Alle geladenen Endpunkte
          var changed = new Date(tmp['changed'] * 1000);
          //console.log(            tmp['title'] +              ' stellt Daten bereit vom ' +              changed +              ' bereit.(api)'          );
        }
        sessionStorage.setItem('endpunkte', endstring);
        //this.followUp();
        this.startupChain2(2);
      });
    }
    if (step == 2) {
      console.log('Lade Menü');
      var reload = true;
      if (localStorage.getItem('menue')) {
        var menue = JSON.parse(localStorage.getItem('menue'));
        var local_changed = parseInt(menue['changed']);
        //console.log(local_changed);

        var endpunkt = JSON.parse(localStorage.getItem('menue_end'));
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;
          this.startupChain2(3);
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Menü!');
        //Wenn nichts aktuelles vorhanden ist, lade Menü
        this.getEndpunkt('menue').subscribe((data) => {
          //console.log('--------');
          //console.log(data);
          //console.log('--------');
          localStorage.setItem('menue', JSON.stringify(data));
          localStorage.setItem('menue_changed', data['changed']);
          this.startupChain2(3);
        });
      }
    }
    if (step == 3) {
      console.log('Lade Sprache');
      var reload = true;

      var lang = 'DE';
      if (sessionStorage.getItem('language')) {
        lang = sessionStorage.getItem('language');
      }

      if (localStorage.getItem(lang + '_changed')) {
        //var menue = JSON.parse(localStorage.getItem('Startseite_end'));
        var local_changed = parseInt(localStorage.getItem(lang + '_changed'));

        var endpunkt = JSON.parse(
          localStorage.getItem('language' + lang + '_end')
        );
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;
          this.startupChain2(4);
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Sprache!');
        //Wenn nichts aktuelles vorhanden ist, lade Sprache
        this.language(lang).subscribe((data) => {
          //console.log('--------');
          //console.log(data);
          //console.log('--------');
          sessionStorage.setItem('language', lang);
          localStorage.setItem(lang + '_changed', data['changed']);
          var count = data['count'];
          for (let i = 0; i < count; i++) {
            var tmp = data[i];
            var name = tmp['title_element'] + '_' + lang;
            localStorage.setItem(name, JSON.stringify(tmp));
          }
          this.startupChain2(4);
        });
      }
    }
    if (step == 4) {
      console.log('Lade Sprachen');
      var reload = true;
      if (localStorage.getItem('sprachen')) {
        var sprachen = JSON.parse(localStorage.getItem('sprachen'));
        var local_changed = parseInt(sprachen['changed']);

        var endpunkt = JSON.parse(localStorage.getItem('languages_end'));
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;
          this.startupChain2(5);
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Sprachen!');
        //Wenn nichts aktuelles vorhanden ist, lade Sprachen
        this.getEndpunkt('languages').subscribe((data) => {
          //console.log('--------');
          //console.log(data);
          //console.log('--------');
          localStorage.setItem('sprachen', JSON.stringify(data));
          this.startupChain2(5);
        });
      }
    }
    if (step == 5) {
      console.log('Lade Kategorien');
      var reload = true;
      if (localStorage.getItem('kategorie')) {
        var kategorien = JSON.parse(localStorage.getItem('kategorie'));
        var local_changed = parseInt(kategorien['changed']);

        var endpunkt = JSON.parse(localStorage.getItem('kategorie_end'));
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;

          this.startupChain2(6);
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Kategorien!');
        //Wenn nichts aktuelles vorhanden ist, lade Sprachen
        this.getEndpunkt('kategorie').subscribe((data) => {
          //localStorage.setItem('kategorie', JSON.stringify(data));
          //console.log('--------');
          //console.log(data['toastbrot']);
          //console.log('--------');
          var kategorien2 = Array<Hauptkategorie>();
          var kats = data['toastbrot'];
          var main = kats['Hauptkategorie'];
          var sub = kats['Subkategorie'];
          var count = main['count'];
          for (let i = 0; i < count; i++) {
            var neu = new Hauptkategorie(
              main[i]['title'],
              main[i]['link'],
              main[i]['slug']
            );
            var rel = sub[main[i]['slug']];
            var count2 = rel['count'];
            //console.log(main[i]['slug'] + ': ' + count2);
            for (let j = 0; j < count2; j++) {
              //console.log(rel[j]['title'] + ': ' + j);
              var neusub = new Subkategorie(
                rel[j]['title'],
                rel[j]['link'],
                rel[j]['slug']
              );
              neu.add(neusub);
            }
            kategorien2.push(neu);
          }
          localStorage.setItem('kategorie', JSON.stringify(kategorien2));
          this.startupChain2(6);
        });
      }
    }
    //Wizard
    if (step == 6) {
      console.log('Lade Wizard');
      var reload = true;
      if (localStorage.getItem('wizard_raw')) {
        var wizard = JSON.parse(localStorage.getItem('wizard_raw'));
        var local_changed = parseInt(wizard['changed']);

        var endpunkt = JSON.parse(localStorage.getItem('wizard_end'));
        var endpunkt_changed = parseInt(endpunkt['changed']);
        if (local_changed >= endpunkt_changed) {
          reload = false;
          this.constructWizard(wizard);
          this.followUp2();
        }
      }
      if (reload) {
        console.log('Neuere Daten gefunden! Reloade Wizard!');
        //Wenn nichts aktuelles vorhanden ist, lade Sprachen
        this.getEndpunkt('wizard').subscribe((data) => {
          //localStorage.setItem('kategorie', JSON.stringify(data));
          //console.log('--------');
          //console.log(data);
          //console.log('--------');
          localStorage.setItem('wizard_raw', JSON.stringify(data));
          var wizard = JSON.parse(localStorage.getItem('wizard_raw'));
          this.constructWizard(wizard);
          this.followUp2();
        });
      }
    }
  }

  constructWizard(input: Array<any>) {
    //Eingabe ist der String aus der JSON Datei
    var result = Array<WizardStage>();
    // console.log('1');
    var count = input['count'];
    for (let i = 0; i < count; i++) {
      var single = input[i];
      var id = single['id'];
      var fragen = Array<Fragen>();
      //console.log('2');
      var fragen_count = single['fragen']['count'];
      for (let j = 0; j < fragen_count; j++) {
        var frage = single['fragen'][j]['frage'];
        var inputs_raw = single['fragen'][j]['input'];
        var conditions_raw = single['fragen'][j]['conditions'];
        //console.log('3');
        var cond1 = single['fragen'][j]['conditions']['count'];
        //Anzahl der Möglichkeiten
        var conditions = Array<any>();
        for (let j2 = 0; j2 < cond1; j2++) {
          var route = single['fragen'][j]['conditions'][j2];
          var level_value = Array<any>();
          //console.log(route);
          var id2 = single['fragen'][j]['conditions'][j2]['count'];
          for (let j25 = 0; j25 < id2; j25++) {
            //Jeder Wert gibt die Schicht an, in der diese Antwort gegeben sein muss.
            //console.log(route[j25]);
            var stage_value = Array<any>();
            //console.log(route[j25]);
            stage_value.push(route[j25]['count']);
            if (route[j25]['count'] > 0) {
              for (let j3 = 0; j3 < route[j25]['count']; j3++) {
                stage_value.push(route[j25][j3]);
              }
            }
            level_value.push(stage_value);
          }
          conditions.push(level_value);
        }
        //console.log('5');
        var inputs_count = inputs_raw['count'];
        var inputs = Array<Input>();
        for (let k = 0; k < inputs_count; k++) {
          var type = inputs_raw[k]['type'];
          var name = inputs_raw[k]['name'];
          var options = Array<string>();
          var options_count = inputs_raw[k]['options']['count'];
          if (options_count > 0) {
            for (let k2 = 0; k2 < options_count; k2++) {
              options.push(inputs_raw[k]['options'][k2]);
            }
          }

          var required = inputs_raw[k]['required'];
          var disallowed = Array<string>();
          var disallowed_count = inputs_raw[k]['disallowed']['count'];
          if (disallowed_count > 0) {
            for (let k2 = 0; k2 < disallowed_count; k2++) {
              disallowed.push(inputs_raw[k]['disallowed'][k2]);
            }
          }
          inputs.push(new Input(type, options, required, disallowed, name));
        }
        fragen.push(new Fragen(frage, inputs, conditions));
      }
      var erklaerung = [
        single['erklaerung'],
        single['erklaerung_title'],
        single['erklaerung_link'],
      ];
      result.push(
        new WizardStage(fragen, erklaerung[0], erklaerung[1], erklaerung[2], id)
      );
    }
    localStorage.setItem('wizard', JSON.stringify(result));
    //console.log(result);
  }

  followUp() {
    console.log('Clean Up');
    //Endpunkte sind geladen
    //Menü ist geladen
    //Labels sind geladen
    //Sprachen sind geladen

    //Refresh Menue
    setupDOM(this.router);

    //this.router.navigate(['startseite'], {});
  }

  followUp2() {
    console.log('Clean Up');
    //Endpunkte sind geladen
    //Menü ist geladen
    //Labels sind geladen
    //Sprachen sind geladen

    //Refresh Menue
    setupDOM(this.router);
    this.startupChain(1);

    //this.router.navigate(['startseite'], {});
  }

  sub(x: number) {
    console.log('Inner Api:' + x);
    if (sessionStorage.getItem('DEV') == 'true') {
      sub(x);
    }
  }

  langswitch(lang: string) {
    langswitch(lang);
  }

  innerRouting(route: string) {
    this.router.navigate(['/', route], {});
  }
  loadMenue(router: Router) {
    loadMenue(router);
  }

  setupDOM(router: Router) {
    if (sessionStorage.getItem('DEV')) {
      sessionStorage.setItem('DEV', 'true');
    } else {
      sessionStorage.setItem('DEV', 'false');
    }
    setupDOM(router);
  }

  reconstructMiethistorie(): Miethistorie {
    console.log('reconstructMiethistorie');
    var aktuell = JSON.parse(sessionStorage.getItem('aktuelle_miethistorie'));
    //console.log(aktuell);
    var count1 = aktuell['count'];
    var mieten_aktuell = Array<Mieten>();
    for (let i = 0; i < count1; i++) {
      var miete = aktuell[i];
      var rechnungen_liste = Array<Rechnungen>();
      var rechnungs_count1 = miete['rechnungsids']['count'];
      for (let j = 0; j < rechnungs_count1; j++) {
        var Rechnung = new Rechnungen(miete['rechnungsids'][j]['id']);
        //console.log(Rechnung);
        rechnungen_liste.push(Rechnung);
      }
      mieten_aktuell.push(
        new Mieten(
          miete['enddatum'],
          miete['geraeteid'],
          miete['id'],
          miete['lieferadresse'],
          miete['produktid'],
          miete['produktname'],
          miete['standortgerken'],
          miete['startdatum'],
          rechnungen_liste,
          miete['bild'],
          miete['slug'],
          miete['abholung'],
          miete['bedienung'],
          new Standort(
            miete['standort']['name'],
            miete['standort']['strasse'],
            miete['standort']['hausnummer'],
            miete['standort']['plz'],
            miete['standort']['stadt'],
            miete['standort']['land']
          )
        )
      );
    }

    var vergangen = JSON.parse(
      sessionStorage.getItem('vergangene_miethistorie')
    );
    //console.log(vergangen);
    var count2 = vergangen['count'];
    var mieten_vergangen = Array<Mieten>();
    for (let i = 0; i < count2; i++) {
      var miete = vergangen[i];
      var rechnungen_liste2 = Array<Rechnungen>();
      var rechnungs_count2 = miete['rechnungsids']['count'];
      for (let j = 0; j < rechnungs_count2; j++) {
        rechnungen_liste2.push(new Rechnungen(miete['rechnungsids'][j]['id']));
      }
      mieten_vergangen.push(
        new Mieten(
          miete['enddatum'],
          miete['geraeteid'],
          miete['id'],
          miete['lieferadresse'],
          miete['produktid'],
          miete['produktname'],
          miete['standortgerken'],
          miete['startdatum'],
          rechnungen_liste2,
          miete['bild'],
          miete['slug'],
          miete['abholung'],
          miete['bedienung'],
          new Standort(
            miete['standort']['name'],
            miete['standort']['strasse'],
            miete['standort']['hausnummer'],
            miete['standort']['plz'],
            miete['standort']['stadt'],
            miete['standort']['land']
          )
        )
      );
    }

    var result = new Miethistorie(mieten_aktuell, mieten_vergangen);
    //console.log(result);
    console.log('done reconstruction');
    return result;
  }

  makeid(integ: number): string {
    return makeid(integ);
  }

  constructBewertung(data: any, mode: string): HTMLElement {
    var div = document.createElement('div');
    div.classList.add('rating-stars');
    div.classList.add('text-center');

    var ul = document.createElement('ul');
    ul.id = 'stars';
    var rel = data[mode];
    for (let i = 0; i < 5; i++) {
      var li = document.createElement('li');
      li.classList.add('star');
      if (i == 0) {
        li.title = 'Poor';
      }
      if (i == 1) {
        li.title = 'Fair';
      }
      if (i == 2) {
        li.title = 'Good';
      }
      if (i == 3) {
        li.title = 'Excellent';
      }
      if (i == 4) {
        li.title = 'WOW!!!';
      }
      li.setAttribute('data-value', (i + 1).toString());
      if (i < rel) {
        li.classList.add('selected');
      }
      var i_ele = document.createElement('i');
      i_ele.classList.add('fa');
      i_ele.classList.add('fa-star');
      i_ele.classList.add('fa-fw');
      li.appendChild(i_ele);
      ul.appendChild(li);
    }
    div.appendChild(ul);
    return div;
  }

  constructHTML(mode: string, data_raw: any): HTMLElement {
    //console.log('constructHTML');
    //Links bitte nachreichen
    if (mode == 'easycopy') {
      var div = document.createElement('div');

      return div;
    }
    if (mode == 'bewertung') {
      var hash = this.makeid(7);
      var div = document.createElement('div');
      div.classList.add('Bewertung-Single');
      var modal = document.createElement('div');
      modal.classList.add('modal');
      modal.id = 'id_modal_comment_' + hash;

      var h3 = document.createElement('h3');
      h3.innerHTML =
        'Bewertung von ' +
        data_raw['name'] +
        ' vom ' +
        data_raw['date'].replace('-', '.').replace('-', '.');

      modal.appendChild(h3);
      var form = document.createElement('form');
      var h6 = document.createElement('h6');
      h6.innerHTML = 'Service';
      modal.appendChild(h6);
      var service = this.constructBewertung(data_raw, 'service');
      modal.appendChild(service);

      var h6 = document.createElement('h6');
      h6.innerHTML = 'Funktionalität';
      modal.appendChild(h6);
      var funktionalitat = this.constructBewertung(data_raw, 'funktionalitat');
      modal.appendChild(funktionalitat);

      var h6 = document.createElement('h6');
      h6.innerHTML = 'Sauberkeit';
      modal.appendChild(h6);
      var sauberkeit = this.constructBewertung(data_raw, 'sauberkeit');
      modal.appendChild(sauberkeit);

      var h6 = document.createElement('h6');
      h6.innerHTML = 'Pünktliche Lieferung';
      modal.appendChild(h6);
      var punktlichkeit = this.constructBewertung(data_raw, 'punktlichkeit');
      modal.appendChild(punktlichkeit);

      var h6 = document.createElement('h6');
      h6.innerHTML = 'Bestellprozess';
      modal.appendChild(h6);
      var bestellprozess = this.constructBewertung(data_raw, 'bestellprozess');
      modal.appendChild(bestellprozess);

      var label = document.createElement('label');
      label.innerHTML = 'Kommentar:';
      modal.appendChild(label);

      var comment = document.createElement('p');
      comment.innerHTML = data_raw['comment'];
      modal.appendChild(comment);

      var bewertung = document.createElement('div');
      bewertung.classList.add('product');
      bewertung.setAttribute('data-hash', hash);

      var durchschnitt: number =
        (parseInt(data_raw['service']) +
          parseInt(data_raw['funktionalitat']) +
          parseInt(data_raw['sauberkeit']) +
          parseInt(data_raw['punktlichkeit']) +
          parseInt(data_raw['bestellprozess'])) /
        5;
      var durchschnitta = durchschnitt;
      var durchschnittb = durchschnitt;
      var durchschnittc = durchschnitta.toFixed(2);
      var durchschnittd = durchschnittb.toFixed(0);
      console.log('Durchschnitt: ' + durchschnittc + ' , ' + durchschnittd);
      var result = document.createElement('div');
      result.innerHTML =
        '<p class="stars stars-' +
        durchschnittd +
        '">' +
        durchschnittc +
        '/5</p><br><p><em>' +
        data_raw['name'] +
        ' schrieb am ' +
        data_raw['date'].replace('-', '.').replace('-', '.') +
        ':</em><br/>' +
        data_raw['comment'] +
        '</p>';

      bewertung.appendChild(result);
      /*
      var div4 = document.createElement('div');
      div4.classList.add('product-actions');
      div4.innerHTML +=
        '<a data-fancybox data-src="#id_modal_comment_' +
        hash +
        "' data-options='{" +
        "'touch' : false" +
        "}' href='javascript:void(0);' class='btn'>Details</a>";

      bewertung.appendChild(div4);
      */
      div.addEventListener('click', function (event) {
        $.fancybox.open({
          touch: false,
          src: '#id_modal_comment_' + hash,
          type: 'inline',
          opts: {},
        });
      });
      div.appendChild(modal);
      div.appendChild(bewertung);
      return div;
    }
    if (mode == 'empfalt') {
      /*
      <div class="product">
	<div class="product-image">
		<img src="images/_temp/product.jpg">
	</div>
	<div class="product-text">
		<p><strong>Lorem ipsum dolor sit amet, consetetur sadipscing</strong><br>
		Sed diam nonumy eirmod tempor invidunt ut labore et dolore</p>
	</div>
	<div class="product-actions">
		<a href="#" class="btn">Details</a>
		<a href="#" class="btn">Erneut mieten</a>
	</div>
</div>
      */
      var hash = this.makeid(7);
      var div = document.createElement('div');
      div.classList.add('product');
      div.setAttribute('data-hash', hash);

      var div2 = document.createElement('div');
      div2.classList.add('product-image');
      console.log(data_raw);
      div2.innerHTML = '<img src="' + data_raw['bild'].split('|')[0] + '">';
      div.appendChild(div2);

      var div3 = document.createElement('div');
      if (!data_raw['beschreibung']) {
        data_raw['beschreibung'] = '';
      }
      div3.innerHTML =
        '<p><strong>' +
        data_raw['produkt'] +
        '</strong><br>' +
        data_raw['beschreibung'] +
        '</p>';

      div.appendChild(div3);

      var div4 = document.createElement('div');
      div4.classList.add('product-actions');
      div4.innerHTML += '<a id="a' + hash + '" class="btn">Details</a>';
      div4.innerHTML +=
        '<a id="b' + hash + '" class="btn">Wechseln zu diesem Produkt</a>';

      div.appendChild(div4);
      return div;
    }
    if (mode == 'orderstate') {
      var open = true;
      var days = 1;
      var zeit = JSON.parse(sessionStorage.getItem('ZEIT'));
      console.log(zeit);
      if (zeit[7]) {
        var days = parseInt(zeit[7]);
        open = false;
      }
      console.log('Tage: ' + days);
      var data70 = data_raw;
      console.log(data70);
      var index = parseInt(data70['id']) + 1;
      var div = document.createElement('div');
      var h6 = document.createElement('h6');
      h6.innerHTML = 'Position ' + index;
      div.appendChild(h6);

      var table = document.createElement('table');
      //Produkt
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      //console.log(data70[0][0]["produkt"]);
      td1.innerHTML = data70['produkt']['name'];
      tr.appendChild(td1);

      var td2 = document.createElement('td');
      if (!data70['produkt']['preis']) {
        data70['produkt']['preis'] = '0';
      }
      var preis = parseFloat(data70['produkt']['preis']);
      var anzahl = parseInt(data70['produkt']['anzahl']);
      td2.innerHTML = (days * anzahl * preis).toFixed(2) + '€';
      tr.appendChild(td2);
      table.appendChild(tr);

      var tr_vers = document.createElement('tr');
      var td1_vers = document.createElement('td');
      //console.log(data70[0][0]["produkt"]);
      td1_vers.innerHTML = data70['versicherung']['title'];
      tr_vers.appendChild(td1_vers);

      var td2_vers = document.createElement('td');
      var preis = parseFloat(data70['versicherung']['preis']);
      td2_vers.innerHTML = preis.toFixed(2) + '€';
      tr_vers.appendChild(td2_vers);
      table.appendChild(tr_vers);
      if (data70['zubehoer']) {
        for (let i = 0; i < data70['zubehoer'].length; i++) {
          var tr2 = document.createElement('tr');
          var td1b = document.createElement('td');
          td1b.innerHTML = data70['zubehoer'][i]['name'];
          var td2b = document.createElement('td');
          var preis = parseFloat(data70['zubehoer'][i]['preis']);
          var anzahl = parseInt(data70['zubehoer'][i]['anzahl']);
          td2b.innerHTML = (days * anzahl * preis).toFixed(2) + '€';
          tr2.appendChild(td1b);
          tr2.appendChild(td2b);
          table.appendChild(tr2);
        }
      }
      if (data70['bundles']) {
        for (let i = 0; i < data70['bundles'].length; i++) {
          var tr2 = document.createElement('tr');
          var td1b = document.createElement('td');
          var parts = data70['bundles'][i]['name'].split('|xx|');
          if (parts[0] == data70['produkt']['name']) {
            data70['bundles'][i]['name'] = parts[1];
          } else {
            data70['bundles'][i]['name'] = parts[0];
          }
          td1b.innerHTML = 'Bundle: ' + data70['bundles'][i]['name'];
          var td2b = document.createElement('td');
          if (!data70['bundles'][i]['preis']) {
            data70['bundles'][i]['preis'] = '0';
          }
          var preis = parseFloat(data70['bundles'][i]['preis']);
          var anzahl = parseInt(data70['bundles'][i]['anzahl']);
          td2b.innerHTML = (days * anzahl * preis).toFixed(2) + '€';
          tr2.appendChild(td1b);
          tr2.appendChild(td2b);
          table.appendChild(tr2);

          var tr3 = document.createElement('tr');
          var td1c = document.createElement('td');
          td1c.innerHTML = data70['bundles'][i]['title_versicherung'];
          var preis = parseFloat(data70['bundles'][i]['preis_versicherung']);
          var td2c = document.createElement('td');
          td2c.innerHTML = preis.toFixed(2) + '€';

          tr3.appendChild(td1c);
          tr3.appendChild(td2c);
          table.appendChild(tr3);
        }
      }
      var tr = document.createElement('tr');
      tr.classList.add('sum');

      var td1 = document.createElement('td');
      td1.innerHTML = 'Zwischensumme';

      var td2 = document.createElement('td');
      td2.innerHTML =
        (days * parseFloat(data70['gesamtpreis'])).toFixed(2) + '€';

      tr.appendChild(td1);
      tr.appendChild(td2);
      table.appendChild(tr);

      div.appendChild(table);

      return div;
    }
    if (mode == 'faq') {
      var hash = this.makeid(7);
      var data = data_raw as Mieten;
      var div1 = document.createElement('div');
      div1.classList.add('product');
      div1.setAttribute('data-hash', hash);

      //Bild
      var div2 = document.createElement('div');
      div2.classList.add('product-image');
      var img = document.createElement('img');
      img.src = data.bild;
      div2.appendChild(img);
      div1.appendChild(div2);

      //Text
      var div3 = document.createElement('div');
      div3.classList.add('product-text');
      var p = document.createElement('p');
      var miettext = '';
      var date = new Date();
      var timestamp = date.getTime();

      var date2 = new Date(data.enddatum);
      var timestamp2 = date2.getTime();
      var newdate =
        data.enddatum.split('-')[2] +
        '.' +
        data.enddatum.split('-')[1] +
        '.' +
        data.enddatum.split('-')[0];
      if (timestamp < timestamp2) {
        miettext = 'gemietet bis ' + newdate;
      } else {
        miettext = 'zuletzt gemietet ' + newdate;
      }
      p.innerHTML =
        '<strong>' + data.produktname + '</strong><br />' + miettext;
      div3.appendChild(p);
      div1.appendChild(div3);

      //Links
      var div4 = document.createElement('div');
      div4.classList.add('product-actions');
      var a1 = document.createElement('a');
      a1.classList.add('btn');
      a1.innerHTML = 'Details';
      a1.id = hash;
      a1.setAttribute('data-slug', data.slug);

      div4.appendChild(a1);
      div1.appendChild(div4);
      return div1;
    }
    if (mode == 'standortm') {
      var div = document.createElement('div');
      div.classList.add('radio-wrapper');

      var label = document.createElement('label');
      label.innerHTML = data_raw['title'] + '<br />';
      label.innerHTML += data_raw['strasse'] + '<br />';
      label.innerHTML += data_raw['plz'] + ' ' + data_raw['stadt'] + '<br />';
      label.innerHTML +=
        'Entfernung zur gewählten PLZ: ' + data_raw['distance'] + ' km';
      label.innerHTML +=
        '<input type="radio" name="filiale" id="' +
        data_raw['id'] +
        '" value="1"/>';
      label.innerHTML += '<span class="checkmark checkmark-radio"></span>';

      div.appendChild(label);
      return div;
    }
    if (mode == 'calendar') {
      //console.log(data_raw);
      var a = document.createElement('a');
      a.classList.add('day');
      a.id = data_raw['id'];
      if (data_raw['status'] == 'start' || data_raw['status'] == 'ende') {
        a.classList.add('visible');
      } else {
        if (data_raw['status'] == 'min') {
          a.classList.add('min');
          a.classList.add('active');
        }
      }
      var span1 = document.createElement('span');
      span1.classList.add('flag-wrapper');
      span1.innerHTML = '<span class="flag">' + data_raw['value'] + '</span>';
      var span2 = document.createElement('span');
      span2.classList.add('balken');
      var screen = window.innerHeight * 0.3;
      //console.log('Screen: ' + screen);
      var min = parseFloat(data_raw['min']);
      var max = parseFloat(data_raw['max']);
      var value = parseFloat(data_raw['value']);
      //min->0.3
      var max_height = screen;
      var height = screen / max;
      //console.log('Height 1: ' + height);
      height = height * value;
      var height_int = parseInt(height.toString());
      //console.log('Height 2: ' + height_int);

      span2.setAttribute('style', 'height:' + height_int + 'px;');

      var span3 = document.createElement('span');
      span3.classList.add('info');
      var day = data_raw['day'];
      day = day.replace('Monday', 'Mo');
      day = day.replace('Tuesday', 'Di');
      day = day.replace('Wednesday', 'Mi');
      day = day.replace('Thursday', 'Do');
      day = day.replace('Friday', 'Fr');
      day = day.replace('Saturday', 'Sa');
      day = day.replace('Sunday', 'So');

      span3.innerHTML = day + '<br />' + data_raw['day2'];

      a.appendChild(span1);
      a.appendChild(span2);
      a.appendChild(span3);

      return a;
    }
    if (mode == 'ProduktOverview1') {
      var div = document.createElement('div');
      div.classList.add('product');

      var div2 = document.createElement('div');
      div2.classList.add('product-image');

      var img = document.createElement('img');
      img.src = data_raw['bild'].split('|')[0];

      div2.appendChild(img);

      if (!data_raw['beschreibung']) {
        data_raw['beschreibung'] = '';
      }

      var div3 = document.createElement('div');
      div3.classList.add('product-text');
      div3.innerHTML =
        '<p><strong>' +
        data_raw['produkt'] +
        '</strong><br>' +
        data_raw['beschreibung'] +
        '</p>';

      var div4 = document.createElement('div');
      div4.classList.add('product-actions');

      var h4 = document.createElement('h4');
      if (!data_raw['preis']) {
        data_raw['preis'] = '0|0';
      }
      h4.innerHTML = '';

      var a = document.createElement('a');
      a.id = 'produkt' + data_raw['uid'] + '-' + data_raw['hauptkategorie'];
      a.classList.add('btn');
      a.classList.add('produktlink');
      a.setAttribute('data-link', data_raw['slug']);
      //a.href = '/mietprozess/standort/' + data_raw['slug'];
      a.innerHTML = 'Auswählen';
      var router = this.router;
      a.addEventListener('click', function (event: any) {
        var dest = '/mietprozess/standorte/';
        if (
          sessionStorage.getItem('STANDORT') &&
          sessionStorage.getItem('STANDORT') != 'undefined'
        ) {
          console.log('STANDORT GEFUNDEN');
          dest = '/mietprozess/zeit/';
        }
        if (sessionStorage.getItem('ZEIT')) {
          console.log('ZEIT GEFUNDEN');
          dest = '/mietprozess/empfehlung/';
        }
        router.navigate([dest, data_raw['slug']], {});
        event.preventDefault();
      });

      var a2 = document.createElement('a');
      a2.classList.add('btn');
      //a.href = '/mietprozess/standort/' + data_raw['slug'];
      a2.innerHTML = 'Details';

      a2.addEventListener('click', function (event) {
        router.navigate(['produktdetailseite/' + data_raw['slug']], {});
      });

      div4.appendChild(h4);
      div4.appendChild(a);
      div4.appendChild(a2);

      div.appendChild(div2);
      div.appendChild(div3);
      div.appendChild(div4);

      return div;
    }
    if (mode == 'ProduktOverview2') {
      var div = document.createElement('div');
      div.classList.add('product');

      var div2 = document.createElement('div');
      div2.classList.add('product-image');

      var img = document.createElement('img');
      img.src = data_raw['bild'].split('|')[0];

      div2.appendChild(img);

      if (!data_raw['beschreibung']) {
        data_raw['beschreibung'] = '';
      }

      var div3 = document.createElement('div');
      div3.classList.add('product-text');
      div3.innerHTML =
        '<p><strong>' +
        data_raw['produkt'] +
        '</strong><br>' +
        data_raw['beschreibung'] +
        '</p>';

      var div4 = document.createElement('div');
      div4.classList.add('product-actions');

      var h4 = document.createElement('h4');
      if (!data_raw['preis']) {
        data_raw['preis'] = '0|0';
      }
      h4.innerHTML = 'Ab ' + data_raw['preis'].split('|')[0] + ',-€/Tag';

      var a = document.createElement('a');
      a.id = 'produkt' + data_raw['uid'] + '-' + data_raw['hauptkategorie'];
      a.classList.add('btn');
      a.classList.add('produktlink');
      a.setAttribute('data-link', data_raw['slug']);
      //a.href = '/mietprozess/standort/' + data_raw['slug'];
      a.innerHTML = 'Auswählen';
      var router = this.router;
      var env3 = this;
      a.addEventListener('click', function (event: any) {
        var url = window.location;

        let currentUrl = router.url;
        console.log('URL(Java): ' + url + ', URL(Angular): ' + currentUrl);

        var url = window.location;
        var lg = '&login=false';
        if (sessionStorage.getItem('Usertoken')) {
          lg = '&login=true';
        }
        //console.log(url.href);
        //console.log(url.pathname);
        var link = url.href;
        if (url.pathname != '/') {
          link = url.href.split(url.pathname)[0];
        }

        if (url.pathname.includes('geraete-mieten')) {
          link += '/geraete-mieten/mietprozess/auswahl/' + data_raw['slug'];
          console.log('Final Link');
          window.location.href = link;
        } else {
          router.navigate(['mietprozess/auswahl', data_raw['slug']], {});
        }

        //env3.reload();
        //event.preventDefault();
      });

      var a2 = document.createElement('a');
      a2.classList.add('btn');
      //a.href = '/mietprozess/standort/' + data_raw['slug'];
      a2.innerHTML = 'Details';

      a2.addEventListener('click', function (event) {
        router.navigate(['produktdetailseite/' + data_raw['slug']], {});
      });

      div4.appendChild(h4);
      div4.appendChild(a);
      div4.appendChild(a2);

      div.appendChild(div2);
      div.appendChild(div3);
      div.appendChild(div4);

      return div;
    }
    if (mode == 'ProduktAdditional1') {
      if (!data_raw['beschreibung']) {
        data_raw['beschreibung'] = '';
      }
      var hash = makeid(10);
      var hash2 = makeid(10);
      var div = document.createElement('div');
      div.classList.add('product');
      div.setAttribute('data-hash', data_raw['id']);
      div.setAttribute('data-hash2', hash2);
      div.setAttribute('data-hash7', data_raw['slug']);
      div.id = 'b' + data_raw['id'] + 'z';

      var div2 = document.createElement('div');
      div2.classList.add('product-image');

      var img = document.createElement('img');
      img.src = data_raw['bild'].split('|')[0];

      div2.appendChild(img);
      div.appendChild(div2);

      var div3 = document.createElement('div');
      div3.classList.add('product-text');
      div3.innerHTML =
        '<p><strong>' + data_raw['produkt'] + '</strong><br /></p>';

      var h4 = document.createElement('h4');
      h4.id = data_raw['id'];
      if (!data_raw['preis']) {
        data_raw['preis'] = '0|0';
      }
      h4.innerHTML = 'Ab ' + data_raw['preis'].split('|')[0] + '€/Tag';

      div3.appendChild(h4);
      div.appendChild(div3);

      var div4 = document.createElement('div');
      div4.classList.add('product-actions');
      div4.setAttribute('style', 'width:100%;');

      var a7 = document.createElement('a');
      a7.classList.add('btn');
      a7.classList.add('btn-outline');
      a7.innerHTML = 'Details';
      a7.id = hash2;

      div4.appendChild(a7);

      var select = document.createElement('select');
      select.id = 'b' + data_raw['id'];
      select.classList.add('formularinput');
      select.setAttribute('data-produkt', data_raw['produkt']);
      select.innerHTML =
        '<option>Anzahl wählen...</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>';
      div4.appendChild(select);
      div.appendChild(div4);

      return div;
    }
    if (mode == 'ProduktAdditional2') {
      var hash = makeid(10);
      var div = document.createElement('div');
      div.classList.add('radio-checkbox-wrapper');
      div.setAttribute('data-hash', data_raw['id']);
      var label = document.createElement('label');
      label.classList.add('with-price');
      data_raw['text'] = data_raw['text'].replace('', '€');
      label.innerHTML = data_raw['text'];

      var input = document.createElement('input');
      input.classList.add('formularinput');
      input.classList.add('versicherung1');
      input.setAttribute('data-wert', data_raw['preis']);
      input.type = 'radio';
      input.value = 'OK';
      //input.name = 'xxx';
      input.id = data_raw['id'];

      /*
      if(label.innerHTML.includes("1000,00€")){
        console.log("found");
         input.checked=true; 
      }
      */

      var span1 = document.createElement('span');
      span1.classList.add('checkmark');
      span1.classList.add('checkmark-checkbox');

      var span2 = document.createElement('span');
      span2.classList.add('price');
      span2.innerHTML = data_raw['preis'] + '€';

      label.appendChild(input);
      label.appendChild(span1);
      label.appendChild(span2);

      div.appendChild(label);
      div.innerHTML += '<div style="clear:both;"><div></div></div>';

      return div;
    }
    if (mode == 'Miethistorie') {
      var data = data_raw[1] as Mieten;
      var router = data_raw[0] as Router;
      var data_beta = data_raw[2];
      var env = data_raw[3];
      console.log(data_beta);
      var div1 = document.createElement('div');
      div1.classList.add('product');

      //Bild
      var div2 = document.createElement('div');
      div2.classList.add('product-image');
      var img = document.createElement('img');
      img.src = data.bild;
      div2.appendChild(img);
      div1.appendChild(div2);

      //Text
      var div3 = document.createElement('div');
      div3.classList.add('product-text');
      var p = document.createElement('p');
      var miettext = '';
      var date = new Date();
      var timestamp = date.getTime();

      var date2 = new Date(data.enddatum);
      console.log('DATEN');
      console.log(date);
      console.log(date2);
      var timestamp2 = date2.getTime();
      var newdate =
        data.enddatum.split('-')[2] +
        '.' +
        data.enddatum.split('-')[1] +
        '.' +
        data.enddatum.split('-')[0];
      if (timestamp < timestamp2) {
        miettext = 'gemietet bis ' + newdate;
      } else {
        miettext = 'zuletzt gemietet ' + newdate;
      }
      console.log(data_beta);
      if (data_beta['offen'] == true && data_beta['enddatum'] == '') {
        miettext = 'offenes Mietende';
      }
      p.innerHTML =
        '<strong>' + data.produktname + '</strong><br />' + miettext;
      div3.appendChild(p);
      div1.appendChild(div3);

      //Links
      var div4 = document.createElement('div');
      div4.classList.add('product-actions');
      var a1 = document.createElement('a');
      a1.classList.add('btn');
      a1.innerHTML = 'Details';
      a1.id = makeid(7);
      a1.addEventListener('click', function (event) {
        router.navigate(['/produktdetailseite', data.slug], {});
        event.preventDefault();
      });

      var a2 = document.createElement('a');
      a2.classList.add('btn');
      a2.innerHTML = 'Miete verlängern';
      if (timestamp >= timestamp2) {
        a2.innerHTML = 'Erneut mieten';
      }
      a2.id = makeid(7);
      a2.setAttribute('data-produkt-slug', data_beta['slug']);
      a2.setAttribute('data-produkt-produkt', data_beta['produkt']);
      a2.setAttribute('data-ende', data_beta['offen']);
      a2.addEventListener('click', function (event) {
        //router.navigate(['/mietprozess', 'miethistorie', data.slug], {});
        if (this.innerHTML == 'Miete verlängern') {
          var offen = this.getAttribute('data-ende');
          var slug = this.getAttribute('data-produkt-slug');
          console.log(offen);
          console.log(slug);
          if (offen == 'true') {
            console.log('Modal öffnen mit Denial');
            document.getElementById('miethistorie_form').style.display = 'none';
            document.getElementById('nomore').style.display = 'block';
          } else {
            console.log('Modal öffnen mit Zeitauswahl');
            document.getElementById('miethistorie_form').style.display =
              'block';
            document.getElementById('nomore').style.display = 'none';
          }
          //scroll(0, 0);
          $.fancybox.open({
            touch: false,
            src: '#id_modal_miethistorie',
            type: 'inline',
            opts: {
              touch: false,
            },
          });
        }
        if (this.innerHTML == 'Erneut mieten') {
          var offen = this.getAttribute('data-ende');
          var slug = this.getAttribute('data-produkt-slug');
          var produkt = this.getAttribute('data-produkt-produkt');
          console.log(offen);
          console.log(slug);
          console.log('Weiterleitung zu Zeitauswahl');
          var dest = '/mietprozess/standorte/';
          if (
            sessionStorage.getItem('STANDORT') &&
            sessionStorage.getItem('STANDORT') != 'undefined'
          ) {
            console.log('STANDORT GEFUNDEN');
            dest = '/mietprozess/zeit/';
          }
          if (sessionStorage.getItem('ZEIT')) {
            console.log('ZEIT GEFUNDEN');
            dest = '/mietprozess/empfehlung/';
            sessionStorage.setItem('wayward_para1', slug);
          }
          if (!localStorage.getItem('Produkt' + slug)) {
            var input = env.apiService.generateInput(['slug', slug]);
            env.apiService
              .postEndpunkt(input, 'produktbyslug')
              .subscribe((data) => {
                console.log(data);
                localStorage.setItem(
                  'Produkt' + slug,
                  JSON.stringify(data['produkt'])
                );
                //marker
                sessionStorage.setItem('wayward', 'historie');
                console.log(dest + ', ' + slug);
                console.log(localStorage.getItem('Produkt' + slug));
                router.navigate([dest, slug], {});
              });
          } else {
            sessionStorage.setItem('wayward', 'historie');
            console.log(dest + ', ' + slug);
            console.log(localStorage.getItem('Produkt' + slug));
            router.navigate([dest, slug], {});
          }
        }
        event.preventDefault();
      });
      div4.appendChild(a1);
      div4.appendChild(a2);
      div1.appendChild(div4);
      return div1;
    }
    if (mode == 'Rechnungsadressen2') {
      var data7 = data_raw[1] as Array<any>;
      //console.log(data7);
      var router = data_raw[0] as Router;

      var backup = new Array<any>();
      if (!data7['name']) {
        backup = data7;
      } else {
        backup.push(data7['name']);
        backup.push(data7['strasse']);
        backup.push(data7['plz']);
        backup.push(data7['ort']);
        backup.push(data7['aktive']);
        backup.push(data7['id']);
        backup.push(data7['land']);
        backup.push(data7['zusatz']);
      }
      var label = document.createElement('label');
      label.innerHTML =
        backup[0] +
        '<br />' +
        backup[1] +
        '<br />' +
        backup[2] +
        ' ' +
        backup[3];
      label.innerHTML +=
        '<input type="radio" name="rechnungsadresse" value="2" id="' +
        backup[5] +
        '" />';
      label.innerHTML += '<span class="checkmark checkmark-radio"></span>';
      return label;
    }
    if (mode == 'Rechnungsadressen') {
      var data7 = data_raw[1] as Array<any>;
      //console.log(data7);
      var router = data_raw[0] as Router;

      var backup = new Array<any>();
      if (!data7['name']) {
        backup = data7;
      } else {
        backup.push(data7['name']);
        backup.push(data7['strasse']);
        backup.push(data7['plz']);
        backup.push(data7['ort']);
        backup.push(data7['aktive']);
        backup.push(data7['id']);
        backup.push(data7['land']);
        backup.push(data7['zusatz']);
      }

      var div1 = document.createElement('div');
      div1.classList.add('adress-box');
      var hash = makeid(8);
      div1.id = 'a' + hash;
      div1.setAttribute('data-id', backup[5]);
      div1.setAttribute('data-hash', hash);

      var p = document.createElement('p');
      p.innerHTML =
        backup[0] +
        '<br />' +
        backup[1] +
        '<br />' +
        backup[2] +
        ' ' +
        backup[3] +
        '<br />';

      div1.appendChild(p);

      var a1 = document.createElement('a');
      a1.classList.add('edit');
      a1.innerHTML = '<span>Edit</span>';
      a1.href = 'javascript:void(0);';
      a1.setAttribute('data-hash', hash);
      var fallback7 =
        backup[0] +
        '|' +
        backup[1] +
        '|' +
        backup[2] +
        '|' +
        backup[3] +
        '|' +
        backup[4] +
        '|' +
        backup[5] +
        '|' +
        backup[6] +
        '|' +
        backup[7];
      a1.setAttribute('data-fallback', fallback7);
      a1.id = 'b' + hash;
      a1.classList.add('ede' + hash);

      div1.appendChild(a1);

      var a2 = document.createElement('a');
      a2.classList.add('delete');
      a2.innerHTML = '<span>Delete</span>';
      a2.href = 'javascript:void(0);';
      a2.setAttribute('data-hash', hash);
      a2.id = 'c' + hash;
      a2.classList.add('del' + hash);

      div1.appendChild(a2);

      div1.innerHTML += '<div style="clear:both;"><div></div></div>';
      return div1;
    }
    if (mode == 'Standorte') {
      var data7 = data_raw[1] as Array<any>;
      //console.log(data7);
      var router = data_raw[0] as Router;

      var backup = new Array<any>();
      if (!data7['name']) {
        backup = data7;
      } else {
        backup.push(data7['name']);
        backup.push(data7['strasse']);
        backup.push(data7['plz']);
        backup.push(data7['ort']);
        backup.push(data7['aktive']);
        backup.push(data7['id']);
        backup.push(data7['land']);
        backup.push(data7['zusatz']);
      }

      var div1 = document.createElement('div');
      div1.classList.add('adress-box');
      var hash = makeid(8);
      div1.id = 'a' + hash;
      div1.setAttribute('data-id', backup[5]);
      div1.setAttribute('data-hash', hash);

      var p = document.createElement('p');
      p.innerHTML =
        backup[0] +
        '<br />' +
        backup[1] +
        '<br />' +
        backup[2] +
        ' ' +
        backup[3] +
        '<br /> <strong>Aktive Geräte: ' +
        backup[4] +
        '</strong>';

      div1.appendChild(p);

      var a1 = document.createElement('a');
      a1.classList.add('edit');
      a1.innerHTML = '<span>Edit</span>';
      a1.href = 'javascript:void(0);';
      a1.setAttribute('data-hash', hash);
      var fallback7 =
        backup[0] +
        '|' +
        backup[1] +
        '|' +
        backup[2] +
        '|' +
        backup[3] +
        '|' +
        backup[4] +
        '|' +
        backup[5] +
        '|' +
        backup[6] +
        '|' +
        backup[7];
      a1.setAttribute('data-fallback', fallback7);
      a1.id = 'b' + hash;
      a1.classList.add('ede' + hash);

      div1.appendChild(a1);

      var a2 = document.createElement('a');
      a2.classList.add('delete');
      a2.innerHTML = '<span>Delete</span>';
      a2.href = 'javascript:void(0);';
      a2.setAttribute('data-hash', hash);
      a2.id = 'c' + hash;
      a2.classList.add('del' + hash);

      div1.appendChild(a2);

      div1.innerHTML += '<div style="clear:both;"><div></div></div>';
      return div1;
    }
    if (mode == 'Standorte2') {
      var data7 = data_raw[1] as Array<any>;
      //console.log(data7);
      var router = data_raw[0] as Router;

      var backup = new Array<any>();
      if (!data7['name']) {
        backup = data7;
      } else {
        backup.push(data7['name']);
        backup.push(data7['strasse']);
        backup.push(data7['plz']);
        backup.push(data7['ort']);
        backup.push(data7['aktive']);
        backup.push(data7['id']);
        backup.push(data7['land']);
        backup.push(data7['zusatz']);
      }

      var div1 = document.createElement('div');
      div1.classList.add('adress-box');
      var hash = makeid(8);
      div1.id = 'a' + hash;
      div1.setAttribute('data-id', backup[5]);
      div1.setAttribute('data-hash', hash);

      var p = document.createElement('p');
      p.innerHTML =
        backup[0] +
        '<br />' +
        backup[1] +
        '<br />' +
        backup[2] +
        ' ' +
        backup[3];

      div1.appendChild(p);

      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'mystandorte';
      radio.id = hash;
      radio.setAttribute('data-id', backup[5]);

      div1.appendChild(radio);
      div1.innerHTML += '<span class="checkmark checkmark-radio"></span>';

      div1.innerHTML += '<div style="clear:both;"><div></div></div>';
      return div1;
    }
    if (mode == 'Rechnungshistorie') {
      var data2 = data_raw[1] as Array<string>;
      //console.log(data2);
      var router = data_raw[0] as Router;

      var a = document.createElement('a');
      a.target = '_blank';
      a.href = data2['link'];
      a.classList.add('invoice');
      a.id = data2['rechnungsid'];
      a.setAttribute('data-standort', data2['standortgerken']);
      var zeitraum =
        data2['datum'].split('.')[1] + '.' + data2['datum'].split('.')[2];
      a.setAttribute('data-zeitraum', zeitraum);
      a.setAttribute('data-typ', data2['typ']);

      var p1 = document.createElement('p');
      p1.classList.add('nr');
      p1.innerHTML =
        '<strong>Rechnung #' +
        data2['rechnungsid'] +
        '</strong><br />' +
        data2['datum'];

      a.appendChild(p1);

      var p2 = document.createElement('p');
      p2.classList.add('amount');
      p2.innerHTML = '<strong>' + data2['preis'] + '€</strong>';

      a.appendChild(p2);

      a.innerHTML += '<div style="clear:both;"><div></div></div>';

      return a;
    }
    if (mode == 'Nutzerverwaltung') {
      var data5 = data_raw[1] as Array<any>;
      //console.log(data5);
      var router = data_raw[0] as Router;

      var hash = makeid(7);

      var div = document.createElement('div');
      div.setAttribute('data-hash', hash);
      div.id = 'c' + hash;
      //Adressbox
      var div2 = document.createElement('div');
      div2.classList.add('adress-box');
      if (!data5['name']) {
        return this.constructHTML('Nutzerverwaltung2', data_raw);
      }
      var p = document.createElement('p');
      p.innerHTML =
        data5['name'] +
        '<br /><a id="d' +
        hash +
        '" href=mailto:' +
        data5['email'] +
        '">' +
        data5['email'] +
        '</a><br />';

      var a17 = document.createElement('a');
      a17.href = 'javascript:void(0);';
      a17.innerHTML = '<span>Edit</span>';
      a17.classList.add('edit');
      a17.id = 'a17a' + hash;

      var a18 = document.createElement('a');
      a18.href = 'javascript:void(0);';
      a18.innerHTML = '<span>Delete</span>';
      a18.classList.add('delete');
      a18.id = 'a18a' + hash;

      sessionStorage.setItem('user_' + data5['email'], JSON.stringify(data5));

      div2.appendChild(p);
      div2.appendChild(a17);
      div2.appendChild(a18);
      div2.innerHTML += '<div style="clear:both;"><div></div></div>';
      div.appendChild(div2);
      return div;
    }
    if (mode == 'Nutzerverwaltung2') {
      var data5 = data_raw[1] as Array<any>;
      //console.log(data5);
      var router = data_raw[0] as Router;

      var hash = makeid(7);

      var div = document.createElement('div');
      div.setAttribute('data-hash', hash);
      div.setAttribute('data-name', data5[0]);
      div.setAttribute('data-email', data5[1]);
      div.id = 'c' + hash;
      //Adressbox
      var div2 = document.createElement('div');
      div2.classList.add('adress-box');

      var p = document.createElement('p');
      p.innerHTML =
        data5[0] +
        '<br /><a id="d' +
        hash +
        '" href=mailto:' +
        data5[1] +
        '">' +
        data5[1] +
        '</a><br />';

      var a17 = document.createElement('a');
      a17.href = 'javascript:void(0);';
      a17.innerHTML = '<span>Edit</span>';
      a17.classList.add('edit');
      a17.id = 'a17a' + hash;

      var a18 = document.createElement('a');
      a18.href = 'javascript:void(0);';
      a18.innerHTML = '<span>Delete</span>';
      a18.classList.add('delete');
      a18.id = 'a18a' + hash;

      sessionStorage.setItem('user_' + data5[1], JSON.stringify(data5));

      div2.appendChild(p);
      div2.appendChild(a17);
      div2.appendChild(a18);
      div2.innerHTML += '<div style="clear:both;"><div></div></div>';
      div.appendChild(div2);
      return div;
    }
    var fallback = document.createElement('div');
    return fallback;
  }

  reload() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  reconf(id1: string, id2: string, id3: string) {
    var plz = (document.getElementById(id1) as HTMLInputElement).value;
    if (plz.length == 5 || plz.length == 4) {
      var input = this.generateInput([['postleitzahl', plz]]);
      this.postEndpunkt(input, 'postleitzahl').subscribe((data) => {
        console.log(data);
        if (data['success']['city']) {
          (document.getElementById(id2) as HTMLInputElement).value =
            data['success']['city'];
        }
        if (document.getElementById(id3)) {
          if (data['success']['land']) {
            (document.getElementById(id3) as HTMLInputElement).value =
              data['success']['land'];
          }
        }
      });
    }
  }
}

function makeid(length: number): string {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function setupDOM(router: Router) {
  console.log('setupDom');
  sessionStorage.setItem('SetupStateAllowance', 'true');
  if (sessionStorage.getItem('SetupState') != 'complete') {
    var a = loadMenue(router);
    console.log('Menue Status: >>' + a + '<<');
    var b = loadSprachen();
    console.log('Sprachen Status: >>' + b + '<<');
    var c = loadLabels('Startseite');
    console.log('Labels Status: >>' + c + '<<');
    if (a && b && c) {
      sessionStorage.setItem('SetupState', 'complete');
    }
  }
}

function loadMenue(router: Router): boolean {
  console.log('Menü Start');
  console.log(JSON.parse(localStorage.getItem('kategorie')));
  if (document.getElementById('id_menu_wrapper')) {
    console.log('Richte Menü ein.');
    var lang = sessionStorage.getItem('language');
    if (!lang) {
      lang = 'DE';
    }
    var menuestring = localStorage.getItem('menue');
    //console.log(lang);
    var menue: Array<any> = JSON.parse(menuestring)[lang];

    var header: Array<any> = menue['Header'];

    var footer: Array<any> = menue['Footer'];
    console.log('HEADER');
    console.log(header);

    console.log('FOOTER');
    console.log(footer);

    //header
    var frame1 = document.getElementById('header1');
    var frame2 = document.getElementById('footer1a');
    var frame3 = document.getElementById('footer2a');
    console.log('check7');
    var count = header['count'];
    frame1.innerHTML = '';
    for (let i = 0; i < count; i++) {
      var li = document.createElement('li');
      li.id = makeid(9);
      if (
        !header[i]['only'] ||
        (header[i]['only'] && sessionStorage.getItem('Usertoken'))
      ) {
        if (header[i]['sub']) {
          li.classList.add('has-sub');
          li.innerHTML =
            '<a href="javascript:void(0);">' + header[i]['title'] + '</a>';
          var ul = document.createElement('ul');
          ul.id = makeid(8);
          ul.classList.add('sub');
          //li.appendChild(ul);
          var count2 = header[i]['sub']['count'];
          var list1 = Array<any>();
          for (let j = 0; j < count2; j++) {
            var li2 = document.createElement('li');
            if (
              !header[i]['sub'][j]['only'] ||
              (header[i]['sub'][j]['only'] &&
                sessionStorage.getItem('Usertoken'))
            ) {
              if (header[i]['sub'][j]['inside'] == true) {
                var hash = makeid(7);
                li2.innerHTML =
                  '<a href="javascript:void(0);" id="' +
                  hash +
                  '" data-link="' +
                  header[i]['sub'][j]['link'] +
                  '">' +
                  header[i]['sub'][j]['title'] +
                  '</a>';
                ul.appendChild(li2);
                list1.push(hash);
              } else {
                li2.innerHTML =
                  '<a href="' +
                  header[i]['sub'][j]['link'] +
                  '">' +
                  header[i]['sub'][j]['title'] +
                  '</a>';
                ul.appendChild(li2);
              }
            }
          }
          li.appendChild(ul);
          frame1.appendChild(li);
          document
            .getElementById(li.id)
            .addEventListener('click', function (event) {
              if ($(this).hasClass('active')) {
                $(this).removeClass('active');
              } else {
                $(this).addClass('active');
              }
              $(this).find('.sub').slideToggle();
            });
          for (let k = 0; k < list1.length; k++) {
            console.log(list1[k]);
            document
              .getElementById(list1[k])
              .addEventListener('click', function (event) {
                router.navigate([this.getAttribute('data-link')], {});
                console.log('drin 1');
                if ($('body').hasClass('open')) {
                  $('body').removeClass('open');
                  $('#id_overlay').fadeOut();
                  $('#id_menu_wrapper').fadeOut();
                }
              });
          }
        } else {
          console.log(header[i]['inside']);
          if (header[i]['inside'] == true) {
            var hash = makeid(7);
            li.innerHTML =
              '<a href="javascript:void(0);" id="' +
              hash +
              '" data-link="' +
              header[i]['link'] +
              '">' +
              header[i]['title'] +
              '</a>';
            frame1.appendChild(li);
            document
              .getElementById(hash)
              .addEventListener('click', function (event) {
                console.log('drin 2');
                router.navigate([this.getAttribute('data-link')], {});
                if ($('body').hasClass('open')) {
                  $('body').removeClass('open');
                  $('#id_overlay').fadeOut();
                  $('#id_menu_wrapper').fadeOut();
                }
              });
          } else {
            li.innerHTML =
              '<a href="' +
              header[i]['link'] +
              '">' +
              header[i]['title'] +
              '</a>';
            frame1.appendChild(li);
          }
        }
      }
    }

    var count = footer[1]['count'];
    frame2.innerHTML = '';
    for (let i = 0; i < count; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = footer[1][i]['link'];
      a.title = footer[1][i]['title'];
      a.innerHTML = footer[1][i]['title'];
      li.appendChild(a);
      frame2.appendChild(li);
    }

    var count = footer[0]['count'];
    frame3.innerHTML = '';
    for (let i = 0; i < count; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = footer[0][i]['link'];
      a.target = '_blank';
      a.title = footer[0][i]['title'];
      a.classList.add(footer[0][i]['title'].toLowerCase());
      a.innerHTML = '<span>' + footer[0][i]['title'] + '</span>';
      li.appendChild(a);
      frame3.appendChild(li);
    }

    //footer
    var frame4 = document.getElementById('footer1b');
    var frame5 = document.getElementById('footer2b');

    var count = footer[1]['count'];
    frame5.innerHTML = '';
    for (let i = 0; i < count; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = footer[1][i]['link'];
      a.title = footer[1][i]['title'];
      a.innerHTML = footer[1][i]['title'];
      li.appendChild(a);
      frame5.appendChild(li);
    }

    var count = footer[0]['count'];
    frame4.innerHTML = '';
    for (let i = 0; i < count; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = footer[0][i]['link'];
      a.target = '_blank';
      a.title = footer[0][i]['title'];
      a.classList.add(footer[0][i]['title'].toLowerCase());
      a.innerHTML = '<span>' + footer[0][i]['title'] + '</span>';
      li.appendChild(a);
      frame4.appendChild(li);
    }

    return true;
  } else {
    return false;
  }
}

function loadSprachen(): boolean {
  if (document.getElementById('language_whole')) {
    var lang = 'DE';
    if (sessionStorage.getItem('language')) {
      lang = sessionStorage.getItem('language');
    }
    var border = document.getElementById('language_whole');
    border.innerHTML = '';
    var first = document.createElement('a');
    first.href = 'javascript:void(0);';
    first.id = 'id_language_select';
    first.innerHTML = lang;
    first.onclick = function () {
      lang_tmp();
    };
    border.appendChild(first);
    sessionStorage.setItem('language', lang);
    var sprachen = JSON.parse(localStorage.getItem('sprachen'));
    var count = sprachen['count'];
    var list = Array<any>();
    for (let i = 0; i < count; i++) {
      list.push(sprachen[i]);
    }
    var rest = document.createElement('ul');
    rest.id = 'id_languages';
    for (let i = 0; i < list.length; i++) {
      if (list[i] != lang) {
        var entry = document.createElement('li');

        var innerstlink = document.createElement('a');
        innerstlink.href = 'javascript:void(0);';
        innerstlink.innerHTML = list[i];
        innerstlink.onclick = function () {
          langswitch(list[i]);
        };
        entry.appendChild(innerstlink);
        rest.appendChild(entry);
      }
    }
    border.appendChild(rest);
    return true;
  } else {
    return false;
  }
}

function loadLabels(title: string): boolean {
  if (document.getElementById(title)) {
    return true;
  } else {
    return false;
  }
}

function innerRouting(route: string) {
  //router.navigate(['/', route], {});
  console.log(route);
}

function langswitch(lang: string) {
  var reload = true;
  sessionStorage.setItem('language', lang);
  //console.log(sessionStorage.getItem('language'));
  if (localStorage.getItem(lang + '_changed')) {
    //var menue = JSON.parse(localStorage.getItem('Startseite_end'));
    var local_changed = parseInt(localStorage.getItem(lang + '_changed'));

    var endpunkt = JSON.parse(localStorage.getItem('language' + lang + '_end'));
    var endpunkt_changed = parseInt(endpunkt['changed']);
    if (local_changed >= endpunkt_changed) {
      reload = false;
    }
    loadSprachen();
  }
  if (reload) {
    //Wenn nichts aktuelles vorhanden ist, lade Sprache
    /*
    this.language(lang).subscribe((data) => {
      sessionStorage.setItem('language', lang);
      localStorage.setItem(lang + '_changed', data['changed']);
      var count = data['count'];
      for (let i = 0; i < count; i++) {
        var tmp = data[i];
        var name = tmp['title_element'] + '_' + lang;
        localStorage.setItem(name, JSON.stringify(tmp));
      }
      loadSprachen(lang);
    });
    */
    window.location.reload();
  }
}

function sub(x: number) {
  console.log('Outer Api:' + x);
  //if (sessionStorage.getItem('DEV') == 'true') {

  var subs = document.getElementsByClassName('sub');
  var hassubs = document.getElementsByClassName('has-sub');
  for (let i = 0; i < subs.length; i++) {
    if (i == x) {
      if (
        !(subs[i] as HTMLElement).style.display ||
        (subs[i] as HTMLElement).style.display == 'none'
      ) {
        (subs[i] as HTMLElement).style.display = 'block';
        (hassubs[i] as HTMLElement).classList.add('active');
      } else {
        (subs[i] as HTMLElement).style.display = 'none';
        (hassubs[i] as HTMLElement).classList.remove('active');
      }
    }
  }
  //}
}

function lang_tmp() {
  if (
    sessionStorage.getItem('DEV') == 'true' ||
    !sessionStorage.getItem('DEV')
  ) {
    if (
      !(document.getElementById('id_languages') as HTMLElement).style.display ||
      (document.getElementById('id_languages') as HTMLElement).style.display ==
        'none'
    ) {
      (document.getElementById('id_languages') as HTMLElement).style.display =
        'block';
    } else {
      (document.getElementById('id_languages') as HTMLElement).style.display =
        'none';
    }
  }
}

function menue_tmp() {
  console.log('api');
  if (sessionStorage.getItem('DEV') == 'true') {
    console.log('GLOABL API');
    var menue = document.getElementById('id_menu_wrapper');
    //console.log(menue!.classList!.contains('open'));
    if (!menue!.classList!.contains('open')) {
      menue!.classList.add('open');
      menue!.style.display = 'block';
    } else {
      menue!.classList.remove('open');
      menue!.style.display = 'none';
    }
  }
}

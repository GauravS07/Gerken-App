import { Component, OnInit, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { FormvalidationService } from '../formvalidation.service';
import { Felder, felder } from '../../fields';
import { Optional } from '@angular/core';

declare var $: any;
declare var noUiSlider: any;

@Component({
  selector: 'app-mietprozess',
  templateUrl: './mietprozess.component.html',
  styleUrls: ['./mietprozess.component.css'],
})
export class MietprozessComponent implements OnInit {
  mode: string = 'overview';
  modifier1: Hauptkategorie;
  modifier2: any;
  imgsrc = 'https://picsum.photos/';
  imgsize = 0;
  test = '';
  test39 = '';
  auswahl = '';
  product: any;
  id: number;
  progress: WizardStage;
  wizard: Array<WizardStage>;
  answers: Array<any>; //Stufe//Antworten
  kategorien: Array<Hauptkategorie> = Array<Hauptkategorie>();
  katlink1: string;
  katlink2: string;
  katbildlink: string;
  zeit: Array<any> = ['', 'Uhrzeit', '', 'Uhrzeit', false, 0, false, 0];
  path: string;
  chosen: Array<any>;
  laenge: number;
  standort: Array<any>;
  additional_standort: Array<any> = ['lieferung', false];
  idlist_standorte: Array<any> = Array<any>();
  order: Array<string>;
  state_auswahl: Array<any> = [[], [], [], [], 0];
  hilfs_array: Array<any> = [[], [], 0];
  abschluss: Array<any>;
  final: Array<any>;
  produktanzahl = 1;
  mietdauer = 0;
  token;
  wizardlink = '';
  stateid = 'b';
  auswahl_list;
  slug;
  mietdauer2 = 0;

  felder = felder;
  feld: Felder;
  //hilfs_array speichert die Daten im Rohformat + Anzahl
  //[[<Produkt>,<anzahl>],[<Zubehör>,<anzahl>],[<Versicherung>],[<bundles>,<anzahl>],[<versicherung_bundles>]]
  //Diese Daten werden abgefragt bei Klick auf Weiter.
  //wenn !hilfs_array[0] dann muss die Anzahl beim produkt nen roten Rahmen kriegen
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private formService: FormvalidationService,
    private router: Router
  ) {
    console.log('Construct Mietprozess');
    if (sessionStorage.getItem('Stateindex')) {
      this.stateid = sessionStorage.getItem('Stateindex');
    }
    if (sessionStorage.getItem('ORDER')) {
      console.log('LOAD ORDER');
      //var tmp_order = JSON.parse(sessionStorage.getItem('ORDER'));
      //console.log(tmp_order);
      //this.order = tmp_order;
    }

    if (sessionStorage.getItem('ZEIT')) {
      console.log('LOAD ZEIT');
      var tmp_zeit = JSON.parse(sessionStorage.getItem('ZEIT'));
      this.zeit = tmp_zeit;
      this.mietdauer2 = parseInt(this.zeit[7]);
    }

    if (
      sessionStorage.getItem('STANDORT') &&
      sessionStorage.getItem('STANDORT') != 'undefined'
    ) {
      console.log('LOAD STANDORT');
      var tmp_standort = JSON.parse(sessionStorage.getItem('STANDORT'));
      this.standort = tmp_standort;
    }

    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    } else {
      this.apiService.startupChain2(1);
    }
    if (sessionStorage.getItem('Usertoken')) {
      this.token = sessionStorage.getItem('Usertoken');
    }
    //console.log(this.route.parent.toString);
    this.route.params.subscribe((params) => {
      //console.log(params);
      this.kategorien = JSON.parse(localStorage.getItem('kategorie'));
      console.log(params);
      if (params['mode']) {
        this.mode = params['mode'];
      }
      if (params['category']) {
        //this.modifier1 = params['category'];
        for (let i = 0; i < this.kategorien.length; i++) {
          if (this.kategorien[i].slug == params['category']) {
            this.modifier1 = this.kategorien[i];
            console.log(this.modifier1.unterkategorien);
            console.log('Hauptkategorie gefunden');
          }
        }
      }
      if (params['subcategory']) {
        this.modifier2 = params['subcategory'];
        console.log(this.kategorien);
        for (let i = 0; i < this.kategorien.length; i++) {
          if (this.kategorien[i].slug == params['category']) {
            var xyr = this.kategorien[i];
            for (let i2 = 0; i2 < xyr.unterkategorien.length; i2++) {
              if (xyr.unterkategorien[i2].slug == params['subcategory']) {
                this.modifier2 = xyr.unterkategorien[i2];
                console.log('Subkategorie gefunden');
              }
            }
          }
        }
        console.log('Subkategorie:' + this.modifier2);
      }
      if (params['mode'] == 'auswahl' && params['category']) {
        this.auswahl = params['category'];
        console.log('Auswahl Mode');
        console.log(params['category']);
        console.log(this.zeit);
        var a = new Date(this.zeit[0]).getTime();
        var b = new Date(this.zeit[2]).getTime();
        this.mietdauer = (b - a) / (1000 * 24 * 60 * 60);
        console.log('Mietdauer (in Tagen): ' + this.mietdauer);

        //params['category'] ist der Slug eines Produktes
        //Produkte werden gespeichert als Produkt+Slug
        if (localStorage.getItem('Produkt' + params['category'])) {
          var product = JSON.parse(
            localStorage.getItem('Produkt' + params['category'])
          );
          console.log(product);
          if (!product['beschreibung']) {
            product['beschreibung'] = '';
          }
          this.product = product;
          console.log('here');
          this.hilfs_array[0] = product;
          //console.log(this.kategorien);

          for (let i3 = 0; i3 < this.kategorien.length; i3++) {
            if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
              for (
                let i4 = 0;
                i4 < this.kategorien[i3]['unterkategorien'].length;
                i4++
              ) {
                if (
                  this.kategorien[i3]['unterkategorien'][i4]['title'] ==
                  product['subkategorie']
                ) {
                  this.katlink1 = this.kategorien[i3]['slug'];
                  this.katlink2 =
                    this.kategorien[i3]['unterkategorien'][i4]['slug'];
                  this.katbildlink =
                    this.kategorien[i3]['unterkategorien'][i4]['link'];
                }
              }
            }
          }
        } else {
          //neu laden? Ist das nötig?
          console.log('NOT FOUND');
          console.log(params['category']);
          var text = params['category'];
          var input = this.apiService.generateInput([
            ['slug', params['category']],
          ]);
          this.apiService
            .postEndpunkt(input, 'produktbyslug')
            .subscribe((data) => {
              console.log(data);
              localStorage.setItem(
                'Produkt' + params['category'],
                JSON.stringify(data['produkt'])
              );
              this.product = data;
              product = this.product;
              console.log('Hilfsarray');
              this.hilfs_array[0] = product;
              //console.log(product);
              if (!product['beschreibung']) {
                product['beschreibung'] = '';
              }
              var chosen = Array<any>();
              //console.log(this.kategorien);
              for (let i3 = 0; i3 < this.kategorien.length; i3++) {
                if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
                  chosen.push(this.kategorien[i3]);
                  for (
                    let i4 = 0;
                    i4 < this.kategorien[i3]['unterkategorien'].length;
                    i4++
                  ) {
                    if (
                      this.kategorien[i3]['unterkategorien'][i4]['title'] ==
                      product['subkategorie']
                    ) {
                      chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                      this.katlink1 = this.kategorien[i3]['slug'];
                      this.katlink2 =
                        this.kategorien[i3]['unterkategorien'][i4]['slug'];
                      this.katbildlink =
                        this.kategorien[i3]['unterkategorien'][i4]['link'];
                    }
                  }
                }
              }
              this.chosen = chosen;
              console.log('CHOSEN');
              console.log(chosen);
            });
        }
      }
      if (params['mode'] == 'abschluss') {
      }
      if (params['mode'] == 'standorte' && params['category']) {
        this.auswahl = params['category'];
        console.log(params['category']);
        //params['category'] ist der Slug eines Produktes
        //Produkte werden gespeichert als Produkt+Slug
        if (localStorage.getItem('Produkt' + params['category'])) {
          var product = JSON.parse(
            localStorage.getItem('Produkt' + params['category'])
          );
          console.log('Produkt Found');
          console.log(product);
          if (!product['beschreibung']) {
            product['beschreibung'] = '';
          }
          this.product = product;
          var chosen = Array<any>();
          //console.log(this.kategorien);
          console.log(this.kategorien);
          for (let i3 = 0; i3 < this.kategorien.length; i3++) {
            if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
              chosen.push(this.kategorien[i3]);
              for (
                let i4 = 0;
                i4 < this.kategorien[i3]['unterkategorien'].length;
                i4++
              ) {
                if (
                  this.kategorien[i3]['unterkategorien'][i4]['title'] ==
                  product['subkategorie']
                ) {
                  chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                  this.katlink1 = this.kategorien[i3]['slug'];
                  this.katlink2 =
                    this.kategorien[i3]['unterkategorien'][i4]['slug'];
                  this.katbildlink =
                    this.kategorien[i3]['unterkategorien'][i4]['link'];
                }
              }
            }
          }
          this.chosen = chosen;
          console.log('CHOSEN');
          console.log(chosen);
        } else {
          //neu laden? Ist das nötig?
          console.log('NOT FOUND');
          console.log(params['category']);
          var text = params['category'];
          var input = this.apiService.generateInput([
            ['slug', params['category']],
          ]);
          this.apiService
            .postEndpunkt(input, 'produktbyslug')
            .subscribe((data) => {
              console.log(data);
              localStorage.setItem(
                'Produkt' + params['category'],
                JSON.stringify(data['produkt'])
              );
              console.log('Produkt Not Found');
              this.product = data['produkt'];
              product = this.product;
              console.log('PRODUKT');
              console.log(product);
              if (!product['beschreibung']) {
                product['beschreibung'] = '';
              }
              var chosen = Array<any>();
              //console.log(this.kategorien);
              for (let i3 = 0; i3 < this.kategorien.length; i3++) {
                if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
                  chosen.push(this.kategorien[i3]);
                  for (
                    let i4 = 0;
                    i4 < this.kategorien[i3]['unterkategorien'].length;
                    i4++
                  ) {
                    if (
                      this.kategorien[i3]['unterkategorien'][i4]['title'] ==
                      product['subkategorie']
                    ) {
                      chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                      this.katlink1 = this.kategorien[i3]['slug'];
                      this.katlink2 =
                        this.kategorien[i3]['unterkategorien'][i4]['slug'];
                      this.katbildlink =
                        this.kategorien[i3]['unterkategorien'][i4]['link'];
                    }
                  }
                }
              }
              this.chosen = chosen;
              console.log(chosen);
            });
        }
      }
      if (params['mode'] == 'zeit' && params['category']) {
        this.auswahl = params['category'];
        console.log(params['category']);
        //params['category'] ist der Slug eines Produktes
        //Produkte werden gespeichert als Produkt+Slug
        if (localStorage.getItem('Produkt' + params['category'])) {
          var product = JSON.parse(
            localStorage.getItem('Produkt' + params['category'])
          );
          console.log(product);
          if (!product['beschreibung']) {
            product['beschreibung'] = '';
          }
          this.product = product;
          var chosen = Array<any>();
          console.log('Kategorien');
          console.log(this.kategorien);
          for (let i3 = 0; i3 < this.kategorien.length; i3++) {
            if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
              chosen.push(this.kategorien[i3]);
              for (
                let i4 = 0;
                i4 < this.kategorien[i3]['unterkategorien'].length;
                i4++
              ) {
                if (
                  this.kategorien[i3]['unterkategorien'][i4]['title'] ==
                  product['subkategorie']
                ) {
                  chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                  this.katlink1 = this.kategorien[i3]['slug'];
                  this.katlink2 =
                    this.kategorien[i3]['unterkategorien'][i4]['slug'];
                  this.katbildlink =
                    this.kategorien[i3]['unterkategorien'][i4]['link'];
                }
              }
            }
          }
          console.log('CHOSEN');
          this.chosen = chosen;
        } else {
          //neu laden? Ist das nötig?
          console.log('NOT FOUND');
          console.log(params['category']);
          var text = params['category'];
          var input = this.apiService.generateInput([
            ['slug', params['category']],
          ]);
          this.apiService
            .postEndpunkt(input, 'produktbyslug')
            .subscribe((data) => {
              console.log(data);
              localStorage.setItem(
                'Produkt' + params['category'],
                JSON.stringify(data['produkt'])
              );
              this.product = data['produkt'];
              product = this.product;
              //console.log(product);
              if (!product['beschreibung']) {
                product['beschreibung'] = '';
              }
              var chosen = Array<any>();
              console.log('Kategorien');
              console.log(this.kategorien);
              console.log(product);
              for (let i3 = 0; i3 < this.kategorien.length; i3++) {
                if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
                  chosen.push(this.kategorien[i3]);
                  for (
                    let i4 = 0;
                    i4 < this.kategorien[i3]['unterkategorien'].length;
                    i4++
                  ) {
                    if (
                      this.kategorien[i3]['unterkategorien'][i4]['title'] ==
                      product['subkategorie']
                    ) {
                      chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                      this.katlink1 = this.kategorien[i3]['slug'];
                      this.katlink2 =
                        this.kategorien[i3]['unterkategorien'][i4]['slug'];
                      this.katbildlink =
                        this.kategorien[i3]['unterkategorien'][i4]['link'];
                    }
                  }
                }
              }
              console.log('CHOSEN');
              this.chosen = chosen;
              console.log(chosen);
            });
        }
      }
      if (params['subcategory'] && params['category']) {
        //console.log("yes");
        var x = this;
        this.apiService.loadByCategories(
          params['category'],
          params['subcategory'],
          this.implementProdukte,
          x
        );
      }
      if (this.mode == 'wizard' && !params['category']) {
        console.log('NO PRODUCT');
        //this.imgsrc += document.body.clientWidth;
        //this.imgsize += document.body.clientWidth;
        this.kategorien = JSON.parse(localStorage.getItem('kategorie'));
        console.log(this.kategorien);
        var arbeitsbuehnen: Hauptkategorie;
        for (let i = 0; i < this.kategorien.length; i++) {
          if (this.kategorien[i].title == 'Arbeitsbühnen') {
            arbeitsbuehnen = this.kategorien[i];
          }
        }
        this.wizard = this.getWizard();
        this.answers = Array<string>();
        this.progress = this.wizard[0];
        this.modifier1 = arbeitsbuehnen;
        if (sessionStorage.getItem('antworten')) {
          this.answers = JSON.parse(sessionStorage.getItem('antworten'));
          var ele = document.getElementById('forward_wizard');
          var stufe = (this.wizard.length - 1).toString();
          console.log(stufe);

          ele.setAttribute('data-stufe', stufe);
        }
        console.log(arbeitsbuehnen);
      }
      if (this.mode == 'empfehlung' && !params['category']) {
        this.router.navigate(['/mietprozess']);
      }
      if (this.mode == 'empfehlung' && params['category']) {
        if (!localStorage.getItem('Produkt' + params['category'])) {
          this.apiService
            .postEndpunkt(input, 'produktbyslug')
            .subscribe((data) => {
              console.log(data);
              localStorage.setItem(
                'Produkt' + params['category'],
                JSON.stringify(data['produkt'])
              );
              this.helper1(params['category']);
            });
        } else {
          this.helper1(params['category']);
        }
      }
      if (this.mode == 'miethistorie') {
        if (params['category']) {
          //Option A: Zeige Mietprozess an mit vorausgewähltem Produkt
          var produktid = params['category'];
          this.id = produktid;
        } else {
          //Option B: Zeige Miethistorie an
        }
      }
      if (this.mode == 'catalog') {
        if (params['category']) {
          //Wurde über Geräte Mieten angesteuert, Kategorie ist bekannt
          this.test39 = params['category'];
          for (let i = 0; i < this.felder.length; i++) {
            if (this.felder[i].slug == this.test39) {
              this.feld = this.felder[i];
            }
          }
        } else {
          this.test39 = '';
          //Wurde per Menü angesteuert, Kategorie muss ausgewählt werden
        }
      }
      console.log(this.imgsrc);
      this.test =
        '<img scr="' + this.imgsrc + '" width="' + this.imgsize + '">';
    });
    //console.log(this.kategorien);
  }

  helper1(input24: string) {
    console.log('PRODUCT'); //marker1
    //this.imgsrc += document.body.clientWidth;
    //this.imgsize += document.body.clientWidth;
    this.slug = input24;
    var producte = JSON.parse(sessionStorage.getItem('found_produkte'));
    this.product = JSON.parse(localStorage.getItem('Produkt' + this.slug));
    var product = this.product;
    console.log('Produkt (not onload)');
    console.log(product);
    console.log('Hier4?');
    if (producte[0]) {
      console.log('Hier 2');
      producte[0] = product;
      console.log('hier 2b');
    }
    var hauptkategorie = product['hauptkategorie'];
    var subkategorie = product['subkategorie'];
    var produkt = product['slug'];
    var chosen = Array<any>();
    console.log(this.kategorien);
    for (let i3 = 0; i3 < this.kategorien.length; i3++) {
      console.log(
        '>>' +
          this.kategorien[i3]['title'] +
          '<< >>' +
          product['hauptkategorie'] +
          '<<'
      );
      if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
        chosen.push(this.kategorien[i3]);
        for (
          let i4 = 0;
          i4 < this.kategorien[i3]['unterkategorien'].length;
          i4++
        ) {
          if (product['hauptkategorie'] == 'Zubehör') {
            var a16 = product['subkategorie'].split('|');
            for (let i = 0; i < a16.length; i++) {
              console.log(
                '>>' +
                  this.kategorien[i3]['unterkategorien'][i4]['title'] +
                  '<< >>' +
                  a16[i] +
                  '<<'
              );
              if (
                this.kategorien[i3]['unterkategorien'][i4]['title'] == a16[i]
              ) {
                console.log('Unterkategorie gefunden');
                chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                this.katlink1 = this.kategorien[i3]['slug'];
                this.katlink2 =
                  this.kategorien[i3]['unterkategorien'][i4]['slug'];
                this.katbildlink =
                  this.kategorien[i3]['unterkategorien'][i4]['link'];
              }
            }
          } else {
            if (
              this.kategorien[i3]['unterkategorien'][i4]['title'] ==
              product['subkategorie']
            ) {
              chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
              this.katlink1 = this.kategorien[i3]['slug'];
              this.katlink2 =
                this.kategorien[i3]['unterkategorien'][i4]['slug'];
              this.katbildlink =
                this.kategorien[i3]['unterkategorien'][i4]['link'];
            }
          }
        }
      }
    }
    console.log('Hier3?');
    this.modifier1 = chosen[0];
    this.modifier2 = chosen[1];
    console.log('Chosen');
    console.log(chosen);
    if (!producte) {
      var way = sessionStorage.getItem('wayward');
      if (way == 'kategorien') {
        var input = this.apiService.generateInput([
          ['hauptkategorie', hauptkategorie],
          ['subkategorie', subkategorie],
          ['produkt', produkt],
          ['mode', 'kategorien'],
        ]);
      }

      if (way == 'wizard') {
        var input = sessionStorage.getItem('antworten');
      }

      if (way == 'mietkatalog') {
        var input = this.apiService.generateInput([
          ['kategorie', hauptkategorie],
          ['produkt', produkt],
          ['mode', 'mietkatalog'],
        ]);
      }

      if (way == 'historie') {
        var input = this.apiService.generateInput([
          ['kategorie', hauptkategorie],
          ['produkt', produkt],
          ['mode', 'historie'],
        ]);
      }

      this.apiService.postEndpunkt(input, 'wizardend').subscribe((data) => {
        //this.product = data['success'][0];
        producte = data['success'];
        console.log('Hier5?');
        if (producte[0]) {
          console.log(product);
          producte[0] = product;
        } else {
          producte.push(product);
        }
        for (let i = 0; i < producte.length; i++) {
          localStorage.setItem(
            'Produkt' + producte[i]['slug'],
            JSON.stringify(producte[i])
          );
        }
        var chosen = Array<any>();
        console.log(this.kategorien);
        for (let i3 = 0; i3 < this.kategorien.length; i3++) {
          console.log(
            '>>' +
              this.kategorien[i3]['title'] +
              '<< >>' +
              product['hauptkategorie'] +
              '<<'
          );
          if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
            chosen.push(this.kategorien[i3]);
            for (
              let i4 = 0;
              i4 < this.kategorien[i3]['unterkategorien'].length;
              i4++
            ) {
              if (product['hauptkategorie'] == 'Zubehör') {
                var a16 = product['subkategorie'].split('|');
                for (let i = 0; i < a16.length; i++) {
                  console.log(
                    '>>' +
                      this.kategorien[i3]['unterkategorien'][i4]['title'] +
                      '<< >>' +
                      a16[i] +
                      '<<'
                  );
                  if (
                    this.kategorien[i3]['unterkategorien'][i4]['title'] ==
                    a16[i]
                  ) {
                    console.log('Unterkategorie gefunden');
                    chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                    this.katlink1 = this.kategorien[i3]['slug'];
                    this.katlink2 =
                      this.kategorien[i3]['unterkategorien'][i4]['slug'];
                    this.katbildlink =
                      this.kategorien[i3]['unterkategorien'][i4]['link'];
                  }
                }
              } else {
                if (
                  this.kategorien[i3]['unterkategorien'][i4]['title'] ==
                  product['subkategorie']
                ) {
                  chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                  this.katlink1 = this.kategorien[i3]['slug'];
                  this.katlink2 =
                    this.kategorien[i3]['unterkategorien'][i4]['slug'];
                  this.katbildlink =
                    this.kategorien[i3]['unterkategorien'][i4]['link'];
                }
              }
            }
          }
        }
        console.log('Hier6?');
        this.modifier1 = chosen[0];
        this.modifier2 = chosen[1];
        console.log('Chosen');
        console.log(chosen);
      });
    }
    var chosen = Array<any>();
    for (let i3 = 0; i3 < this.kategorien.length; i3++) {
      console.log(
        '>>' +
          this.kategorien[i3]['title'] +
          '<< >>' +
          product['hauptkategorie'] +
          '<<'
      );
      if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
        chosen.push(this.kategorien[i3]);
        for (
          let i4 = 0;
          i4 < this.kategorien[i3]['unterkategorien'].length;
          i4++
        ) {
          if (product['hauptkategorie'] == 'Zubehör') {
            var a16 = product['subkategorie'].split('|');
            for (let i = 0; i < a16.length; i++) {
              console.log(
                '>>' +
                  this.kategorien[i3]['unterkategorien'][i4]['title'] +
                  '<< >>' +
                  a16[i] +
                  '<<'
              );
              if (
                this.kategorien[i3]['unterkategorien'][i4]['title'] == a16[i]
              ) {
                console.log('Unterkategorie gefunden');
                chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                this.katlink1 = this.kategorien[i3]['slug'];
                this.katlink2 =
                  this.kategorien[i3]['unterkategorien'][i4]['slug'];
                this.katbildlink =
                  this.kategorien[i3]['unterkategorien'][i4]['link'];
              }
            }
          } else {
            if (
              this.kategorien[i3]['unterkategorien'][i4]['title'] ==
              product['subkategorie']
            ) {
              chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
              this.katlink1 = this.kategorien[i3]['slug'];
              this.katlink2 =
                this.kategorien[i3]['unterkategorien'][i4]['slug'];
              this.katbildlink =
                this.kategorien[i3]['unterkategorien'][i4]['link'];
            }
          }
        }
      }
    }
    console.log('Hier7?');
    this.modifier1 = chosen[0];
    this.modifier2 = chosen[1];
    console.log('Chosen Final');
    console.log(chosen);
  }

  backsp() {
    /*
    [routerLink]="[
      '/mietprozess/category',
      chosen[0].slug,
      chosen[1].slug
    ]"
    */
    if (
      this.chosen[1].slug &&
      this.chosen[0].slug &&
      sessionStorage.getItem('newback') != 'true'
    ) {
      this.router.navigate(
        ['/mietprozess/category', this.chosen[0].slug, this.chosen[1].slug],
        {}
      );
    } else {
      if (sessionStorage.getItem('newback') == 'true') {
        this.router.navigate(['/mietprozess/wizard', this.product['slug']], {});
      }
    }
  }

  onload_empfehlung() {
    console.log('Empfehlung Final');
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    console.log('Index2: ' + sessionStorage.getItem('Stateindex'));
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    var producte = JSON.parse(sessionStorage.getItem('found_produkte'));
    var featured;
    var not_featured = Array<any>();
    //sessionStorage.removeItem('wizarddecision');
    sessionStorage.setItem('newback', 'true');
    var way = sessionStorage.getItem('wayward');
    var product = this.product;
    console.log('Produkt (not onload)');
    console.log(product);

    var chosen = Array<any>();
    for (let i3 = 0; i3 < this.kategorien.length; i3++) {
      console.log(
        '>>' +
          this.kategorien[i3]['title'] +
          '<< >>' +
          product['hauptkategorie'] +
          '<<'
      );
      if (this.kategorien[i3]['title'] == product['hauptkategorie']) {
        chosen.push(this.kategorien[i3]);
        for (
          let i4 = 0;
          i4 < this.kategorien[i3]['unterkategorien'].length;
          i4++
        ) {
          if (product['hauptkategorie'] == 'Zubehör') {
            var a16 = product['subkategorie'].split('|');
            for (let i = 0; i < a16.length; i++) {
              console.log(
                '>>' +
                  this.kategorien[i3]['unterkategorien'][i4]['title'] +
                  '<< >>' +
                  a16[i] +
                  '<<'
              );
              if (
                this.kategorien[i3]['unterkategorien'][i4]['title'] == a16[i]
              ) {
                console.log('Unterkategorie gefunden');
                chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
                this.katlink1 = this.kategorien[i3]['slug'];
                this.katlink2 =
                  this.kategorien[i3]['unterkategorien'][i4]['slug'];
                this.katbildlink =
                  this.kategorien[i3]['unterkategorien'][i4]['link'];
              }
            }
          } else {
            if (
              this.kategorien[i3]['unterkategorien'][i4]['title'] ==
              product['subkategorie']
            ) {
              chosen.push(this.kategorien[i3]['unterkategorien'][i4]);
              this.katlink1 = this.kategorien[i3]['slug'];
              this.katlink2 =
                this.kategorien[i3]['unterkategorien'][i4]['slug'];
              this.katbildlink =
                this.kategorien[i3]['unterkategorien'][i4]['link'];
            }
          }
        }
      }
    }
    console.log('HELP1');
    this.modifier1 = chosen[0];
    this.modifier2 = chosen[1];
    console.log('Chosen Final');
    console.log(chosen);

    var hauptkategorie = product['hauptkategorie'];
    var subkategorie = product['subkategorie'];
    var produkt = product['slug'];
    document.getElementById('title').innerHTML = 'Unsere Empfehlung für Sie';
    document.getElementById('title2').innerHTML = 'Alternativen';
    if (way == 'wizard') {
      document.getElementById('title').innerHTML = 'Unsere Empfehlung für Sie';
      document.getElementById('title2').innerHTML = 'Alternativen';
    }
    if (!producte) {
      if (way == 'kategorien') {
        var input = this.apiService.generateInput([
          ['hauptkategorie', hauptkategorie],
          ['subkategorie', subkategorie],
          ['produkt', produkt],
          ['mode', 'kategorien'],
        ]);
      }

      if (way == 'wizard') {
        var input = sessionStorage.getItem('antworten');
      }

      if (way == 'mietkatalog') {
        var input = this.apiService.generateInput([
          ['kategorie', hauptkategorie],
          ['produkt', produkt],
          ['mode', 'mietkatalog'],
        ]);
      }

      if (way == 'historie') {
        var input = this.apiService.generateInput([
          ['kategorie', hauptkategorie],
          ['produkt', produkt],
          ['mode', 'historie'],
        ]);
      }
      console.log('ON Load API CALL');
      this.apiService.postEndpunkt(input, 'wizardend').subscribe((data) => {
        console.log('-----Empfehlung Ergebnis------');
        console.log(data);
        var produkte = data['success'];
        console.log('HELP2');
        if (produkte[0]) {
          console.log('Hier');
          produkte[0] = product;
          console.log('X');
        } else {
          produkte.push(product);
        }
        for (let i = 0; i < produkte.length; i++) {
          if (i != 0) {
            localStorage.setItem(
              'Produkt' + produkte[i]['slug'],
              JSON.stringify(produkte[i])
            );
          }
        }
        var dest = '/mietprozess/wizard/';
        //this.product = data['success'][0];
        sessionStorage.setItem('found_produkte', JSON.stringify(produkte));

        for (let i = 0; i < produkte.length; i++) {
          if (i == 0) {
            featured = produkte[0];
            var ele = this.apiService.constructHTML(
              'ProduktOverview2',
              featured
            );
            document.getElementById('featured').appendChild(ele);
          } else {
            not_featured.push(produkte[i]);
            var ele = this.apiService.constructHTML(
              'ProduktOverview2',
              produkte[i]
            );
            document.getElementById('not-that-featured').appendChild(ele);
          }
        }
      });
      console.log('API END');
    } else {
      console.log('HELP7');
      for (let i = 0; i < producte.length; i++) {
        if (i == 0) {
          featured = producte[0];
          var ele = this.apiService.constructHTML('ProduktOverview2', featured);
          document.getElementById('featured').appendChild(ele);
        } else {
          not_featured.push(producte[i]);
          var ele = this.apiService.constructHTML(
            'ProduktOverview2',
            producte[i]
          );
          document.getElementById('not-that-featured').appendChild(ele);
        }
      }
      console.log('HELP8');
    }
    this.apiService.loadMenue(this.router);
  }

  catalogload() {
    console.log('This Test: ' + this.test39);
    var frame = document.getElementById('outletx');
    frame.innerHTML = '';
    var env = this;
    if (this.test39 == '') {
      //keine Hauptkategorie
      console.log(this.kategorien);
      for (let i = 0; i < this.kategorien.length; i++) {
        /*
         <a href="#" class="teaser">
							
							<img src="images/_temp/product-group-thumbnail.jpg">
							
							<span>Spezial-Arbeitsbühne</span>
							
						</a>
         */
        var a = document.createElement('a');
        a.classList.add('teaser');
        a.id = this.apiService.makeid(7);
        a.setAttribute('data-link', this.kategorien[i].slug);
        a.innerHTML =
          '<img src="' +
          this.kategorien[i].link +
          '"><span>' +
          this.kategorien[i].title +
          '</span>';
        frame.appendChild(a);

        document
          .getElementById(a.id)
          .addEventListener('click', function (event) {
            env.nav('/mietprozess/catalog/' + this.getAttribute('data-link'));
          });
      }
    } else {
      var input = this.apiService.generateInput([
        ['hauptkategorie', this.feld.hauptkategorie],
      ]);
      console.log(input);
      if (!localStorage.getItem('catalog' + this.feld.hauptkategorie)) {
        this.apiService.postEndpunkt(input, 'catalog').subscribe((data) => {
          console.log(data);
          localStorage.setItem(
            'catalog' + this.feld.hauptkategorie,
            JSON.stringify(data['produkte'])
          );
          this.constructTable();
        });
      } else {
        this.constructTable();
      }
    }
  }

  constructTable() {
    var data = JSON.parse(
      localStorage.getItem('catalog' + this.feld.hauptkategorie)
    );
    console.log(data);
    //console.log(data);
    var frame = document.getElementById('outletx');
    var div = document.createElement('div');
    div.classList.add('tableframe');
    var table = document.createElement('table');
    var tr = document.createElement('thead');
    var tr2 = document.createElement('tr');
    tr.appendChild(tr2);
    var tbody = document.createElement('tbody');
    for (let i = 0; i < this.feld.labels.length; i++) {
      var th = document.createElement('th');
      th.innerHTML = this.feld.labels[i];
      if (i == 0) {
        th.setAttribute('style', 'max-width:200px');
      }
      tr2.appendChild(th);
      /*
      if (this.feld.data[i] == 'produkt') {
        var th = document.createElement('th');
        th.innerHTML = 'Details';
        tr2.appendChild(th);
      }
      */
    }
    table.appendChild(tr);

    console.log(data.length);
    var router = this.router;
    for (let i = 0; i < data.length; i++) {
      var tr2 = document.createElement('tr');
      for (let j = 0; j < this.feld.labels.length; j++) {
        var td = document.createElement('td');
        td.innerHTML = data[i][this.feld.data[j]];
        td.setAttribute('style', 'max-width:200px');
        if (this.feld.data[j] == 'produkt') {
          var a = document.createElement('a');
          a.setAttribute('data-slug', data[i]['slug']);
          a.setAttribute('style', 'max-width:100%');
          a.classList.add('btn');
          var title = data[i]['produkt'];

          a.innerHTML = title;
          a.addEventListener('click', function (event) {
            //muss auf zeit gehen
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

            router.navigate([dest, this.getAttribute('data-slug')], {}); //marker2
          });
          td.innerHTML = '';
          td.appendChild(a);
        }
        tr2.appendChild(td);
        /*
        if (this.feld.data[j] == 'produkt') {
          var td = document.createElement('td');
          var a = document.createElement('a');
          a.setAttribute('data-slug', data[i]['slug']);
          a.classList.add('btn');
          a.innerHTML = 'Details';
          a.addEventListener('click', function (event) {
            router.navigate(
              ['produktdetailseite/' + this.getAttribute('data-slug')],
              {}
            );
          });
          td.appendChild(a);
          tr2.appendChild(td);
        }*/
      }
      tbody.appendChild(tr2);
    }
    table.appendChild(tbody);

    div.appendChild(table);
    frame.appendChild(div);
  }

  orderback() {
    var order = this.order;
    var lastprodukt = JSON.parse(
      sessionStorage.getItem('OrderProdukt' + order.length)
    );
    console.log(lastprodukt);
    this.router.navigate(['mietprozess/auswahl/' + lastprodukt[0]['slug']], {});
  }

  bestellen() {
    //something with API
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
      this.router.navigate(['/'], {});
      sessionStorage.setItem('Stateindex', '0');
      sessionStorage.removeItem('ZEIT');
      sessionStorage.removeItem('STANDORT');
    });
  }
  //marker3
  generateInput2(eingabe: Array<any>): string {
    var result = '';

    for (let i = 0; i < eingabe.length; i++) {
      if (result == '') {
        result = '{"' + eingabe[i] + '":"' + eingabe[i + 1] + '"';
      } else {
        result += ',"' + eingabe[i] + '":"' + eingabe[i + 1] + '"';
      }
      i++;
    }
    result += '}';
    return result;
  }

  parseInt(input: string): number {
    return parseFloat(input);
  }

  onload_standorte() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    console.log('Index2: ' + sessionStorage.getItem('Stateindex'));
    if (index != 0 && index) {
      console.log('a');
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      console.log('b');
      document.getElementById('id_c2a').style.display = 'none';
    }
    scroll(0, 0);
    console.log('Standorte geladen');
    this.standort = JSON.parse(sessionStorage.getItem('STANDORT'));
    console.log('STANDORT');
    console.log(this.standort);
    var frame = document.getElementById('standort_output');
    frame.innerHTML = '';
    this.apiService.loadMenue(this.router);
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

  I_will_have_order(input: string) {
    console.log('Hilfsarray');

    var base = this.hilfs_array[1];
    console.log(base);
    var ZEIT = this.zeit;
    var STANDORT = this.standort;
    var ORDER = this.order;
    var anzahlproduct = parseInt(
      (document.getElementById('preisstorage') as HTMLInputElement).value
    );
    console.log('Anzahl:');
    console.log(anzahlproduct);
    var gesamtpreis = document
      .getElementById('gesamtpreis')
      .getAttribute('data-fuzck');
    console.log(this.state_auswahl);
    var produkt = this.apiService.generateInput([
      ['name', this.state_auswahl[0][0]['produkt']],
      ['uid', this.state_auswahl[0][0]['uid']],
      ['hauptkategorie', this.state_auswahl[0][0]['hauptkategorie']],
      ['anzahl', anzahlproduct],
      ['preis', this.state_auswahl[0][0]['preis'].split('|')[0]],
      ['slug', this.state_auswahl[0][0]['slug']],
    ]);

    var produktb = JSON.parse(produkt);
    sessionStorage.setItem('last', this.state_auswahl[0][0]['slug']);
    console.log(produktb);
    var versicherung;
    var id = '';
    var eles = document.getElementsByClassName('formularinput versicherung1');
    for (let i = 0; i < eles.length; i++) {
      console.log(eles[i]);
      if (
        (eles[i] as HTMLInputElement).checked &&
        !eles[i].classList.contains('versicherungen_bundles')
      ) {
        console.log('CHECKED');
        id = eles[i].id;
        console.log(id);
      }
    }
    var listeofversicherung = base['versicherungen1'];
    for (let i = 0; i < listeofversicherung.length; i++) {
      console.log(
        'found id: ' + id + ', compare to ' + listeofversicherung[i]['id']
      );
      if (listeofversicherung[i]['id'] == id) {
        versicherung = listeofversicherung[i];
      }
    }
    var auswahl = Array<any>();
    auswahl.push('gesamtpreis');
    auswahl.push(gesamtpreis);

    auswahl.push('produkt');
    auswahl.push(produktb);

    auswahl.push('zeit');
    auswahl.push(ZEIT);

    auswahl.push('standort');
    auswahl.push(STANDORT);

    auswahl.push('versicherung');
    auswahl.push(versicherung);
    console.log('Versicherung');
    console.log(versicherung);

    auswahl.push('token');
    auswahl.push(sessionStorage.getItem('Usertoken'));

    auswahl.push('email');
    auswahl.push(sessionStorage.getItem('Email'));
    var x_id = parseInt(this.stateid);
    x_id = x_id - 1;
    auswahl.push('id');
    auswahl.push(x_id.toString());

    console.log('State ID: ' + this.stateid);
    var zubehoer_ele = document.getElementsByClassName('zubehoerselect');
    var zubehoer = Array<any>();
    for (let i = 0; i < zubehoer_ele.length; i++) {
      var wert = (zubehoer_ele[i] as HTMLInputElement).value;
      var id = zubehoer_ele[i].id;
      if (wert != 'Anzahl wählen...') {
        console.log('Zubehör: ' + wert + '  ' + id);
        for (let j = 0; j < base['zubehoer'].length; j++) {
          console.log('Compare: b' + base['zubehoer'][j]['id'] + ' / ' + id);
          if ('b' + base['zubehoer'][j]['id'] == id) {
            console.log(base['zubehoer'][j]);
            var entry = base['zubehoer'][j];
            var string_input = this.apiService.generateInput([
              ['hauptkategorie', entry['hauptkategorie']],
              ['uid', entry['uid']],
              ['anzahl', wert],
              ['slug', entry['slug']],
              ['name', entry['produkt']],
              ['preis', entry['preis'].split('|')[0]],
            ]);
            //console.log(string_input);
            var list_input = JSON.parse(string_input);
            zubehoer.push(list_input);
          }
        }
      }
    }
    auswahl.push('zubehoer');
    auswahl.push(zubehoer);
    /*
    hauptkategorie
    uid
    anzahl
    slug
    preis
    */
    var bundles_ele = document.getElementsByClassName('bundleselect');
    var bundles = Array<any>();
    for (let i = 0; i < bundles_ele.length; i++) {
      var wert = (bundles_ele[i] as HTMLInputElement).value;
      var id = bundles_ele[i].id;
      if (wert != 'Anzahl wählen...') {
        console.log('Bundle: ' + wert + '  ' + id);
        for (let j = 0; j < base['bundles'].length; j++) {
          console.log('Compare: b' + base['bundles'][j]['id'] + ' / ' + id);
          if ('b' + base['bundles'][j]['id'] == id) {
            console.log(base['bundles'][j]);
            var entry = base['bundles'][j];
            var versicherungs_bundle;
            var id2 = '';
            var eles = document.getElementsByClassName(
              'versicherungen_bundles'
            );
            for (let i = 0; i < eles.length; i++) {
              console.log(eles[i]);
              if (
                (eles[i] as HTMLInputElement).checked &&
                (eles[i] as HTMLInputElement).name == 'versicherung' + id
              ) {
                console.log('CHECKED');
                id2 = eles[i].id;
                console.log(id2);
              }
            }
            var listeofversicherung = base['versicherungen2'];
            for (let i = 0; i < listeofversicherung.length; i++) {
              console.log(
                'found id: ' +
                  id2 +
                  ', compare to ' +
                  listeofversicherung[i]['id']
              );
              if (listeofversicherung[i]['id'] == id2) {
                versicherungs_bundle = listeofversicherung[i];
              }
            }
            console.log(versicherungs_bundle);
            var string_input = this.apiService.generateInput([
              ['product1category', entry['product1category']],
              ['product1', entry['product1']],
              ['product2category', entry['product2category']],
              ['product2', entry['product2']],
              ['name', entry['productname1'] + '|xx|' + entry['productname2']],
              ['uid', entry['uid']],
              ['anzahl', wert],
              ['preis', entry['preis'].split('|')[0]],
              ['id_versicherung', versicherungs_bundle['uid']],
              ['title_versicherung', versicherungs_bundle['title']],
              ['preis_versicherung', versicherungs_bundle['preis']],
            ]);
            //console.log(string_input);
            var list_input = JSON.parse(string_input);
            console.log(list_input);
            bundles.push(list_input);
          }
        }
      }
    }
    auswahl.push('bundles');
    auswahl.push(bundles);
    /*
    hauptkategorie
    uid
    anzahl
    slug
    preis
    versicherungid
    */
    var output = JSON.stringify(auswahl);
    this.apiService.postEndpunkt(output, 'saveauswahl').subscribe((data) => {
      console.log(data);
      var id = this.stateid;
      var beta_id = parseInt(id);
      beta_id = beta_id + 1;
      this.stateid = beta_id.toString();
      sessionStorage.setItem('Stateindex', data['success']['index']);
      console.log('RAW: ' + data['success']['index']);
      console.log('Index2: ' + sessionStorage.getItem('Stateindex'));
      if (input == 'abschluss') {
        console.log('DATA');
        var laenge = data['success']['data'].length;
        for (let i = 0; i < data['success']['data'].length; i++) {
          var state = data['success']['data'][i];
          //console.log(state);
          sessionStorage.setItem('order_entry' + i, JSON.stringify(state));
        }
        sessionStorage.setItem('order_counter', laenge);
        //sessionStorage.setItem('ORDER', JSON.stringify(this.order));
        //console.log(sessionStorage.getItem('ORDER'));
        this.router.navigate(['mietprozess/abschluss'], {});
      }
      if (input == 'again') {
        console.log('DATA');
        console.log(data);
        //console.log(this.order);
        //now add the other stuff:

        //sessionStorage.setItem('ORDER', JSON.stringify(this.order));
        this.router.navigate(['mietprozess'], {});
      }
    });
  }

  ihatethis(mode: string, additional: any) {
    //marker
    if (mode == 'kategorien') {
      sessionStorage.setItem('wayward', 'kategorien');
      sessionStorage.setItem('wayward_para1', additional[0]); //hauptkategorie
      sessionStorage.setItem('wayward_para2', additional[1]); //subkategorie
      sessionStorage.setItem('wayward_para3', additional[2]); //subkategorie
      this.router.navigate(['/mietprozess/empfehlung', additional[2]], {});
    }

    if (mode == 'wizard') {
      sessionStorage.setItem('wayward', 'wizard');
      sessionStorage.setItem('wayward_para1', additional[0]); //wizard antworten
      //this.router.navigate(['/mietprozess/empfehlung'], {});
    }

    if (mode == 'mietkatalog') {
      sessionStorage.setItem('wayward', 'mietkatalog');
      sessionStorage.setItem('wayward_para1', additional[0]); //hauptkategorie
      sessionStorage.setItem('wayward_para2', additional[1]); //produkt slug
      this.router.navigate(['/mietprozess/empfehlung', additional[1]], {});
    }

    if (mode == 'historie') {
      sessionStorage.setItem('wayward', 'historie');
      sessionStorage.setItem('wayward_para1', additional[0]); //produkt slug
      //sessionStorage.setItem("wayward_para2",additional[1]);
      this.router.navigate(['/mietprozess/empfehlung', additional[0]], {});
    }
  }

  loadAbschluss() {
    scroll(0, 0);
    /*
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    */
    document.getElementById('id_c2a').style.display = 'none';
    var frame = document.getElementById('positionoutlet');
    frame.innerHTML = '';
    var output = this.apiService.generateInput([
      ['email', sessionStorage.getItem('Email')],
    ]);
    this.apiService.postEndpunkt(output, 'loadauswahl').subscribe((data) => {
      var states = data['success']['data'];
      console.log(states);
      var netto = 0;
      var steuer = 0;
      var gesamt = 0;
      for (let i = 0; i < states.length; i++) {
        var ele = this.apiService.constructHTML('orderstate', states[i]);
        frame.appendChild(ele);
        gesamt += parseFloat(states[i]['gesamtpreis']);
        sessionStorage.setItem('State' + i, JSON.stringify(states[i]));
      }
      sessionStorage.setItem('Stateamount', states.length);
      var open = true;
      var days = 1;
      var zeit = JSON.parse(sessionStorage.getItem('ZEIT'));
      console.log(zeit);
      if (zeit[7]) {
        var days = parseInt(zeit[7]);
        open = false;
      }
      gesamt = gesamt * days;
      netto = gesamt * 0.81;
      steuer = gesamt * 0.19;
      document.getElementById('netto').innerHTML = netto.toFixed(2) + '€';
      document.getElementById('steuer').innerHTML = steuer.toFixed(2) + '€';
      document.getElementById('gesamtpreis').innerHTML =
        gesamt.toFixed(2) + '€';
    });
    //marker abschluss
    this.apiService.loadMenue(this.router);
    this.loadRechnungsadressen();
    this.formService.implementPresets('land', 'new_land');
  }

  loadRechnungsadressen() {
    var email = sessionStorage.getItem('Email');
    var token = sessionStorage.getItem('Usertoken');
    var input = this.apiService.generateInput([
      ['email', email],
      ['token', token],
    ]);
    if (sessionStorage.getItem('Rechnungsadressen')) {
      var data = sessionStorage.getItem('Rechnungsadressen');
      this.constructRechnungsadressen(JSON.parse(data)['rechnungsadressen']);
      console.log();
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
      'Germany';
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
    var border = document.getElementById('output_rechnungsadressen');
    border.innerHTML = '';
    console.log('construction');
    //console.log(data);
    for (let i = 0; i < count; i++) {
      var ele = this.apiService.constructHTML('Rechnungsadressen2', [
        this.router,
        data[i],
      ]);
      var hash = ele.getAttribute('data-hash');
      console.log('Hash: ' + data[i]['id']);

      border.appendChild(ele);
      if (i == 0) {
        console.log('FIRST: ' + data[i]['id']);
        (
          document.getElementById(data[i]['id']) as HTMLInputElement
        ).checked = true;
      }
    }
    border.innerHTML =
      border.innerHTML + '<div style="clear:both;"><div></div></div>';
    (document.getElementById(data[0]['id']) as HTMLInputElement).checked = true;
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

  onChangeStandort() {
    var lieferung = document.getElementById('lieferung');
    var abholung = document.getElementById('abholung');
    if ((abholung as HTMLInputElement).checked) {
      document.getElementById('id_wo_abholung').style.display = 'block';
      document.getElementById('id_wo_lieferung2').style.display = 'none';
    } else {
      document.getElementById('id_wo_abholung').style.display = 'none';
      document.getElementById('id_wo_lieferung2').style.display = 'block';
    }
  }

  checkInt() {
    var box = document.getElementById('searchinput') as HTMLInputElement;

    var input = box.value;
    var int_input = parseInt(input).toString();
    if (input.length == 5) {
      this.requestStandorte();
    }
  }

  requestStandorte() {
    var box = (document.getElementById('searchinput') as HTMLInputElement)
      .value;
    var input = this.apiService.generateInput([
      ['slug', this.product['slug']],
      ['plz', box],
    ]);
    box = box.toLowerCase();
    if (box == 'hundewelpen' || box == 'kaetzchen' || box == 'toastbrot') {
      input = this.apiService.generateInput([['suchwort', box]]);
      this.apiService.ostern(box).subscribe((data) => {
        console.log(data);
        //document.getElementById('standort_output').innerHTML = '';
        for (let i = 0; i < data['items'].length; i++) {
          console.log(data['items'][i]);
          var a = document.createElement('a');
          a.href = data['items'][i]['link'];
          a.target = '_self';
          a.classList.add('teaser');

          var img = document.createElement('img');
          img.src = data['items'][i]['link'];

          var span = document.createElement('span');
          span.innerHTML = data['items'][i]['title'];

          a.appendChild(img);
          a.appendChild(span);
          document.getElementById('standort_output').appendChild(a);
        }
      });
    } else {
      this.apiService.postEndpunkt(input, 'standortm').subscribe((data) => {
        console.log(data);
        this.idlist_standorte = Array<any>();
        var standorte = data['standorte'];
        var frame = document.getElementById('standort_output');
        frame.innerHTML = '';
        console.log(standorte);
        for (let i = 0; i < standorte.length; i++) {
          var ele = this.apiService.constructHTML('standortm', standorte[i]);
          //console.log(ele);
          frame.appendChild(ele);
          if (i == 0) {
            (
              document.getElementById(standorte[i]['id']) as HTMLInputElement
            ).checked = true;
          }
          this.idlist_standorte.push(standorte[i]);
        }
        //console.log(this.idlist_standorte);
      });
    }
  }

  timeAdjust() {
    //0Startdatum 1 Startzeit 2 Enddatum 3 Endzeit wenn Enddatum offen werden 30 Tage angezeigt im Kalendar
    var startdatum = (document.getElementById('start') as HTMLInputElement)
      .value;
    var startdatum2 = new Date(startdatum).getTime() / 1000;
    console.log('Startdatum: ' + startdatum2);
    var heute = new Date();
    var month = heute.getMonth() + 1;
    var datestring = heute.getDate().toString();
    if (datestring.length == 1) {
      datestring = '0' + datestring;
    }
    var heute2 = heute.getFullYear() + '-' + month + '-' + datestring;
    var heute3 = new Date(heute2);
    var heute4 = heute3.getTime() / 1000;
    console.log('Heute: ' + heute2);
    if (heute4 > startdatum2 || startdatum == '') {
      (document.getElementById('start') as HTMLInputElement).value = heute2;
      startdatum = heute2;
    }
    //console.log('Heute: ' + heute2);
    var startzeit = (document.getElementById('start-zeit') as HTMLInputElement)
      .value;
    var enddatum = (document.getElementById('ende') as HTMLInputElement).value;
    var endzeit = (document.getElementById('ende-zeit') as HTMLInputElement)
      .value;

    this.zeit[0] = startdatum;
    if (startzeit != 'Uhrzeit') {
      this.zeit[1] = startzeit;
    }
    this.zeit[2] = enddatum;
    if (endzeit != 'Uhrzeit') {
      this.zeit[3] = endzeit;
    }

    var a = new Date(this.zeit[0]).getTime();
    var b = new Date(this.zeit[2]).getTime();

    if (a > b) {
      var c = a;
      a = b;
      b = c;
    }
    var d = (b - a) / (1000 * 24 * 60 * 60);

    var weekends = false;
    var weekends_counter = 0;
    for (let i = 0; i < d + 1; i++) {
      var daynum = (new Date(a + i * 1000 * 24 * 60 * 60).getDay() + 6) % 7;
      console.log(daynum);
      var datu = new Date(a + i * 1000 * 24 * 60 * 60);
      console.log(datu);
      if (daynum == 5 || daynum == 6) {
        weekends = true;
        weekends_counter++;
      }
    }
    var weekends2 = (
      document.getElementById('hinweis_check') as HTMLInputElement
    ).checked;
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
    this.zeit[7] = d2;

    this.zeit[5] = weekends_counter;
    this.zeit[6] = (
      document.getElementById('hinweis_check') as HTMLInputElement
    ).checked;
    if (weekends) {
      document.getElementById('hinweis').style.display = 'block';
    } else {
      document.getElementById('hinweis').style.display = 'none';
    }
    var the_end = (document.getElementById('the_end') as HTMLInputElement)
      .checked;
    if (the_end && !enddatum) {
      document.getElementById('mietende1').style.display = 'none';
      document.getElementById('mietende2').style.display = 'block';
    }
    if (enddatum && !the_end) {
      document.getElementById('mietende1').style.display = 'block';
      document.getElementById('mietende2').style.display = 'none';
    }
    if (!the_end && !enddatum) {
      document.getElementById('mietende1').style.display = 'block';
      document.getElementById('mietende2').style.display = 'block';
    }
    this.zeit[4] = the_end;

    if (
      (this.zeit[0] != '' && this.zeit[2] != '') ||
      (this.zeit[0] != '' && the_end)
    ) {
      //Hier API Anfrage und display="block" als reaktion auf Daten
      this.loadCalendar();
    } else {
      document.getElementById('calender').style.display = 'none';
    }

    if (the_end) {
      console.log('Das Ende ist (nicht) nah.');
    }
    if (
      (the_end && this.zeit[0] != '' && this.zeit[1] != 'Uhrzeit') ||
      (this.zeit[2] != '' &&
        this.zeit[3] != 'Uhrzeit' &&
        this.zeit[0] != '' &&
        this.zeit[1] != 'Uhrzeit')
    ) {
      //weiter button sichtbar
      //document.getElementById('weiter').style.display = 'block';
      var router = this.router;
      var product = this.product;
      document
        .getElementById('weiter')
        .addEventListener('click', function (event) {
          router.navigate(['mietprozess/empfehlung', product['slug']], {});
        });
    } else {
      //document.getElementById('weiter').style.display = 'none';
      document
        .getElementById('weiter')
        .addEventListener('click', function (event) {
          scroll(0, 0);
          var startdatum = document.getElementById('start') as HTMLInputElement;
          var startzeit = document.getElementById(
            'start-zeit'
          ) as HTMLInputElement;
          var enddatum = document.getElementById('ende') as HTMLInputElement;
          var endzeit = document.getElementById(
            'ende-zeit'
          ) as HTMLInputElement;
          var the_end = (document.getElementById('the_end') as HTMLInputElement)
            .checked;

          if (startdatum.value == '') {
            startdatum.style.border = '1px solid red';
          } else {
            startdatum.style.border = '1px solid black';
          }
          if (enddatum.value == '' && !the_end) {
            enddatum.style.border = '1px solid red';
          } else {
            enddatum.style.border = '1px solid black';
          }

          if (startzeit.value == 'Uhrzeit') {
            startzeit.style.border = '1px solid red';
          } else {
            startzeit.style.border = '1px solid black';
          }
          if (endzeit.value == 'Uhrzeit' && !the_end) {
            endzeit.style.border = '1px solid red';
          } else {
            endzeit.style.border = '1px solid black';
          }

          event.preventDefault();
        });
    }
    console.log(this.zeit);
    sessionStorage.setItem('ZEIT', JSON.stringify(this.zeit));
  }

  onload() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    console.log('Index2: ' + sessionStorage.getItem('Stateindex'));
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    scroll(0, 0);
    this.apiService.externalLogoutCheck2();
  }

  ngOnInit() {
    var mode = this.mode;
    var imgsrc = this.imgsrc;
    var imgsize = this.imgsize;
  }

  loadCalendar() {
    var input = this.apiService.generateInput([
      ['startdatum', this.zeit[0]],
      ['enddatum', this.zeit[2]],
      ['produkt', this.product['slug']],
      ['theend', this.zeit[4]],
    ]);
    var a = new Date(this.zeit[0]).getTime();
    var b = new Date(this.zeit[2]).getTime();

    if (a > b) {
      var c = a;
      a = b;
      b = c;
    }
    var d = (b - a) / (1000 * 24 * 60 * 60);

    console.log('Difference in Days: ' + d);

    var input2 = this.apiService.generateInput([
      ['slug', this.product['slug']],
    ]);
    //console.log(input2); works
    this.apiService.postEndpunkt(input2, 'empfehlung').subscribe((data) => {
      console.log('Empfehlung');
      console.log(data);
      if (data['success']) {
        localStorage.setItem(
          'Produkt' + data['success']['slug'],
          JSON.stringify(data['success'])
        );
        var frame = document.getElementById('empfehlung');
        //frame.innerHTML = '<h4>Empfehlung</h4>';
        console.log(data);
        var env = this;
        var ele = this.apiService.constructHTML('empfalt', data['success']);
        frame.appendChild(ele);
        var hash = ele.getAttribute('data-hash');
        document
          .getElementById('a' + hash)
          .addEventListener('click', function (event) {
            console.log('detailseite');
            env.router.navigate(
              ['produktdetailseite', data['success']['slug']],
              {}
            );
          });

        document
          .getElementById('b' + hash)
          .addEventListener('click', function (event) {
            console.log('wechsel');
            env.router.navigate(
              ['mietprozess/zeit', data['success']['slug']],
              {}
            ); //need refresh method from tanzfaktur
            scroll(0, 0);
            env.refreshComponentNav(
              'mietprozess/zeit',
              data['success']['slug']
            );
          });
      }
    });
    this.apiService.postEndpunkt(input2, 'alternativen').subscribe((data) => {
      console.log('Alternativen');
      console.log(data);
      if (data['success']) {
        var frame = document.getElementById('alternativen');
        //frame.innerHTML = '<h4>Alternativen</h4>';
        var rel = data['success'];
        var env = this;
        for (let i = 0; i < rel.length; i++) {
          var ele = this.apiService.constructHTML('empfalt', rel[i]);
          localStorage.setItem(
            'Produkt' + rel[i]['slug'],
            JSON.stringify(rel[i])
          );
          frame.appendChild(ele);
          var hash = ele.getAttribute('data-hash');
          document
            .getElementById('a' + hash)
            .addEventListener('click', function (event) {
              console.log('detailseite');
              env.router.navigate(['produktdetailseite', rel[i]['slug']], {});
            });

          document
            .getElementById('b' + hash)
            .addEventListener('click', function (event) {
              console.log('wechsel');
              env.router.navigate(['mietprozess/zeit', rel[i]['slug']], {}); //need refresh method from tanzfaktur
              scroll(0, 0);
              env.refreshComponentNav('mietprozess/zeit', rel[i]['slug']);
            });
        }
      }
    });
    if (this.zeit[1] && this.zeit[3] && this.zeit[0] && this.zeit[2] && d < 4) {
      this.apiService.postEndpunkt(input, 'calendar').subscribe((data) => {
        console.log(data);
        if (this.zeit[4] == 'false') {
          this.laenge = parseInt(data['calendar']['laenge']);
        }
        sessionStorage.setItem('calender', JSON.stringify(data['calendar']));
        document.getElementById('calender').style.display = 'block';
        //document.getElementById('empfehlung1b').style.display = 'block';
        //document.getElementById('alternativen1b').style.display = 'block';
        this.calenderVerwaltung();
      });
    } else {
      document.getElementById('calender').style.display = 'none';
      //document.getElementById('empfehlung1b').style.display = 'none';
      //document.getElementById('alternativen1b').style.display = 'none';
    }
  }

  calenderVerwaltung() {
    var left = document.getElementById('left_arrow');
    var right = document.getElementById('right_arrow');

    var calender = JSON.parse(sessionStorage.getItem('calender'));

    var min = calender['min'];
    var max = calender['max'];
    var startindex = calender['start'];

    var length = calender['entries'].length;

    var frame = document.getElementById('verwaltung_calender');
    frame.innerHTML = '';
    left.style.display = 'none';
    for (let i = 0; i < length; i++) {
      var ele = this.apiService.constructHTML(
        'calendar',
        calender['entries'][i]
      );
      if (i > 13) {
        ele.style.display = 'none';
      }
      frame.appendChild(ele);
    }
    console.log(length);
  }

  refreshGesamt() {
    //console.log('test');
    var gesamtpreis = 0;
    //console.log('refresh Gesamtpreis');
    var relevant = document.getElementsByClassName('formularinput');
    console.log(relevant);
    var versicherungen = document.getElementsByClassName('versicherungen');
    console.log(versicherungen);
    var anzahlproduct = parseInt(
      (document.getElementById('preisstorage') as HTMLInputElement).value
    );
    console.log('Anzahl Produkt: ' + anzahlproduct);
    var bundleselects = document.getElementsByClassName('bundleselect');
    var gesamt = 0;
    for (let j = 0; j < bundleselects.length; j++) {
      var e7 = bundleselects[j] as HTMLSelectElement;

      var wert3 = parseInt(
        (document.getElementById(bundleselects[j].id) as HTMLSelectElement)
          .value
      );
      if (!wert3) {
        wert3 = 0;
      }
      console.log('Wert: ' + wert3);
      gesamt += wert3;
      //console.log('Anzahl Bundle: ' + wert3 + ', Gesamt: ' + gesamt);
    }
    //console.log('----------');
    console.log('Gesamt: ' + gesamt);
    if (gesamt > anzahlproduct) {
      anzahlproduct = gesamt;
      var stor = document.getElementById('preisstorage') as HTMLSelectElement;
      stor.innerHTML = '';
      for (let x17 = 1; x17 <= 5; x17++) {
        stor.innerHTML += '<option>' + x17 + '</option>';
      }
      stor.value = anzahlproduct + '';
    }
    for (let i = 0; i < relevant.length; i++) {
      //console.log(relevant[i]['tagName']);
      if (relevant[i].classList.contains('chosen')) {
        var preis = parseFloat(relevant[i].getAttribute('data-wert'));
        console.log('Wert: ' + preis + ', Multiplier: ' + anzahlproduct);
        gesamtpreis += preis * anzahlproduct;
      } else {
        if (relevant[i]['tagName'] == 'SELECT') {
          //console.log((relevant[i] as HTMLSelectElement).value);
          var value = (relevant[i] as HTMLSelectElement).value;
          if (value != 'Anzahl wählen...') {
            //console.log(parseInt(value));
            //console.log(relevant[i].getAttribute('data-wert'));
            var valueint = parseInt(value);
            var wert: number = parseFloat(
              relevant[i].getAttribute('data-wert')
            );
            console.log('Wert: ' + wert + ', Multiplier: ' + valueint);
            gesamtpreis += wert * valueint;
          }
        } else {
          if ((relevant[i] as HTMLInputElement).checked) {
            //console.log('TOASTBROT');
            console.log(relevant[i]);
            var multiplier = 1;
            if (relevant[i].classList.contains('versicherungen_bundles')) {
              var identry;
              for (let k = 0; k < relevant[i].classList.length; k++) {
                console.log(relevant[i].classList[k]);
                var entry = relevant[i].classList[k];
                if (
                  entry != 'versicherung1' &&
                  entry != 'versicherungen_bundles' &&
                  entry.includes('versicherung')
                ) {
                  identry = entry;
                }
              }
              var new_id = identry.split('versicherung')[1];
              console.log(identry);
              console.log(new_id);
              var new_value = parseInt(
                (document.getElementById(new_id) as HTMLSelectElement).value
              );
              if (new_value) {
                multiplier = new_value;
              }
            } else {
              multiplier = anzahlproduct;
            }
            var wert: number = parseFloat(
              relevant[i].getAttribute('data-wert')
            );
            console.log('Wert: ' + wert + ', Multiplier: ' + multiplier);
            gesamtpreis += wert;
          }
        }
      }
    }
    document.getElementById('gesamtpreis').innerHTML =
      gesamtpreis.toFixed(2) + '€/Tag';
    if (this.zeit[7]) {
      var days = parseInt(this.zeit[7]);

      console.log(days + ':' + gesamtpreis);
      var preis = days * gesamtpreis;
      document.getElementById('gesamtpreis').innerHTML = preis.toFixed(2) + '€';
    } else {
      document.getElementById('gesamtpreis').innerHTML =
        '&Oslash; ' + gesamtpreis.toFixed(2) + '€/Tag';
    }
    document
      .getElementById('gesamtpreis')
      .setAttribute('data-fuzck', gesamtpreis.toFixed(2));

    var env = this;
    $('.alternativ27').click(function () {
      var env2 = this;
      env.changelistener(env2);
    });
  }

  onload_zeit() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    console.log('Index2: ' + sessionStorage.getItem('Stateindex'));
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    scroll(0, 0);
    console.log('Zeit Auswahl geladen');
    //console.log(window.innerHeight);
    console.log(this.zeit);
    var the_end = (document.getElementById('the_end') as HTMLInputElement)
      .checked;
    if (
      (the_end && this.zeit[0] != '' && this.zeit[1] != 'Uhrzeit') ||
      (this.zeit[0] != '' &&
        this.zeit[1] != 'Uhrzeit' &&
        this.zeit[2] != '' &&
        this.zeit[3] != 'Uhrzeit')
    ) {
      //weiter button sichtbar
      //document.getElementById('weiter').style.display = 'block';
      var router = this.router;
      var product = this.product;
      document
        .getElementById('weiter')
        .addEventListener('click', function (event) {
          router.navigate(['mietprozess/auswahl', product['slug']], {});
        });
    } else {
      //document.getElementById('weiter').style.display = 'none';
      document
        .getElementById('weiter')
        .addEventListener('click', function (event) {
          event.preventDefault();
        });
    }
    var heute = new Date();
    var month = heute.getMonth() + 1;
    var datestring = heute.getDate().toString();
    if (datestring.length == 1) {
      datestring = '0' + datestring;
    }
    var heute2 = heute.getFullYear() + '-' + month + '-' + datestring;
    if (this.zeit[0] == '') {
      this.zeit[0] = heute2;
    }
    (document.getElementById('start') as HTMLInputElement).value = this.zeit[0];
    (document.getElementById('start-zeit') as HTMLInputElement).value =
      this.zeit[1];
    (document.getElementById('ende') as HTMLInputElement).value = this.zeit[2];
    (document.getElementById('ende-zeit') as HTMLInputElement).value =
      this.zeit[3];
    (document.getElementById('the_end') as HTMLInputElement).checked =
      this.zeit[4];
    (document.getElementById('hinweis_check') as HTMLInputElement).checked =
      this.zeit[6];
    this.timeAdjust();
  }

  slugify(input: string): string {
    input = input.replace(' ', '-');
    input = input.toLowerCase();
    input = input.replace('ä', 'ae');
    input = input.replace('ö', 'oe');
    input = input.replace('ü', 'ue');
    input = input.replace('ß', 'sz');
    input = input.replace('(', '');
    input = input.replace(')', '');
    input = input.replace('.', '');
    input = input.trim();
    if (input.includes('gabel') && input.includes('tele')) {
      input = 'gabel-telestapler';
    }
    return input;
  }

  getWizard(): Array<WizardStage> {
    var result = Array<WizardStage>();
    //temp loesung start
    var input = [
      new Input(
        0,
        ['Arbeiten am Einfamilienhaus', 'Baumschnitt', 'Sonstige Arbeiten'],
        true,
        [],
        'Ort'
      ),
    ];
    var fragen = Array<Fragen>();
    fragen.push(new Fragen('Wofür brauchen Sie das Gerät?', input, []));
    result.push(
      new WizardStage(
        fragen,
        'lorem ipsum donor',
        'lorem ipsum',
        'https://diesdas.codersunlimited.de/diesdas/assets/images/_temp/image.jpg',
        0
      )
    );
    //Antwort Einfamilienhaus
    //Einfahrt höhe breite, Stellplatz breite tiefe, untergrundgegebenheit, innen/außen, seitl. Reichweite,störkante, Strom vorhanden
    var input = [
      new Input(6, ['Höhe', '0', '100', '1'], true, [], 'EinfahrtHoehe'),
      new Input(6, ['Breite', '0', '100', '2'], true, [], 'EinfahrtBreite'),
    ];
    var fragen = Array<Fragen>();
    fragen.push(new Fragen('Wie groß ist die Einfahrt?', input, []));
    var input = [
      new Input(6, ['Tiefe', '0', '100', '1'], true, [], 'StellplatzTiefe'),
      new Input(6, ['Breite', '0', '100', '2'], true, [], 'StellplatzBreite'),
    ];
    //var fragen = Array<Fragen>();
    fragen.push(new Fragen('Wie groß ist der Stellplatz?', input, []));
    var input = [
      new Input(0, ['Gut', 'Geht', 'Kekse'], true, [], 'Untergrundgegebenheit'),
    ];
    //var fragen = Array<Fragen>();
    fragen.push(new Fragen('Wie ist die Untergrundgegebenheit?', input, []));

    var input = [new Input(1, [], false, [], 'Stoerkante')];
    //var fragen = Array<Fragen>();
    fragen.push(new Fragen('Ist eine Störkante vorhanden?', input, []));

    var input = [
      new Input(0, ['Innen', 'Außen', 'Innen und Außen'], true, [], 'Ort2'),
    ];
    //var fragen = Array<Fragen>();
    fragen.push(new Fragen('Wo müssen sie arbeiten?', input, []));

    var input = [new Input(1, [], false, [], 'Stromanschluss')];
    //var fragen = Array<Fragen>();
    fragen.push(new Fragen('Ist ein Stromanschluss vorhanden?', input, []));

    var input = [
      new Input(6, ['', '20', '400', '10'], false, [], 'seitlReichweite'),
    ];
    fragen.push(new Fragen('Wie viel seitliche Reichweite?', input, []));
    result.push(
      new WizardStage(
        fragen,
        'lorem ipsum donor',
        'lorem ipsum',
        'https://diesdas.codersunlimited.de/diesdas/assets/images/_temp/image.jpg',
        1
      )
    );
    if (localStorage.getItem('wizard')) {
      result = JSON.parse(localStorage.getItem('wizard'));
    }
    //temp loesung ende
    return result;
  }

  implementProdukte(produkte: Array<any>, context: any) {
    var frame = document.getElementById('produkte');
    frame.innerHTML = '';
    console.log(produkte);
    var count = produkte['count'];
    document.getElementById('search-box').remove();
    for (let i = 0; i < count; i++) {
      localStorage.setItem(
        'Produkt' + produkte[i]['slug'],
        JSON.stringify(produkte[i])
      );
      var content = context.apiService.constructHTML(
        'ProduktOverview1',
        produkte[i]
      );
      sessionStorage.setItem('wayward', 'kategorien');

      var router = context.router;
      //if (sessionStorage.getItem('ORDER')) {
      //  context.order = JSON.parse(sessionStorage.getItem('ORDER'));
      //}
      frame.appendChild(content);
    }
  }

  searchProdukt() {
    var suchwort = (document.getElementById('eingabe') as HTMLInputElement)
      .value;
    suchwort.toLowerCase();
    if (
      suchwort == 'hundewelpen' ||
      suchwort == 'kaetzchen' ||
      suchwort == 'toastbrot' ||
      suchwort == 'kätzchen'
    ) {
      var input = this.apiService.generateInput([['suchwort', suchwort]]);

      this.apiService.ostern(suchwort).subscribe((data) => {
        console.log(data);
        document.getElementById('target1').innerHTML = '';
        for (let i = 0; i < data['items'].length; i++) {
          console.log(data['items'][i]);
          var a = document.createElement('a');
          a.href = data['items'][i]['link'];
          a.target = '_self';
          a.classList.add('teaser');

          var img = document.createElement('img');
          img.src = data['items'][i]['link'];

          var span = document.createElement('span');
          span.innerHTML = data['items'][i]['title'];

          a.appendChild(img);
          a.appendChild(span);
          document.getElementById('target1').appendChild(a);
        }
      });
    } else {
      console.log('Produktsuche');
      var input = this.apiService.generateInput([['slug', suchwort]]);

      this.apiService.postEndpunkt(input, 'search1').subscribe((data) => {
        console.log(data);
        var frame = document.getElementById('target1');
        console.log(frame);
        if (!frame) {
          console.log('nope');
          frame = document.getElementById('outletx');
        }
        if (!frame) {
          console.log('nope2');
          frame = document.getElementById('produkte');
        }
        if (!frame) {
          console.log('nope3');
          frame = document.getElementById('target1b');
        }
        frame.innerHTML = '';
        console.log('title');
        document.getElementById('target1name').innerHTML = 'Produkt wählen';
        var count = data['success']['count'];
        var produkte = data['success'];
        for (let i = 0; i < count; i++) {
          localStorage.setItem(
            'Produkt' + produkte[i]['slug'],
            JSON.stringify(produkte[i])
          );
          var content = this.apiService.constructHTML(
            'ProduktOverview1',
            produkte[i]
          );
          var router = this.router;
          frame.appendChild(content);
        }
      });
    }
  }

  onload_auswahl() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    console.log('Index2: ' + sessionStorage.getItem('Stateindex'));
    /*
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    */
    document.getElementById('id_c2a').style.display = 'none';
    scroll(0, 0);
    console.log('zubehoer');
    var zubehoer = document.getElementById('zubehoer');
    console.log('bundles');
    var bundles = document.getElementById('bundles');
    console.log('versicherungen1');
    var versicherungen1 = document.getElementById('versicherungen1');
    //var versicherungen2 = document.getElementById('versicherungen2');
    console.log('storage');
    document
      .getElementById('preisstorage')
      .setAttribute('data-wert', this.product['preis'].split('|')[0]);
    zubehoer.innerHTML = '';
    bundles.innerHTML = '';
    versicherungen1.innerHTML = '';
    var preisshow = document.getElementById('preis');

    //versicherungen2.innerHTML = '';
    //API abfrage Lade zubehoer, bundles und versicherungen1 und 2 auf Basis des Produktnamens

    var input = this.apiService.generateInput([
      ['product', this.product['uid']],
      ['category', this.slugify(this.product['hauptkategorie'])],
    ]);

    this.apiService
      .postEndpunkt(input, 'additionalmietprozess')
      .subscribe((data) => {
        console.log(data['additional']);
        this.hilfs_array[1] = data['additional'];
        this.constructAdditional(data['additional']);
        var ZEIT = JSON.parse(sessionStorage.getItem('ZEIT'));
        var STANDORT = JSON.parse(sessionStorage.getItem('STANDORT'));
        console.log('ZEIT');
        console.log(ZEIT);
        console.log('STANDORT');
        console.log(STANDORT);
        this.refreshGesamt();
      });
    //console.log(input);
    //console.log(sessionStorage.getItem())

    //var ORDER=JSON.parse(sessionStorage.getItem("ORDER"));
    this.apiService.loadMenue(this.router);
  }

  constructAdditional(data: any) {
    console.log('start');
    var zubehoer = data['zubehoer'];
    var bundles = data['bundles'];
    var versicherungen1 = data['versicherungen1'];
    var versicherungen2 = data['versicherungen2'];
    var env = this;
    sessionStorage.setItem(
      'versicherungen',
      JSON.stringify(data['versicherungen1'])
    );
    sessionStorage.setItem(
      'versicherungen_bundles',
      JSON.stringify(data['versicherungen2'])
    );
    console.log('start construction');
    //console.log(zubehoer.length);
    for (let i = 0; i < zubehoer.length; i++) {
      var ele = zubehoer[i];
      //console.log(ele);
      var gesamt = parseFloat(ele['preis1']) + parseFloat(ele['preis2']);
      //console.log(gesamt);
      var html_ele = this.apiService.constructHTML('ProduktAdditional1', ele);

      //console.log(html_ele);
      var hash = html_ele.getAttribute('data-hash');
      //console.log(hash);
      document.getElementById('zubehoer').appendChild(html_ele);
      document.getElementById('b' + hash).classList.add('zubehoerselect');
      if (this.zeit[7]) {
        var days = parseInt(this.zeit[7]);
        console.log(days + ':' + gesamt);
        var preis7 = days * gesamt;

        var gesamt2 = parseFloat(ele['preis']);
        var preis2 = days * gesamt2;
        document.getElementById(hash).innerHTML = preis2.toFixed(2) + '€';
      } else {
        document.getElementById(hash).innerHTML =
          parseFloat(ele['preis']).toFixed(2) + '€/Tag';
      }
      var hash2 = html_ele.getAttribute('data-hash2');
      document
        .getElementById(hash2)
        .addEventListener('click', function (event) {
          var slug = this.getAttribute('data-hash7');
          env.router.navigate(['/produktdetailseite', slug]);
        });

      document
        .getElementById('b' + hash)
        .setAttribute('data-wert', ele['preis'].split('|')[0]);
      document
        .getElementById('b' + hash)
        .addEventListener('change', function (event) {
          env.refreshGesamt();
        });
    }
    console.log('alpha');
    for (let i = 0; i < bundles.length; i++) {
      var ele = bundles[i];
      console.log(ele);
      var gesamt = parseFloat(ele['preis1']) + parseFloat(ele['preis2']);
      //console.log(gesamt);
      var html_ele = this.apiService.constructHTML('ProduktAdditional1', ele);
      //console.log(html_ele);
      var hash = html_ele.getAttribute('data-hash');
      //console.log(hash);
      document.getElementById('bundles').appendChild(html_ele);

      var hash2 = html_ele.getAttribute('data-hash2');
      document
        .getElementById(hash2)
        .addEventListener('click', function (event) {
          var slug = this.getAttribute('data-hash7');
          env.router.navigate(['/produktdetailseite', slug]);
        });
      if (this.zeit[7]) {
        var days = parseInt(this.zeit[7]);
        console.log(days + ':' + gesamt);
        var preis7 = days * gesamt;

        var gesamt2 = parseFloat(ele['preis']);
        var preis2 = days * gesamt2;
        document.getElementById(hash).innerHTML =
          '<u>' +
          preis7.toFixed(2) +
          '€</u> im Bundle nur ' +
          preis2.toFixed(2) +
          '€';
      } else {
        document.getElementById(hash).innerHTML =
          '<u>' +
          gesamt.toFixed(2) +
          '€</u> im Bundle nur ' +
          parseFloat(ele['preis']).toFixed(2) +
          '€/Tag';
      }

      document.getElementById('b' + hash).classList.add('bundleselect');
      document
        .getElementById('b' + hash)
        .setAttribute('data-wert', parseFloat(ele['preis']).toFixed(2));
      document.getElementById('b' + hash).classList.add('alternativ27');
      document
        .getElementById('b' + hash)
        .addEventListener('change', function (event) {
          var env2 = this;
          //env.changelistener(env2);
        });
    }
    console.log('beta');
    for (let i = 0; i < versicherungen1.length; i++) {
      var ele = versicherungen1[i];
      //console.log(ele);
      var html_ele = this.apiService.constructHTML('ProduktAdditional2', ele);
      //console.log(html_ele);
      var hash = html_ele.getAttribute('data-hash');
      //console.log(hash);
      document.getElementById('versicherungen1').appendChild(html_ele);
      if (ele['text'].includes('1000,00')) {
        (document.getElementById(hash) as HTMLInputElement).checked = true;
      }
      (document.getElementById(hash) as HTMLInputElement).name =
        this.product['slug'];
      document
        .getElementById(hash)
        .setAttribute(
          'data-prev',
          (document.getElementById(hash) as HTMLSelectElement).value
        );
      document
        .getElementById(hash)
        .addEventListener('change', function (event) {
          env.refreshGesamt();
        });
    }

    this.refreshGesamt();
    this.apiService.loadMenue(this.router);
    var preis = document
      .getElementById('gesamtpreis')
      .getAttribute('data-fuzck');
    //this.order[4] = preis;
    var ZEIT = this.zeit;
    var STANDORT = this.standort;
    var ORDER = this.order;
    var anzahlproduct = parseInt(
      (document.getElementById('preisstorage') as HTMLInputElement).value
    );
    console.log('Produkt:');
    console.log(anzahlproduct);
    var gesamtpreis = document
      .getElementById('gesamtpreis')
      .getAttribute('data-fuzck');
    console.log(anzahlproduct);
    console.log(this.hilfs_array);
    this.state_auswahl[0].push(this.hilfs_array[0]);
    this.state_auswahl[0].push(anzahlproduct);
    this.state_auswahl[4] = gesamtpreis;
    console.log('Zeit');
    console.log(ZEIT);
    console.log('Standort');
    console.log(STANDORT);
    console.log('State');
    console.log(this.state_auswahl);
    /*
    Auswahl beeinhaltet onload:
     Zeit
     Ort
     produkt
     Versicherung
    */
    //var input=this.apiService.generateInput([[]]);
    var produkt = this.apiService.generateInput([
      ['name', this.state_auswahl[0][0]['produkt']],
      ['uid', this.state_auswahl[0][0]['uid']],
      ['hauptkategorie', this.state_auswahl[0][0]['hauptkategorie']],
      ['anzahl', anzahlproduct],
      ['preis', this.state_auswahl[0][0]['preis'].split('|')[0]],
      ['slug', this.state_auswahl[0][0]['slug']],
    ]);

    var produktb = JSON.parse(produkt);
    sessionStorage.setItem('last', this.state_auswahl[0][0]['slug']);
    console.log(produktb);
    var versicherung;
    var id = '';
    var eles = document.getElementsByClassName('formularinput versicherung1');
    for (let i = 0; i < eles.length; i++) {
      if ((eles[i] as HTMLInputElement).checked) {
        id = eles[i].id;
      }
    }
    var listeofversicherung = this.hilfs_array[1]['versicherungen1'];
    for (let i = 0; i < listeofversicherung.length; i++) {
      if (listeofversicherung[i]['id'] == id) {
        versicherung = listeofversicherung[i];
      }
    }
    var auswahl = Array<any>();
    auswahl.push('gesamtpreis');
    auswahl.push(gesamtpreis);

    auswahl.push('produkt');
    auswahl.push(produktb);

    auswahl.push('zeit');
    auswahl.push(ZEIT);

    auswahl.push('standort');
    auswahl.push(STANDORT);

    auswahl.push('versicherung');
    auswahl.push(versicherung);

    auswahl.push('token');
    auswahl.push(sessionStorage.getItem('Usertoken'));

    auswahl.push('email');
    auswahl.push(sessionStorage.getItem('Email'));

    auswahl.push('id');
    auswahl.push(this.stateid);

    console.log('State ID: ' + this.stateid);

    console.log(auswahl);
    var output = JSON.stringify(auswahl);
    this.apiService.postEndpunkt(output, 'saveauswahl').subscribe((data) => {
      console.log(data);
      sessionStorage.setItem('Stateindex', data['success']['index']);
      console.log('RAW: ' + data['success']['index']);
      console.log('Index2: ' + sessionStorage.getItem('Stateindex'));
      if (this.zeit[7] || this.zeit[7] == 0) {
        var days = parseInt(this.zeit[7]);
        var gesamt = parseFloat(auswahl[1]);
        console.log(days + ':' + gesamt);
        var preis = days * gesamt;

        document.getElementById('gesamtpreis').innerHTML =
          preis.toFixed(2) + '€';
      } else {
        var gesamt = parseFloat(auswahl[1]);
        document.getElementById('gesamtpreis').innerHTML =
          '&Oslash; ' + gesamt.toFixed(2) + '€/Tag';
      }
    });
    this.auswahl_list = auswahl;
    //marker AUSWAHL
  }

  changelistener(env2: any) {
    var env = this;
    var prev = parseInt(env2.getAttribute('data-prev'));
    console.log('Previously: ' + prev);
    var wert = parseInt((env2 as HTMLInputElement).value);
    console.log('Wert: ' + wert);
    var produkte = parseInt(
      (document.getElementById('preisstorage') as HTMLInputElement).value
    );
    if (prev != wert) {
      console.log('Werte unterscheiden sich.');
      env2.setAttribute('data-prev', wert.toString());
      console.log(env2.getAttribute('data-prev') + '<=' + wert);
      env2.innerHTML = '';
      var sel = '';
      for (let i = 0; i <= 5; i++) {
        if (wert == i) {
          sel = "selected='true'";
        } else {
          sel = '';
        }
        if (i == 0) {
          env2.innerHTML = '<option ' + sel + '>Anzahl wählen...</option>';
        } else {
          env2.innerHTML += '<option ' + sel + '>' + i + '</option>';
        }
      }
      var ele = document.getElementById(env2.id + 'z');
      if (document.getElementById(env2.id + 'versicherungen')) {
        document.getElementById(env2.id + 'versicherungen').remove();
      }
      if (wert > 0 && wert) {
        ele.innerHTML +=
          "<div id='" +
          env2.id +
          "versicherungen' data-source='" +
          env2.id +
          "'><h6>Versicherungen für Bundles</h6></div>";
        var produkt = env2.getAttribute('data-produkt');
        env.appendVersicherungen(env2.id + 'versicherungen', produkt);
      } else {
        console.log('else');
        if (document.getElementById(env2.id + 'versicherungen')) {
          document.getElementById(env2.id + 'versicherungen').remove();
        }
      }
      env.refreshGesamt();
    }
    /*
    env2.addEventListener("change",function(event){
       env.changelistener(env2);
    });
    */
  }

  appendVersicherungen(id: string, produkt: string) {
    var versicherungen2 = JSON.parse(
      sessionStorage.getItem('versicherungen_bundles')
    );

    var frame = document.getElementById(id);
    frame.innerHTML = '<h5>Versicherungen ' + produkt + '</h5>';
    var source = frame.getAttribute('data-source');
    var env = this;
    for (let i = 0; i < versicherungen2.length; i++) {
      var ele = versicherungen2[i];
      //console.log(ele);
      var html_ele = this.apiService.constructHTML('ProduktAdditional2', ele);
      //console.log(html_ele);
      var hash = html_ele.getAttribute('data-hash');
      //console.log(hash);
      frame.appendChild(html_ele);
      if (ele['text'].includes('1500,00')) {
        (document.getElementById(hash) as HTMLInputElement).checked = true;
      }
      (document.getElementById(hash) as HTMLInputElement).name =
        'versicherung' + source;
      document.getElementById(hash).classList.add('versicherung' + source);
      document.getElementById(hash).classList.add('versicherungen_bundles');
      document.getElementById(hash).setAttribute('data-index', i.toString());
      document
        .getElementById(hash)
        .addEventListener('change', function (event) {
          env.refreshGesamt();
        });
    }
  }

  reconfigure() {
    //get every bundle select value
  }

  wizard_back() {
    var ele = document.getElementById('forward_wizard');
    var stufe = parseInt(ele.getAttribute('data-stufe'));
    console.log('Wizard Stufe: ' + stufe + ' -> ' + (stufe - 1));
    stufe--;
    if (stufe == -1) {
      this.router.navigate(['../']);
    } else {
      ele.setAttribute('data-stufe', String(stufe));
      this.progress = this.wizard[stufe];
      this.reloadWizard();
      window.scrollTo(0, 0);
    }
  }
  wizard_forward() {
    var ele = document.getElementById('forward_wizard');
    var stufe = parseInt(ele.getAttribute('data-stufe'));
    console.log('Wizard Stufe: ' + stufe + ' -> ' + (stufe + 1));
    this.getAntworten(this.wizard[stufe]);

    stufe++;
    if (stufe == this.wizard.length) {
      //this.router.navigate(['../']); //weiterleitung zur Empfehlung
      //alert('Coming Soon');
      console.log(this.answers);
      console.log('API Abfrage -> Weiterleitung');
      //this.router.navigate([""]);

      var input = JSON.stringify(this.answers);
      sessionStorage.setItem('antworten', input);
      this.apiService.postEndpunkt(input, 'wizardend').subscribe((data) => {
        console.log('-----Wizard Ergebnis------');
        console.log(data);
        var produkte = data['success'];
        for (let i = 0; i < produkte.length; i++) {
          localStorage.setItem(
            'Produkt' + produkte[i]['slug'],
            JSON.stringify(produkte[i])
          );
        }
        var dest = '/mietprozess/empfehlung/';
        this.product = data['success'][0];
        sessionStorage.setItem('found_produkte', JSON.stringify(produkte));

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

        sessionStorage.setItem('wayward', 'wizard');
        sessionStorage.setItem('wayward_para1', JSON.stringify(this.answers));
        this.router.navigate([dest, this.product['slug']]);
      });
    } else {
      ele.setAttribute('data-stufe', String(stufe));
      this.progress = this.wizard[stufe];
      this.reloadWizard();
      window.scrollTo(0, 0);
      scroll(0, 0);
    }
  }

  reloadWizard() {
    scroll(0, 0);
    //console.log('RELOAD');
    //passe das Modal An
    //console.log(this.progress);
    var modal = document.getElementById('id_modal_info');
    /*
    modal.innerHTML = '';
    var title = document.createElement('h3');
    title.innerHTML = this.progress.erklaerung_title;
    var link = document.createElement('img');
    link.src = this.progress.erklaerung_link;
    link.alt = 'image';
    var text = document.createElement('p');
    text.innerHTML = this.progress.erklaerung;

    modal.appendChild(title);
    modal.appendChild(link);
    modal.appendChild(text);
    modal.innerHTML += '<div style="clear:both;"><div></div></div>';
    */
    //passe das formular an
    var frame = document.getElementById('frage');
    frame.innerHTML = '';
    var special = Array<any>();
    var special2 = Array<any>();
    var field_counter = 0;
    for (let i = 0; i < this.progress.fragen.length; i++) {
      var ele = this.progress.fragen[i];
      //console.log(ele['conditions']);
      if (this.conditiontest(ele['conditions'])) {
        var outer = document.createElement('div');
        outer.classList.add('module');
        //outer.classList.add('lightgrey');

        var title = document.createElement('div');
        title.classList.add('inner');
        title.classList.add('inner-extra-intended');
        title.classList.add('boxed');

        var titlewrap = document.createElement('div');
        titlewrap.classList.add('box-head');

        var title2 = document.createElement('h3');
        title2.innerHTML = ele.frage;

        titlewrap.appendChild(title2);
        titlewrap.innerHTML +=
          '<a data-fancybox data-options=' +
          "'" +
          '{"touch" : false}' +
          "'" +
          ' data-src="#id_modal_info" href="javascript:void(0);" class="info" ><span>Info</span></a>';

        title.appendChild(titlewrap);

        outer.appendChild(title);

        var formdiv = document.createElement('div');
        formdiv.classList.add('inner-extra-intended');

        var form = document.createElement('form');

        //var extradiv=document.createElement("div");
        //extradiv.classList.add("centered");

        var doubleslideridlist = Array<string>();

        for (let j = 0; j < ele.input.length; j++) {
          //alle Eingabefelder zu dieser Fragen
          var input = ele.input[j];
          switch (input['type']) {
            case 0: {
              //select
              var select = document.createElement('select');
              select.classList.add('wizardstage');
              var name2 = 'wizard' + field_counter;
              field_counter++;
              select.id = name2;
              select.name = input['name'];
              for (let k = 0; k < input['options'].length; k++) {
                var option = document.createElement('option');
                option.innerHTML = input['options'][k];
                option.value = input['options'][k];
                select.appendChild(option);
              }
              form.appendChild(select);
              break;
            }
            case 1: {
              //yes no
              var divlevel = document.createElement('div');
              divlevel.classList.add('radio-checkbox-wrapper');
              var name = input['name'];
              var name2 = 'wizard' + field_counter;
              field_counter++;
              var name3 = 'wizard' + field_counter;
              field_counter++;
              divlevel.innerHTML =
                '<div class="radio-wrapper"><label>Ja<input id="' +
                name2 +
                '" class="wizardstage" type="radio"name="' +
                name +
                '" value="Ja" checked required="required" /><span class="checkmark checkmark-radio"></span>  </label></div><div class="radio-wrapper"><label>Nein<input id="' +
                name3 +
                '" class="wizardstage" type="radio" name="' +
                name +
                '" value="Nein" /><span class="checkmark checkmark-radio"></span></label></div><div style="clear:both;"><div></div></div>';
              var outerdivlevel = document.createElement('div');
              outerdivlevel.classList.add('centered');
              outerdivlevel.appendChild(divlevel);
              form.appendChild(outerdivlevel);
              break;
            }
            case 2: {
              //checkboxes
              break;
            }
            case 3: {
              //text
              var text3 = document.createElement('input');
              text3.type = 'Text';
              text3.name = input['name'];
              text3.placeholder = input['options'][0];
              form.appendChild(text3);
              break;
            }
            case 4: {
              //area
              break;
            }
            case 5: {
              //double point range input
              if (input['options'][0] != '') {
                var label = document.createElement('p');
                label.innerHTML = input['options'][0];
                form.appendChild(label);
              }
              console.log(input);
              var dpslider = document.createElement('div');
              dpslider.classList.add('slider-wrapper');
              var hash2 = this.apiService.makeid(10);
              dpslider.id = hash2;
              dpslider.setAttribute('data-start1', input['options'][1]);
              dpslider.setAttribute('data-start2', input['options'][2]);
              dpslider.setAttribute('data-min', input['options'][1]);
              dpslider.setAttribute('data-max', input['options'][2]);
              dpslider.setAttribute('data-step', input['options'][3]);
              var hash = this.apiService.makeid(8);
              doubleslideridlist.push(hash);
              /*
              dpslider.innerHTML =
                '<div id="slider' + hash + '" class="wizardstage"></div>';
              */
              var dpsl = document.createElement('div');
              dpsl.id = 'slider' + hash;
              dpsl.classList.add('wizardstage');
              dpsl.classList.add('selection-slider');
              dpsl.setAttribute('data-start1', input['options'][1]);
              dpsl.setAttribute('data-start2', input['options'][2]);
              dpsl.setAttribute('data-min', input['options'][1]);
              dpsl.setAttribute('data-max', input['options'][2]);
              dpsl.setAttribute('data-step', input['options'][3]);
              dpsl.setAttribute('data-parent', hash2);
              dpsl.setAttribute('data-name', 'doppelslider' + j);
              dpslider.appendChild(dpsl);
              dpslider.innerHTML +=
                "<p id='aslider" +
                hash +
                "'>" +
                input['options'][1] +
                'm - ' +
                input['options'][2] +
                'm</p>';
              var name = input['name'];
              dpsl.setAttribute('data-name', name);
              form.appendChild(dpslider);
              break;
            }
            case 6: {
              //double point range input
              var name = input['name'];
              var singlepointrange = document.createElement('input');
              singlepointrange.type = 'range';
              singlepointrange.name = name;
              singlepointrange.id = 'range' + i + '-' + j;
              singlepointrange.step = input['options'][3];
              singlepointrange.min = input['options'][1];
              singlepointrange.max = input['options'][2];
              singlepointrange.setAttribute('data-1', String(i));
              singlepointrange.setAttribute('data-2', String(j));
              singlepointrange.classList.add('wizardstage');
              singlepointrange.value = '0';
              if (input['options'][0] != '') {
                var label = document.createElement('p');
                label.innerHTML = input['options'][0];
                form.appendChild(label);
              }
              var output = document.createElement('p');
              output.id = 'output' + i + '-' + j;
              output.innerHTML = input['options'][1] + 'm';
              special.push([i, j]);
              form.appendChild(singlepointrange);
              form.appendChild(output);
              //0 ist label 1 ist start 2 ist ende 3 ist step
              //<input type="range" multiple value="10,80">
              break;
            }
          }
        }
        formdiv.appendChild(form);
        title.appendChild(formdiv);
        outer.innerHTML += '<div style="clear:both;"><div></div></div>';
        frame.appendChild(outer);
      }
    }
    console.log(doubleslideridlist);
    for (let i = 0; i < doubleslideridlist.length; i++) {
      var slider = document.getElementById('slider' + doubleslideridlist[i]);
      var start1 = parseInt(slider.getAttribute('data-start1'));
      var start2 = parseInt(slider.getAttribute('data-start2'));
      var min = parseInt(slider.getAttribute('data-min'));
      var max = parseInt(slider.getAttribute('data-max'));
      var step = parseInt(slider.getAttribute('data-step'));

      noUiSlider.create(slider, {
        start: [start1, start2],
        connect: true,
        step: step,
        range: {
          min: min,
          max: max,
        },
      });
      var parent = document.getElementById(slider.getAttribute('data-parent'));
      parent.addEventListener('mousemove', function (event) {
        var slider2 = slider;

        var inner = slider2.innerHTML;
        var parts = inner.split('left: ');
        var min = parseInt(slider2.getAttribute('data-min'));
        var max = parseInt(slider2.getAttribute('data-max'));
        //console.log('>>' + min + '<< >>' + max + '<<');
        //console.log(parts);
        var a = parts[1].split('%')[0];
        var b = parts[2].split('%')[0];
        //console.log('>>' + a + '<< >>' + b + '<<');
        var a2 = parseFloat(a);
        var b2 = parseFloat(b);
        //console.log(a2 + ' ' + b2);
        a2 = (a2 / 100) * (max - min) + min;
        b2 = (b2 / 100) * (max - min) + min;

        a2 = Math.round(a2);
        b2 = Math.round(b2);
        //console.log(a2 + ' ' + b2);
        if (a2 > b2) {
          var c = a2;
          a2 = b2;
          b2 = c;
        }
        //console.log(slider2.id);
        document.getElementById('a' + slider2.id).innerHTML =
          a2 + 'm - ' + b2 + 'm';
        //document.getElementById('b' + slider2.id).innerHTML = b2 + 'm';
      });
    }

    var debugoutput = document.createElement('p');
    debugoutput.innerHTML = JSON.stringify(this.answers);
    //frame.appendChild(debugoutput);
    //console.log(special);
    for (let x = 0; x < special.length; x++) {
      var name1 = 'range' + special[x][0] + '-' + special[x][1];
      document
        .getElementById(name1)
        .addEventListener('input', function (event) {
          var name2 =
            'output' +
            this.getAttribute('data-1') +
            '-' +
            this.getAttribute('data-2');
          //console.log('range');
          document.getElementById(name2).innerHTML =
            (this as HTMLInputElement).value + 'm';
        });
    }

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
        range[j].value = range[j].min;
      }
    }
    this.loadAntworten(this.progress);
  }

  getAntworten(input: WizardStage) {
    var level = input.id;
    //console.log(level);
    //get Inputs
    var fields = document.getElementsByClassName('wizardstage');
    //console.log(fields);
    var antworten = Array<any>();
    Array.from(fields).forEach((item) => {
      //console.log(item.getAttribute('type'));
      //console.log(item.tagName);
      var tag = item.tagName;
      console.log('Antwort von ' + tag);
      switch (tag) {
        case 'DIV': {
          //var antwort=item.noUiSlider.get();

          var slider = document.getElementById(item.id) as HTMLInputElement;
          console.log(slider);
          var inner = slider.innerHTML;
          var parts = inner.split('left: ');
          var min = parseInt(slider.getAttribute('data-min'));
          var max = parseInt(slider.getAttribute('data-max'));
          console.log('>>' + min + '<< >>' + max + '<<');
          //console.log(parts);
          var a = parts[1].split('%')[0];
          var b = parts[2].split('%')[0];
          console.log('>>' + a + '<< >>' + b + '<<');
          var a2 = parseFloat(a);
          var b2 = parseFloat(b);
          console.log(a2 + ' ' + b2);
          a2 = (a2 / 100) * (max - min) + min;
          b2 = (b2 / 100) * (max - min) + min;

          a2 = Math.round(a2);
          b2 = Math.round(b2);
          console.log(a2 + ' ' + b2);
          var antwort = item.getAttribute('data-name') + '=' + a2 + '=' + b2;
          antworten.push(antwort);
          break;
        }
        case 'SELECT': {
          var antwort =
            item.getAttribute('name') + '=' + (item as HTMLSelectElement).value;
          antworten.push(antwort);
          break;
        }
        case 'INPUT': {
          //console.log(item.getAttribute('type'));
          var type = item.getAttribute('type');
          switch (type) {
            case 'range': {
              var type2 = 'single';
              if (item.classList.contains('doublerange')) {
                type2 = 'double';
              }
              if (type2 == 'single') {
                var antwort =
                  item.getAttribute('name') +
                  '=' +
                  (item as HTMLInputElement).value;
                antworten.push(antwort);
              } else {
                var multi = document.getElementsByName(
                  item.getAttribute('name')
                );
                var antwort = item.getAttribute('name') + '=';
                var antwort2 = '';
                Array.from(multi).forEach((item2) => {
                  if (antwort2 == '') {
                    antwort2 = (item2 as HTMLInputElement).value;
                  } else {
                    antwort2 += ',' + (item2 as HTMLInputElement).value;
                  }
                });
                antwort += antwort2;
                if (!antworten.find((element) => element == antwort)) {
                  antworten.push(antwort);
                }
              }
              break;
            }
            case 'radio': {
              var name = item.getAttribute('name');
              var multi = document.getElementsByName(item.getAttribute('name'));
              Array.from(multi).forEach((item2) => {
                //console.log("checked");
                if ((item2 as HTMLInputElement).checked == true) {
                  var antwort =
                    item.getAttribute('name') +
                    '=' +
                    (item2 as HTMLInputElement).value;
                  if (!antworten.find((element) => element == antwort)) {
                    antworten.push(antwort);
                  }
                }
              });
              break;
            }
          }
          break;
        }
      }
    });
    //console.log(antworten);
    if (this.answers[level]) {
      console.log('Überschreiben');
      this.answers[level] = antworten;
    } else {
      console.log('Nicht überschreiben');
      this.answers.push(antworten);
    }
  }

  searchStandort() {
    var standorte = this.idlist_standorte;
    var standort: any;
    var chosen = false;
    for (let i = 0; i < standorte.length; i++) {
      if (
        (document.getElementById(standorte[i]['id']) as HTMLInputElement)
          .checked
      ) {
        standort = standorte[i];
        chosen = true;
      }
    }
    var megastandort = Array<any>();
    megastandort.push([]);
    if ((document.getElementById('abholung') as HTMLInputElement).checked) {
      this.additional_standort[0] = 'abholung';
      megastandort[0] = standort; //standort daten
    } else {
      this.additional_standort[0] = 'lieferung';
      var eles = document.getElementsByName('mystandorte');
      console.log(eles);
      var data = JSON.parse(sessionStorage.getItem('Standorte'))['standorte'];
      console.log('Data Laenge ' + data.length);

      console.log('Ele Laenge ' + eles.length);
      for (let i = 0; i < eles.length; i++) {
        if ((eles[i] as HTMLInputElement).checked) {
          var dataid = eles[i].getAttribute('data-id');
          console.log(dataid);
          const objectArray = Object.entries(data);
          objectArray.forEach(([key, value]) => {
            console.log(value['id'] + ' : ' + dataid);
            if (value['id'] == eles[i].getAttribute('data-id') && value['id']) {
              console.log('Match');
              megastandort[0] = value; //standort daten
            }
          });
        }
      }
    }
    if ((document.getElementById('bedienung') as HTMLInputElement).checked) {
      this.additional_standort[1] = true;
    } else {
      this.additional_standort[1] = false;
    }

    megastandort.push(this.additional_standort[0]); //standort abholung lieferung
    megastandort.push(this.additional_standort[1]); //standort bedienung
    sessionStorage.setItem('STANDORT', JSON.stringify(megastandort));
    this.standort = megastandort;
    var searchinput = document.getElementById(
      'searchinput'
    ) as HTMLInputElement;
    if (
      (this.additional_standort[0] == 'abholung' && chosen) ||
      this.additional_standort[0] == 'lieferung'
    ) {
      if (searchinput) {
        searchinput.style.border = '1px solid black';
      }
      console.log(this.standort);
      console.log(this.product);
      this.router.navigate(['mietprozess/zeit', this.product['slug']], {});
    } else {
      if (
        searchinput.value == '' ||
        document.getElementById('standort_output').innerHTML == ''
      ) {
        searchinput.style.border = '1px solid red';
      }
    }
  }

  nav(x: string) {
    console.log(x);
    //this.router.navigate([x], {});
    this.refreshComponentNav(x, '');
  }

  refreshComponent() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  refreshComponentNav(url: string, para: string) {
    let currentUrl = url + '/' + para;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  loadAntworten(input: WizardStage) {
    //console.log('WHOLE');
    //console.log(this.answers[input.id]);
    if (this.answers[input.id]) {
      console.log(this.answers[input.id]);
      for (let i = 0; i < this.answers[input.id].length; i++) {
        //console.log('ANTWORT');
        var count = this.answers[input.id][i].split('=').length;
        var itemname = this.answers[input.id][i].split('=')[0];
        var itemvalue = this.answers[input.id][i].split('=')[1];
        if (count > 2) {
          var itemvalue2 = this.answers[input.id][i].split('=')[2];
        }
        console.log('-------------------');
        console.log(itemname);
        console.log(itemvalue);
        var fields = document.getElementsByName(itemname);
        var index = 0;
        console.log(fields);
        if (itemname.includes('doppelslider')) {
          var sliderz = document.getElementsByClassName('wizardstage');
          var slider;
          for (let i = 0; i < sliderz.length; i++) {
            if (sliderz[i].getAttribute('data-name') == itemname) {
              slider = document.getElementById(sliderz[i].id);
            }
          }
          console.log('Doppelslider');
          console.log(itemname);
          console.log(slider);
          //slider.innerHTML = '';

          //var werte = itemvalue.split('|');
          var step = parseInt(slider.getAttribute('data-step'));
          var min = parseInt(slider.getAttribute('data-min'));
          var max = parseInt(slider.getAttribute('data-max'));
          var a = parseInt(itemvalue);
          var b = parseInt(itemvalue2);
          slider.noUiSlider.set([a, b]);
          document.getElementById('a' + slider.id).innerHTML =
            a + 'm - ' + b + 'm';
          /*
          slider.noUiSlider.destroy();
          noUiSlider.create(slider, {
            start: [werte[0], werte[1]],
            connect: true,
            step: step,
            range: {
              min: min,
              max: max,
            },
          });
          */
        }
        Array.from(fields).forEach((item) => {
          console.log(item);
          //console.log('FIELDS');
          if (item.getAttribute('name') == itemname) {
            //console.log(item);

            switch (item.tagName) {
              case 'DIV': {
                console.log('HIER');
                break;
              }
              case 'SELECT': {
                var id = item.id;
                //(document.getElementById(id) as HTMLSelectElement).value=this.answers[input.id][0];
                var ele = document.getElementById(id) as HTMLSelectElement;
                var options = ele.options;
                for (let j = 0; j < options.length; j++) {
                  //console.log('OPTIONS');
                  //console.log(options);
                  if (
                    options[j].innerHTML ==
                    this.answers[input.id][i].split('=')[1]
                  ) {
                    //console.log(options[j].innerHTML);
                    ele.selectedIndex = j;
                  }
                }

                //(document.getElementById(id) as HTMLSelectElement).selectedIndex = 1;
                break;
              }
              case 'INPUT': {
                var type = item.getAttribute('type');
                switch (type) {
                  case 'radio': {
                    var radios = document.getElementsByName(itemname);
                    Array.from(radios).forEach((item2) => {
                      console.log('RADIOS');
                      if (
                        (item2 as HTMLInputElement).value ==
                        this.answers[input.id][i].split('=')[1]
                      ) {
                        (
                          document.getElementById(item2.id) as HTMLInputElement
                        ).checked = true;
                      }
                    });
                    break;
                  }
                  case 'range': {
                    var type2 = 'single';
                    if (item.classList.contains('doublerange')) {
                      type2 = 'double';
                    }
                    if (type2 == 'single') {
                      //console.log('Single Type Range is here');
                      //console.log(item.id);
                      var neww = this.answers[input.id][i].split('=')[1];
                      var ele3 = document.getElementById(
                        item.id
                      ) as HTMLInputElement;
                      //console.log(ele3);
                      //console.log('-------------------');
                      ele3.value = neww;
                      //console.log('Wert >>' + neww + '<<');
                      var newid = 'output' + item.id.split('range')[1];
                      document.getElementById(newid)!.innerHTML = neww + 'm';
                    } else {
                      var values = this.answers[input.id][i]
                        .split('=')[1]
                        .split(',');
                      var ranges = document.getElementsByName(itemname);
                      for (let xy = 0; xy < values.length; xy++) {
                        var ele2 = document.getElementById(
                          ranges[xy].id
                        ) as HTMLInputElement;
                        ele2.value = values[xy];
                      }
                      var newwwid = item.id.split('x17')[0];
                      newwwid = 'output' + newwwid.split('drange')[1];
                      //console.log(newwwid);
                      if (parseInt(values[0]) < parseInt(values[1])) {
                        document.getElementById(newwwid)!.innerHTML =
                          values[0] + ' - ' + values[1];
                      } else {
                        document.getElementById(newwwid)!.innerHTML =
                          values[1] + ' - ' + values[0];
                      }
                    }
                    break;
                  }
                }
                break;
              }
            }
          }
          index++;
        });
      }
    }
  }

  left() {
    var left = document.getElementById('left_arrow');
    var right = document.getElementById('right_arrow');

    var calender = JSON.parse(sessionStorage.getItem('calender'));
    var length = calender['entries'].length;
    right.style.display = 'inline-block';

    var leftest = parseInt(left.getAttribute('data-src'));
    var rightest = parseInt(right.getAttribute('data-src'));

    leftest--;
    rightest--;

    left.setAttribute('data-src', leftest.toString());
    right.setAttribute('data-src', rightest.toString());

    if (leftest == 0) {
      left.style.display = 'none';
    }

    for (let i = 0; i < length; i++) {
      var id = calender['entries'][i]['id'];
      if (i >= leftest && i <= rightest) {
        document.getElementById(id).style.display = 'inline-block';
      } else {
        document.getElementById(id).style.display = 'none';
      }
    }
  }

  right() {
    var left = document.getElementById('left_arrow');
    var right = document.getElementById('right_arrow');

    var calender = JSON.parse(sessionStorage.getItem('calender'));
    var length = calender['entries'].length;
    left.style.display = 'inline-block';

    var leftest = parseInt(left.getAttribute('data-src'));
    var rightest = parseInt(right.getAttribute('data-src'));

    leftest++;
    rightest++;

    left.setAttribute('data-src', leftest.toString());
    right.setAttribute('data-src', rightest.toString());

    if (rightest == length - 1) {
      console.log('1');
      right.style.display = 'none';
    }

    for (let i = 0; i < length; i++) {
      var id = calender['entries'][i]['id'];
      if (i >= leftest && i <= rightest) {
        //console.log('sichtbar: ' + id);
        document.getElementById(id).style.display = 'inline-block';
      } else {
        //console.log('unsichtbar: ' + id);
        document.getElementById(id).style.display = 'none';
      }
    }
  }

  conditiontest(input: Array<any>): boolean {
    //console.log(this.answers);
    var result = false;
    if (input[0]) {
      console.log('Es liegen Bedingungen vor!');
      //console.log(input);
      //console.log(condition_count);
      var condition_count = input['count'];
      for (let i = 0; i < input.length; i++) {
        var layer_count = input[i].length;
        for (let j = 0; j < layer_count; j++) {
          //Layerebene
          var answer_count = input[i][j].length;
          for (let k = 0; k < answer_count; k++) {
            //iteriere antworten durch
            for (let l = 0; l < this.answers[j].length; l++) {
              //console.log(input[i][j][k] + ' -> ' + this.answers[j][l]);
              if (input[i][j][k] == this.answers[j][l]) {
                console.log('Bedingung erfüllt!');
                result = true;
              }
            }
          }
        }
      }
    } else {
      result = true;
    }
    if (!result) {
      console.log('Bedinung wurde nicht erfüllt!');
    }
    return result;
  }

  reconf(id1: string, id2: string, id3: string) {
    this.apiService.reconf(id1, id2, id3);
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
    var border = document.getElementById('id_wo_lieferung2');
    border.innerHTML = '';
    console.log('construction');
    //console.log(data);
    if (data) {
      var count = data['count'];
      for (let i = 0; i < count; i++) {
        var ele = this.apiService.constructHTML('Standorte2', [
          this.router,
          data[i],
        ]);
        var hash = ele.getAttribute('data-hash');
        //console.log('Hash: ' + hash);
        border.appendChild(ele);
        if (i == 0 && !sessionStorage.getItem('STANDORT')) {
          (document.getElementById(hash) as HTMLInputElement).checked = true;
          var megastandort = Array<any>();
          megastandort.push(data[i]); //standort daten
          megastandort.push(this.additional_standort[0]); //standort abholung lieferung
          megastandort.push(this.additional_standort[1]); //standort bedienung
          sessionStorage.setItem('STANDORT', JSON.stringify(megastandort));
          this.standort = megastandort;
        }
      }
    }
    var a = document.createElement('a');
    a.classList.add('btn');
    a.classList.add('btn-outline');
    var env = this;
    a.addEventListener('click', function (event) {
      env.newStandort();
    });
    a.innerHTML = 'Neuen Standort anlegen';
    border.appendChild(a);
  }

  onload_miethistorie() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log('Index: ' + index);
    console.log('Index2: ' + sessionStorage.getItem('Stateindex'));
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    scroll(0, 0);
    //ON LOAD CHECK
    this.apiService.externalLogoutCheck2();
    if (sessionStorage.getItem('Usertoken')) {
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

  timeAdjust_start(slug: string) {
    var token = sessionStorage.getItem('Usertoken');
    var email = sessionStorage.getItem('Email');

    var miethistorie = JSON.parse(
      sessionStorage.getItem('aktuelle_miethistorie')
    );
    var rel;
    for (let i = 0; i < miethistorie.length; i++) {
      if (miethistorie[i]['slug'] == slug) {
        rel = miethistorie[i];
      }
    }
    console.log(rel);
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

export class Hauptkategorie {
  title: string;
  link: string;
  slug: string;
  unterkategorien: Array<Subkategorie>;

  constructor(title: string, link: string, slug: string) {
    this.title = title;
    this.link = link;
    this.slug = slug.toLocaleLowerCase();
    this.unterkategorien = Array<Subkategorie>();
  }

  add(neu: Subkategorie) {
    this.unterkategorien.push(neu);
  }

  get(): Array<Subkategorie> {
    return this.unterkategorien;
  }
}

export class Subkategorie {
  title: string;
  link: string;
  slug: string;
  constructor(title: string, link: string, slug: string) {
    this.title = title;
    this.link = link;
    this.slug = slug.toLocaleLowerCase();
  }
}

export class Props {
  name: string;
  value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}

export class WizardStage {
  fragen: Array<Fragen>;
  erklaerung: string;
  erklaerung_title: string;
  erklaerung_link: string;
  id: number;
  constructor(
    fragen: Array<Fragen>,
    erklaerung: string,
    erklaerung_title: string,
    erklaerung_link: string,
    id: number
  ) {
    this.fragen = fragen;
    this.id = id;
    this.erklaerung = erklaerung;
    this.erklaerung_title = erklaerung_title;
    this.erklaerung_link = erklaerung_link;
  }
}

export class Fragen {
  frage: string;
  input: Array<Input>;
  conditions: Array<any>;

  constructor(frage: string, input: Array<Input>, conditions: Array<any>) {
    this.frage = frage;

    this.input = input;
    this.conditions = conditions;
  }
}

export class Input {
  type: number;
  name: string;
  /*
  0 select
  1 yes no
  2 check
  3 text
  4 area
  5 range 2 Punkte
  6 range 1 Punkt
  
  */
  options: Array<string>;
  required: boolean;
  disallowed: Array<string>;

  constructor(
    type: number,
    options: Array<string>,
    required: boolean,
    disallowed: Array<string>,
    name: string
  ) {
    this.type = type;
    this.options = options;
    this.required = required;
    this.disallowed = disallowed;
    this.name = name;
  }
}

export class Miethistorie {
  aktuell: Array<Mieten>;
  vergangen: Array<Mieten>;

  constructor(aktuell: Array<Mieten>, vergangen: Array<Mieten>) {
    this.aktuell = aktuell;
    this.vergangen = vergangen;
  }
}

export class Mieten {
  enddatum: string;
  geraeteid: number;
  id: number;
  lieferadresse: string;
  produktid: number;
  produktname: string;
  standortgerken: number;
  startdatum: string;
  abholung: boolean;
  bedienung: boolean;
  standort: Standort;
  rechnungsids: Array<Rechnungen>;
  bild: string;
  slug: string;

  constructor(
    enddatum: string,
    geraeteid: number,
    id: number,
    lieferadresse: string,
    produktid: number,
    produktname: string,
    standortgerken: number,
    startdatum: string,
    rechnungsids: Array<Rechnungen>,
    bild: string,
    slug: string,
    abholung: boolean,
    bedienung: boolean,
    standort: Standort
  ) {
    this.enddatum = enddatum;
    this.geraeteid = geraeteid;
    this.id = id;
    this.lieferadresse = lieferadresse;
    this.produktid = produktid;
    this.produktname = produktname;
    this.standortgerken = standortgerken;
    this.startdatum = startdatum;
    this.rechnungsids = rechnungsids;
    this.bild = bild;
    this.slug = slug;
    this.abholung = abholung;
    this.bedienung = bedienung;
    this.standort = standort;
  }
}

export class Standort {
  name: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  stadt: string;
  land: string;

  constructor(
    name: string,
    strasse: string,
    hausnummer: string,
    plz: string,
    stadt: string,
    land: string
  ) {
    this.name = name;
    this.strasse = strasse;
    this.hausnummer = hausnummer;
    this.plz = plz;
    this.stadt = stadt;
    this.land = land;
  }
}

export class Rechnungen {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

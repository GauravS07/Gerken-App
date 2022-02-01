import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Felder, felder } from '../../fields';
import { ActivatedRoute } from '@angular/router';
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
} from '../mietprozess/mietprozess.component';
declare var $: any;

@Component({
  selector: 'app-produktdetailseite',
  templateUrl: './produktdetailseite.component.html',
  styleUrls: ['./produktdetailseite.component.css'],
})
export class ProduktdetailseiteComponent implements OnInit {
  produktid: string = 'toastbrot';
  Produkt: any;
  allowed = false;
  state = 'no';
  entry;
  dest = '/mietprozess/standorte/';
  last = 0;
  vorteile;
  felder = felder;
  feld: Felder;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
    this.apiService.externalLogoutCheck();
    if (sessionStorage.getItem('SetupStateAllowance') == 'true') {
      this.apiService.setupDOM(this.router);
    } else {
      this.apiService.startupChain2(1);
    }
    this.route.params.subscribe((params) => {
      //console.log(params);
      this.produktid = params['produktid'];
      if (!localStorage.getItem('Produkt' + this.produktid)) {
        var input = this.apiService.generateInput([['slug', this.produktid]]);
        console.log(input);
        this.apiService
          .postEndpunkt(input, 'produktbyslug')
          .subscribe((data) => {
            console.log(data);
            this.Produkt = data['produkt'];

            localStorage.setItem(
              'Produkt' + this.produktid,
              JSON.stringify(data['produkt'])
            );
          });
      }
      var Miethistorie = this.apiService.reconstructMiethistorie();
      //console.log(Miethistorie['aktuell'].length);
      for (let i = 0; i < Miethistorie['aktuell'].length; i++) {
        //console.log(Miethistorie['aktuell'][i].slug + ' : ' + this.produktid);
        if (Miethistorie['aktuell'][i].slug == this.produktid) {
          this.allowed = true;
          this.state = 'aktuell';
          this.entry = Miethistorie['aktuell'][i];
          const objectArray = Object.entries(this.entry.rechnungsids);
          objectArray.forEach(([key, value]) => {
            this.last = (value as Rechnungen).id as number;
          });
        }
      }
      for (let i = 0; i < Miethistorie['vergangen'].length; i++) {
        //console.log(Miethistorie['vergangen'][i].slug + ' : ' + this.produktid);
        if (Miethistorie['vergangen'][i].slug == this.produktid) {
          this.allowed = true;
          if (this.state != 'aktuell') {
            this.state = 'vergangen';
            this.entry = Miethistorie['vergangen'][i];
          }
        }
      }
    });
    if (
      sessionStorage.getItem('STANDORT') &&
      sessionStorage.getItem('STANDORT') != 'undefined'
    ) {
      console.log('STANDORT GEFUNDEN');
      this.dest = '/mietprozess/zeit/';
    }
    if (sessionStorage.getItem('ZEIT')) {
      console.log('ZEIT GEFUNDEN');
      this.dest = '/mietprozess/auswahl/';
    }
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
    console.log('scream');
    console.log(this.produktid);
    var input = this.apiService.generateInput([['slug', this.produktid]]);
    this.apiService.postEndpunkt(input, 'bewertung1').subscribe((data) => {
      console.log(data);
      var rel = data['success'];
      this.loadBewertung(rel);
    });
    if (this.allowed) {
      document.getElementById('btn_bewert').style.display = '';
    }
    this.loadProdukt();
    this.apiService.loadMenue(this.router);
    console.log(this.entry);
  }

  loadBewertung(input: any) {
    var frame = document.getElementById('bewertung');
    frame.innerHTML = '';
    var sum = 0;
    if (input.length == 0) {
      document.getElementById('bewertungen').style.display = 'none';
    } else {
      document.getElementById('bewertungen').style.display = 'block';
    }
    for (let i = 0; i < input.length; i++) {
      var ele = this.apiService.constructHTML('bewertung', input[i]);
      frame.appendChild(ele);
      var durchschnitt: number =
        (parseInt(input[i]['service']) +
          parseInt(input[i]['funktionalitat']) +
          parseInt(input[i]['sauberkeit']) +
          parseInt(input[i]['punktlichkeit']) +
          parseInt(input[i]['bestellprozess'])) /
        5;
      sum += durchschnitt;
    }
    sum = sum / input.length;
    if (!sum) {
      sum = 5;
    }
    var outlet = document.getElementById('average');
    outlet.classList.forEach(([key, value]) => {
      outlet.classList.remove(value);
    });
    outlet.classList.add('stars');
    outlet.classList.add('stars-' + sum.toFixed(0));
    outlet.innerHTML = sum.toFixed(2) + '/5';
  }

  loadProdukt() {
    console.log('loadProdukt');
    if (localStorage.getItem('Produkt' + this.produktid)) {
      console.log(localStorage.getItem('Produkt' + this.produktid));
      this.Produkt = JSON.parse(
        localStorage.getItem('Produkt' + this.produktid)
      );
      this.constructProdukt();
    } else {
      var input = this.apiService.generateInput([['slug', this.produktid]]);
      console.log(input);
      this.apiService.postEndpunkt(input, 'produktbyslug').subscribe((data) => {
        console.log(data);
        this.Produkt = data['produkt'];

        localStorage.setItem(
          'Produkt' + this.produktid,
          JSON.stringify(data['produkt'])
        );

        this.constructProdukt();
      });
    }
  }

  reloadSlider(images: Array<string>) {
    var slider = document.getElementById('id_main_slider');
    var slider_nav = document.getElementById('slider-nav');
    slider_nav.innerHTML = '';
    slider.innerHTML = '';
    for (let i = 0; i < images.length; i++) {
      /*
      <div>
          <img src="https://picsum.photos/1700" data-index="8" />
        </div>
      */
      var div = document.createElement('div');
      div.innerHTML = '<img src="' + images[i] + '" data-index="' + i + '" />';
      slider.appendChild(div);

      /*
      <div>
            <a href="javascript:void(0);" data-slide="1"
              ><img src="https://picsum.photos/1000"
            /></a>
          </div>
      */
      var div2 = document.createElement('div');
      div2.innerHTML =
        '<a href="javascript:void(0);" data-slide="' +
        i +
        '"><img src="' +
        images[i] +
        '"/></a>';
      slider_nav.appendChild(div2);
    }
    this.ersatzini();
  }

  constructProdukt() {
    console.log('constructProdukt');
    //console.log(this.Produkt);
    var vorteile = this.Produkt['besonderheit'];
    var out = '';
    if (vorteile.includes('Vorteil:')) {
      out += '<p>' + vorteile.split('Vorteil:')[1] + '</p>';
      console.log(this.vorteile);
    }
    if (vorteile.includes('Besonderheiten:')) {
      out += '<p>' + vorteile.split('Besonderheiten:')[1] + '</p>';
      console.log(this.vorteile);
    }
    if (out) {
      out = out.replace('=', ':');
      document.getElementById('vorteil').innerHTML = out;
      document.getElementById('vorteile').style.display = 'block';
    } else {
      document.getElementById('vorteile').style.display = 'none';
    }
    var title1 = document.getElementById('title');
    var title2 = document.getElementById('title2');
    var description = document.getElementById('description');
    var slider1 = document.getElementById('id_main_slider');
    var slider2 = document.getElementById('slider-nav');

    var images = Array<string>();
    images = this.Produkt['bild'].split('|');
    title1.innerHTML = this.Produkt['produkt'];
    title2.innerHTML = this.Produkt['produkt'];
    if (!this.Produkt['beschreibung']) {
      this.Produkt['beschreibung'] = '';
    }
    if (!this.Produkt['anleitungen']) {
      document.getElementById('anleitungen').style.display = 'none';
    }
    if (this.Produkt['produktvideo1'] && this.Produkt['produktvideo1'] != '') {
      document.getElementById('videos').style.display = 'block';
      var videos = this.Produkt['produktvideo1'].split('|');
      console.log(videos);
      var frame = document.getElementById('produktvideo');
      frame.innerHTML = '';
      for (let i = 0; i < videos.length; i++) {
        var div = document.createElement('div');
        div.classList.add('video-wrapper');
        var newlink =
          'https://www.youtube.com/embed/' + videos[i].split('/watch?v=')[1];
        console.log(newlink);
        div.innerHTML =
          '<iframe width="560" height="315" src="' +
          newlink +
          '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

        /*
          div.innerHTML='<iframe width="560" height="315" src="' +
        videos[i] +
        '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        */
        frame.appendChild(div);
      }
    } else {
      document.getElementById('videos').style.display = 'none';
    }
    description.innerHTML = this.Produkt['beschreibung'];

    var daten = document.getElementById('daten');
    daten.innerHTML = '';
    //console.log(this.Produkt);
    //console.log(images);
    //
    const objectArray = Object.entries(this.Produkt);

    var exclude = Array<string>();
    //Arbeitsbühnen
    exclude.push('produkt');
    exclude.push('uid');
    exclude.push('pid');
    exclude.push('preis');
    exclude.push('geraeteart');
    exclude.push('beschreibung');
    exclude.push('slug');
    exclude.push('bild');
    exclude.push('besonderheit');
    exclude.push('einsatzdaten');
    exclude.push('hauptkategorie');
    exclude.push('produktvideo1');

    var replace = Array<any>();
    replace.push(['weight', 'Gewicht', 1]);
    replace.push(['antriebsart', 'Antriebsart']);
    replace.push(['maxarbeitshoehem', 'Maximale Arbeitshöhe (m)', 1]);
    replace.push(['plattformhoehem', 'Plattform Höhe (m)', 1]);
    replace.push([
      'laengetransportstellungm',
      'Länge Transportstellung (m)',
      1,
    ]);
    replace.push(['hoehetransportstellungm', 'Höhe Transportstellung (m)', 1]);
    replace.push(['spurverbreiterung', 'Spurverbreiterung']);
    replace.push(['verfahrbarbis', 'verfahrbar bis']);
    replace.push(['bodenfreiheit', 'Bodenfreiheit', 1]);
    replace.push(['weiszereifen', 'weiße Reifen']);
    replace.push(['allrad', 'Allrad']);
    replace.push(['stuetzen', 'Stützen']);
    replace.push(['drehbarerkorb', 'drehbarer Korb', 1]);
    replace.push(['schwenkbereich', 'Schwenkbereich', 1]);
    replace.push(['Überhang', 'Überhang', 1]);
    replace.push(['steigungswinkel', 'Steigungswinkel', 1]);
    replace.push(['korbarm', 'Korbarm', 1]);
    replace.push(['pendelachse', 'Pendelachse']);
    replace.push(['fuehrerschein', 'Führerschein']);
    replace.push([
      'maxseitlichereichweitem',
      'maximale seitliche Reichweite (m)',
    ]);
    replace.push(['maxkorblastkg', 'maximale Korblast (kg)', 1]);
    replace.push(['baubreitem', 'Baubreite (m)']);
    replace.push([
      'plattformabmessungbreitem',
      'Plattform Abmessung, Breite (m)',
      0,
    ]);
    replace.push([
      'plattformabmessungtiefem',
      'Plattform Abmessung, Tiefe (m)',
      0,
    ]);
    replace.push(['eingebautergenerator230v', 'eingebauter Generator (230V)']);
    replace.push(['maxreichweite', 'maximale Reichweite']);
    replace.push(['raddruckstuetzdruckmax', 'Raddruckstützdruckmax']);
    replace.push(['differentialsperre', 'Differentialsperre']);
    replace.push([
      'industrieoderstraszengeraet',
      'Industrie- oder Straßengerät',
    ]);
    var index = 0;
    var list = this.Produkt;
    for (let i = 0; i < this.felder.length; i++) {
      if (this.felder[i].hauptkategorie == this.Produkt['hauptkategorie']) {
        this.feld = this.felder[i];
      }
    }
    console.log(this.feld);
    for (let i = 0; i < this.feld.labels.length; i++) {
      daten.innerHTML +=
        '<strong>' +
        this.feld.labels[i] +
        '</strong><br/><p>' +
        this.Produkt[this.feld.data[i]] +
        '</p>';
    }
    var datenblatt = document.createElement('a');
    datenblatt.innerHTML = 'Datenblatt herunterladen';
    datenblatt.classList.add('datenblatt');
    datenblatt.href =
      'https://diesdas.codersunlimited.de/diesdas/assets/MHH_19_R_Holzhcksler.pdf';
    datenblatt.target = '_blank';
    daten.appendChild(datenblatt);
    this.apiService.loadMenue(this.router);
    this.reloadSlider(images);
  }

  ngOnInit() { }

  ersatzini() {
    if (!sessionStorage.getItem('detail' + this.produktid)) {
      console.log('First Time');
      sessionStorage.setItem('detail' + this.produktid, 'ja');
    } else {
      console.log('Second Time');
      var link = this.overdrive3();
      sessionStorage.removeItem('detail' + this.produktid);
      //this.router.navigate([link], {});
      console.log(link);
      //window.location.href = link;
    }
    $(function () {
      $(window)
        .scroll(function () {
          var windscroll = $(window).scrollTop();
          if (windscroll >= 20) {
            $('body').addClass('reduced');
          } else {
            $('body').removeClass('reduced');
          }
          //
          if ($(this).scrollTop() > 100) {
            $('#btn_top').stop().fadeIn();
          } else {
            $('#btn_top').stop().fadeOut();
          }
        })
        .scroll();

      $('input[type="radio"]').click(function () {
        var inputValue = $(this).attr('value');
        if (inputValue == 'Privatkunde') {
          $('#id_registration_business').hide();
          $('#id_registration_private').show();
        } else if (inputValue == 'Geschäftskunde') {
          $('#id_registration_business').show();
          $('#id_registration_private').hide();
        }
        if (inputValue == 'Abholung') {
          $('#id_wo_lieferung').hide();
          $('#id_wo_abholung').show();
        } else if (inputValue == 'Lieferung') {
          $('#id_wo_lieferung').show();
          $('#id_wo_abholung').hide();
        }
      });

      $('#id_process_btn').click(function () {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
        } else {
          $(this).addClass('active');
        }
        $('#id_process_form').slideToggle();
      });
      console.log(document.getElementById('slider-nav'));
      $(window).resize(function () {
        if ($(window).width() < 768) {
          $('.slider-nav').appendTo('.slider');
        } else {
          $('.slider-nav').prependTo('#id_slider_nav_position');
        }
      });

      $('.slider-nav a').click(function () {
        console.log('2');
        $('#id_main_slider').slick(
          'slickGoTo',
          $(this).attr('data-slide'),
          false
        );
      });
    });
    if ($('.slider').length > 0) {
      console.log('1', $('.slider').length);
      $('.slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        infinite: true,
      });
      console.log('3');

      $(document).ready(function(){
        $('.slider-nav').slick({
         infinite: true,
         slidesToShow: 4,
         slidesToScroll: 3,
        });
       });
       
      if ($(window).width() < 768) {
        $('.slider-nav').appendTo('.slider');
      }
    }
    $('#stars li')
      .on('mouseover', function () {
        var onStar = parseInt($(this).data('value'), 10);

        $(this)
          .parent()
          .children('li.star')
          .each(function (e) {
            if (e < onStar) {
              $(this).addClass('hover');
            } else {
              $(this).removeClass('hover');
            }
          });
      })
      .on('mouseout', function () {
        $(this)
          .parent()
          .children('li.star')
          .each(function (e) {
            $(this).removeClass('hover');
          });
      });

    $('#stars li').on('click', function () {
      var onStar = parseInt($(this).data('value'), 10);
      var stars = $(this).parent().children('li.star');

      for (let i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('selected');
      }

      for (let i = 0; i < onStar; i++) {
        $(stars[i]).addClass('selected');
      }
    });
  }

  bewerten() {
    var service_b = document.getElementsByClassName('Service');
    var funktionalitat_b = document.getElementsByClassName('Funktionalitat');
    var sauberkeit_b = document.getElementsByClassName('Sauberkeit');
    var punktlichkeit_b = document.getElementsByClassName('Punktlichkeit');
    var bestellprozess_b = document.getElementsByClassName('Bestellprozess');

    var service = 0;
    var funktionalitat = 0;
    var sauberkeit = 0;
    var punktlichkeit = 0;
    var bestellprozess = 0;
    for (let i = 0; i < service_b.length; i++) {
      var serv = service_b[i];
      if (serv.classList.contains('selected')) {
        var tmp = parseInt(serv.getAttribute('data-value'));
        if (tmp > service) {
          service = tmp;
        }
      }

      var serv = funktionalitat_b[i];
      if (serv.classList.contains('selected')) {
        var tmp = parseInt(serv.getAttribute('data-value'));
        if (tmp > funktionalitat) {
          funktionalitat = tmp;
        }
      }

      var serv = sauberkeit_b[i];
      if (serv.classList.contains('selected')) {
        var tmp = parseInt(serv.getAttribute('data-value'));
        if (tmp > sauberkeit) {
          sauberkeit = tmp;
        }
      }

      var serv = punktlichkeit_b[i];
      if (serv.classList.contains('selected')) {
        var tmp = parseInt(serv.getAttribute('data-value'));
        if (tmp > punktlichkeit) {
          punktlichkeit = tmp;
        }
      }

      var serv = bestellprozess_b[i];
      if (serv.classList.contains('selected')) {
        var tmp = parseInt(serv.getAttribute('data-value'));
        if (tmp > bestellprozess) {
          bestellprozess = tmp;
        }
      }
    }
    console.log('Für Serivce: ' + service);
    console.log('Für Funktionalität: ' + funktionalitat);
    console.log('Für Sauberkeit: ' + sauberkeit);
    console.log('Für Pünktlichkeit: ' + punktlichkeit);
    console.log('Für Bestellprozess: ' + bestellprozess);

    var comment = (document.getElementById('comment') as HTMLInputElement)
      .value;
    console.log('Kommentar: ' + comment);
    var from = 'Anonym';
    if (sessionStorage.getItem('Email')) {
      from = sessionStorage.getItem('Email');
    }

    console.log('Gesendet von: ' + from);
    $.fancybox.close();
    var heute = new Date();
    var month = heute.getMonth() + 1;
    var datestring = heute.getDate().toString();
    if (datestring.length == 1) {
      datestring = '0' + datestring;
    }
    var heute2 = heute.getFullYear() + '-' + month + '-' + datestring;
    var input = this.apiService.generateInput([
      ['service', service],
      ['funktionalitat', funktionalitat],
      ['sauberkeit', sauberkeit],
      ['punktlichkeit', punktlichkeit],
      ['bestellprozess', bestellprozess],
      ['produkt', this.produktid],
      ['comment', comment],
      ['user', from],
      ['date', heute2],
    ]);
    if (this.allowed) {
      this.apiService.postEndpunkt(input, 'bewertung2').subscribe((data) => {
        console.log(data);
        var rel = data['success'];
        this.loadBewertung(rel);
      });
    }
  }
}

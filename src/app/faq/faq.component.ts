import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FAQComponent implements OnInit {
  produktslug: string;
  Produkt: any;

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
      if (params['product']) {
        this.produktslug = params['product'];
      }
    });
  }

  ngOnInit() { }

  onload() {
    var index = parseInt(sessionStorage.getItem('Stateindex'));
    console.log("Index: " + index);
    if (index != 0 && index) {
      document.getElementById('id_c2a').style.display = 'block';
    } else {
      document.getElementById('id_c2a').style.display = 'none';
    }
    scroll(0, 0);
    this.apiService.loadMenue(this.router);
    if (this.produktslug) {
      //console.log('Lade Produkt');
      if (localStorage.getItem('Produkt' + this.produktslug)) {
        //console.log(localStorage.getItem('Produkt' + this.produktslug));
        this.Produkt = JSON.parse(
          localStorage.getItem('Produkt' + this.produktslug)
        );
        this.constructProdukt();
      } else {
        var input = this.apiService.generateInput([['slug', this.produktslug]]);
        //console.log(input);
        this.apiService
          .postEndpunkt(input, 'produktbyslug')
          .subscribe((data) => {
            //console.log(data);
            this.Produkt = data['produkt'];

            localStorage.setItem(
              'Produkt' + this.produktslug,
              JSON.stringify(data['produkt'])
            );

            this.constructProdukt();
          });
      }
    } else {
      console.log('Lade Übersicht');
      var Miethistorie = this.apiService.reconstructMiethistorie();
      var aktuell = Miethistorie.aktuell;
      console.log(aktuell);
      var frame = document.getElementById('outlet');
      frame.innerHTML = '';
      for (let i = 0; i < aktuell.length; i++) {
        var ele = this.apiService.constructHTML('faq', aktuell[i]);
        //console.log(ele);
        frame.appendChild(ele);
        var hash = ele.getAttribute('data-hash');
        var detail_button = document.getElementById(hash);
        var env = this;
        detail_button.addEventListener('click', function (event) {
          var slug = this.getAttribute('data-slug');
          env.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              env.router.navigate(['faq/' + slug]);
            });
        });
      }
    }
  }

  constructProdukt() {
    console.log(this.Produkt);
    var p = this.Produkt;
    document.getElementById('title').innerHTML = p['produkt'];
    var images = Array<string>();
    images = p['bild'].split('|');
    this.reloadSlider(images);
  }

  reloadSlider(images: Array<string>) {
    var slider = document.getElementById('id_main_slider');
    slider.innerHTML = '';
    for (let i = 0; i < images.length; i++) {
      var div = document.createElement('div');
      div.innerHTML = '<img src="' + images[i] + '" data-index="' + i + '" />';
      slider.appendChild(div);
    }
    this.ersatzini();
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

  ersatzini() {
    if (!sessionStorage.getItem('detail' + this.produktslug)) {
      console.log('First Time');
      sessionStorage.setItem('detail' + this.produktslug, 'ja');
    } else {
      console.log('Second Time');
      var link = this.overdrive3();
      sessionStorage.removeItem('detail' + this.produktslug);
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

      $(window).resize(function () {
        if ($(window).width() < 768) {
          $('.slider-nav').appendTo('.slider');
        } else {
          $('.slider-nav').prependTo('#id_slider_nav_position');
        }
      });

      $('.slider-nav a').click(function () {
        $('#id_main_slider').slick(
          'slickGoTo',
          $(this).attr('data-slide'),
          false
        );
      });
    });
    if ($('.slider').length > 0) {
      $('.slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        //asNavFor: '.slider-nav'
      });
      $('.slider-nav').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        //asNavFor: '.slider',
        dots: false,
        //centerMode: true,
        //focusOnSelect: true
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
    this.apiService.loadMenue(this.router);
  }
}

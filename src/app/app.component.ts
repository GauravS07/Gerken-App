import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Felder, felder } from '../fields';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }
  ngOnInit() {
    this.loadSlickJS();
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
  }

  loadSlickJS() {
    const slickSrc = 'https://diesdas.codersunlimited.de/diesdas/assets/slick/slick.js';
    let isLoaded = false;
    let scripts: any = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].getAttribute('src') == slickSrc) isLoaded = true;
    }
    if (isLoaded) return;
    let slickNode = document.createElement('script');
    slickNode.src = slickSrc;
    slickNode.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(slickNode);
  }

  load() {
    this.apiService.loadMenue(this.router);
  }

  onActivate(event: any) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
    if (document.getElementById('id_menu_btn').classList.contains('open')) {
      document.getElementById('id_menu_btn').classList.remove('open');
    }
    if (document.getElementById('id_menu_wrapper').style.display == 'block') {
      document.getElementById('id_menu_wrapper').style.display = 'none';
    }
  }
}

/* 
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/

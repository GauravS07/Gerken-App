import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UmfrageListComponent } from './umfrage-list/umfrage-list.component';
import { DemoComponent } from './demo/demo.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { Startseite2Component } from './startseite2/startseite2.component';
import { AccountComponent } from './account/account.component';
import { FooterComponent } from './footer/footer.component';
import { RegistrierungComponent } from './registrierung/registrierung.component';
import { MietprozessComponent } from './mietprozess/mietprozess.component';
import { ProduktdetailseiteComponent } from './produktdetailseite/produktdetailseite.component';
import { AdministrationComponent } from './administration/administration.component';
import { RechnungshistorieComponent } from './rechnungshistorie/rechnungshistorie.component';
import { StandorteComponent } from './standorte/standorte.component';
import { ProcessComponent } from './process/process.component';
import { NutzerverwaltungComponent } from './nutzerverwaltung/nutzerverwaltung.component';
import { FAQComponent } from './faq/faq.component';
import { AppInitService } from './app-init.service';

// APP INITIALIZATION
export function StartupServiceFactory(appInitService: AppInitService) {
  return () => appInitService.Init();
}
const APPINIT_PROVIDES = [AppInitService, {
  provide: APP_INITIALIZER,
  useFactory: StartupServiceFactory,
  deps: [AppInitService],
  multi: true,
}];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: StartseiteComponent },
      /*
      { path: '', component: DemoComponent },
      { path: 'startseite', component: StartseiteComponent },
      { path: 'eingeloggt', component: Startseite2Component },
      */
      { path: 'produktdetailseite', component: ProduktdetailseiteComponent },
      { path: 'mietprozess', component: MietprozessComponent },
      { path: 'nutzerverwaltung', component: NutzerverwaltungComponent },
      { path: 'administration', component: AdministrationComponent },
      { path: 'umfragen', component: UmfrageListComponent },
      { path: 'account', component: AccountComponent },
      { path: 'rechnungshistorie', component: RechnungshistorieComponent },
      { path: 'standorte', component: StandorteComponent },
      { path: 'faq', component: FAQComponent },
      { path: 'faq/:product', component: FAQComponent },
      { path: 'registrierung', component: RegistrierungComponent },
      { path: 'registrierung/:result', component: RegistrierungComponent },
      { path: 'schnittstelle/:mode', component: DemoComponent },
      { path: 'mietprozess/:mode', component: MietprozessComponent },
      {
        path: 'produktdetailseite/:produktid',
        component: ProduktdetailseiteComponent,
      },
      { path: 'mietprozess/:mode/:category', component: MietprozessComponent },
      {
        path: 'mietprozess/:mode/:category/:subcategory',
        component: MietprozessComponent,
      },
    ]),
  ],
  exports: [RouterModule],
  declarations: [
    AppComponent,
    TopBarComponent,
    UmfrageListComponent,
    StartseiteComponent,
    Startseite2Component,
    AccountComponent,
    FooterComponent,
    RegistrierungComponent,
    ProduktdetailseiteComponent,
    MietprozessComponent,
    AdministrationComponent,
    RechnungshistorieComponent,
    StandorteComponent,
    ProcessComponent,
    NutzerverwaltungComponent,
    FAQComponent,
  ],
  providers: [
    APPINIT_PROVIDES,
    AppInitService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/

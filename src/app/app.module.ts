import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { CalenderServices } from './sharedServices/dateServices';
import { MathCalc } from './sharedServices/math.services';
import { Deadline } from './deadlineBaseAlgorithm/getDeadline';
import { ExternalData } from './externalDataStore/dataStore';
import { DeadlinesFromDates } from './getDeadlinesFromDates/DeadlinesFromDates';
import { Texts } from './textServices/testServices';
import { TxtSharedService } from './TxtSharedService/txtSharedService';
import { DeadlineBoxComponent } from './components/deadline-box/deadline-box.component';
import { DeadlineObjectComponent } from './components/deadline-object/deadline-object.component';
import { DeadlineGodtForStartComponent } from './components/deadline-godt-for-start/deadline-godt-for-start.component';
import { LaeringsPakkeService } from './laeringsPakkerLogik/laeringsPakke';
import { UrlRessourceService } from './urlRessource/urlressource';
import { TransferToCalenderService } from './transferCalender/transferToCalender';
import { TransferToCalenderComponent } from './components/transfer-to-calender/transfer-to-calender.component';
import { RegularDeadlineBoxComponent } from './components/regular-deadline-box/regular-deadline-box.component';
import { SkatdkCalenderListComponent } from './components/skatdk-calender-list/skatdk-calender-list.component';
import { KalenderIndstillingerComponent } from './components/kalender-indstillinger/kalender-indstillinger.component';
import { AngularWebStorageModule } from 'angular-web-storage';
import { StateFristTyperService } from './stateTyperFrister/statetypeFrister';
import { InitViewComponent } from './components/init-view/init-view.component';
import { JaNejComponent } from './sharedServices/ja-nej/ja-nej.component';
import { DatovaelgerInputFeltComponent } from './sharedServices/datePicker/datovaelger-input-felt.component';
import { FirstLetterToCapitalPipe } from './pipes/firstCapitalLetter';


@NgModule({
  declarations: [
    AppComponent,
    DeadlineBoxComponent,
    DeadlineObjectComponent,
    DeadlineGodtForStartComponent,
    TransferToCalenderComponent,
    RegularDeadlineBoxComponent,
    SkatdkCalenderListComponent,
    KalenderIndstillingerComponent,
    InitViewComponent,
    JaNejComponent,
    DatovaelgerInputFeltComponent,
    FirstLetterToCapitalPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularWebStorageModule
   , InMemoryWebApiModule.forRoot( ExternalData )
  ],
  providers: [
    CalenderServices,
    MathCalc,
    Deadline,
    DeadlinesFromDates,
    Texts,
    TxtSharedService,
    LaeringsPakkeService,
    UrlRessourceService,
    TransferToCalenderService,
    StateFristTyperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

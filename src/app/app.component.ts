import { Component, OnInit } from '@angular/core';
import { Deadline } from './deadlineBaseAlgorithm/getDeadline';
import { DeadlinesFromDates } from './getDeadlinesFromDates/DeadlinesFromDates';
import { Observable } from 'rxjs/Observable';
import { DeadlineRequest, DeadlineUnit } from './getDeadlinesFromDates/deadlineUnit';
import { Period } from './deadlineBaseAlgorithm/interfaceFristDNA';
import { Texts } from './textServices/testServices';
import { TxtDap, TxtKey } from './textServices/textInterface';
import { GetText } from './textServices/getTxt';
import { urlMapper } from './dataMapping/urlMapping';
import { textMapper } from './dataMapping/textMapper';

import { periodsMap } from './dataMapping/periodsPrYearOfFrister';
import { rateTypes } from './dataMapping/fristerTypes';
import { TxtSharedService } from './TxtSharedService/txtSharedService';
import { PeriodEntity } from './periodClass/periodClass';
import { StateFristTyperService } from './stateTyperFrister/statetypeFrister';
import { setTimeout } from 'timers';

export interface MonthHolder {
  month: number;
  year: number;
  deadlines: DeadlineUnit[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor (
    public _deadline: Deadline,
    public _abstract: DeadlinesFromDates,
    public _txt: TxtSharedService,
    public _stateService: StateFristTyperService

  ) {}

  visGodtFraStart = true;
  showindstillinger = false;
  specialTimer = false;
  magicWord = '';

  initView() {
    return (this._stateService.userSettings.isUntouched);
  }


  ngOnInit() {
    this.setClickOutSideEvent();
    this.clearCachEventSet();
  }

  setClickOutSideEvent() {
    window.addEventListener('click', (event: Event) => {

      const
        target                    = <HTMLElement> event.target,
        clickInsideIndstillinger  = this.closests(target, 'indstillinger'),
        clickOnToggleButton       = this.closests(target, 'indstillinger-toggle');

      /* hvis man klikker uden for indstillinger og ikke på knappen der toggler indstillinger, så lukkes indstillinger */
      if (!clickOnToggleButton && !clickInsideIndstillinger) {
        this.showindstillinger = false;
      }

    });
  }

  clearCachEventSet() {
    window.addEventListener('keyup', (event: KeyboardEvent) => {

      /* 5 sec to write rens in order to clear cach */
      if (event.key === 'r' && !this.specialTimer) {

        this.specialTimer = true;

        setTimeout(() => {
          this.specialTimer = false;
          this.magicWord = '';
        }, 5000);

      }

      if (this.specialTimer) {
        this.magicWord += event.key;

        if (this.magicWord === 'rens') {
          this._stateService._localService.remove(this._stateService.nameLocalStorage);
          window.location.reload();
        }
      }

    });
  }

  closests (HTMLElement: HTMLElement, parentClass: string): any {

    if (HTMLElement === null) {
      return;
    }

    return (HTMLElement && HTMLElement.classList.contains && HTMLElement.classList.contains(parentClass))
        ? true
        : (HTMLElement && (HTMLElement.tagName === 'BODY' || HTMLElement.tagName === 'HTML'))
            ? false
            : this.closests(HTMLElement.parentElement, parentClass);

  }

}

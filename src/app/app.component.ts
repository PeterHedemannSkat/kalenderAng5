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
    public _txt: TxtSharedService

  ) {}

  visGodtFraStart = true;
  antalFrister_ = 3;

  get antalFrister() {
    return this.antalFrister_;
  }

  set antalFrister(val: any) {
    this.antalFrister_ = Number(val);
    this.deadLineMainObs = this.getDeadlinesObs();
    this.godtFraStartObs = this.monthDivisorStructure();
  }

  deadLineMainObs: Observable<DeadlineRequest>;
  godtFraStartObs: Observable<MonthHolder[]>;

  getAllTypes() {
    return this._abstract.getAllTypes();
  }

  ngOnInit() {
    this.deadLineMainObs = this.getDeadlinesObs();
    this.godtFraStartObs = this.monthDivisorStructure();


    this._abstract.getSpecificNumberOfDeadlinesFromDate_(5, this.getAllTypes(), new Date(), 'to')
      .subscribe(el => {
        console.log(el);
      });


  }

  normalTypes() {
    return ['moms_kvartal', 'bSkatteRater', 'selvangivelse'];
  }

  getDeadlinesObs(): Observable<DeadlineRequest> {

    const
      antalFrister = this.antalFrister_,
      single = ['selvangivelse'],
      types = this.normalTypes(),
      date = new Date(),
      direction = 'from';

    return (antalFrister > 0)
      ? this._abstract
        .getSpecificNumberOfDeadlinesFromDate(antalFrister, types, date, direction)
      : Observable.from([]);

  }

  /**
   * State:
   *    - seneste dato vist
   *    - frister vist fra seneste fristdato
   *    - ved ny fristdato => tjek om seneste frist dato er samme som gemte, hvis ja lægges nye viste frister 
   *    - oven i denne, hvis nej overskrives prop med nye seneste dag, indeholdende frister
   *    - frister visr fra tidligste (oppe) fristdato
   *    - hvis alle ikke er vist for seneste dato, skal side 2 vise fra seneste dato, dog ikke dem er vist
   *  tidligste dato => viste
   *  seneste dato => viste --- hvis tidligste og seneste er ens?
   */

  monthDivisorStructure() {

    return this.getDeadlinesObs()
      .map(el => {

        const
          body = el,
          deadlines = body.deadlines,
          monthsContainer: MonthHolder[] = [];

        deadlines.forEach(deadline => {
           const monthIsExisting =
            monthsContainer.find(el_ =>
              el_.month === deadline.date.getMonth()
              && el_.year === deadline.date.getFullYear()
            );

           if (monthIsExisting) {
             monthIsExisting.deadlines.push(deadline);

           } else {
              monthsContainer.push({
                month: deadline.date.getMonth(),
                year: deadline.date.getFullYear(),
                deadlines: [deadline]
              });

           }

        });

        return monthsContainer;

      });

  }

}

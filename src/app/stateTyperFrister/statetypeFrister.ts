import { Injectable } from '@angular/core';
import { LocalStorageService, LocalStorage } from 'angular-web-storage';
import { DeadlinesFromDates } from '../getDeadlinesFromDates/DeadlinesFromDates';
import { UserCach } from './cachClass';
import { Observable } from 'rxjs/Observable';
import { DeadlineRequest } from '../getDeadlinesFromDates/deadlineUnit';
import { MonthHolder } from '../app.component';

@Injectable()
export class StateFristTyperService {

    constructor (
        public _localService: LocalStorageService,
        public _abstract: DeadlinesFromDates,
    ) {
        this.setStateInit();
    }
    nameLocalStorage = 'godtfrastartUser';
    antalFrister_ = 3;
    deadLineMainObs: Observable<DeadlineRequest>;
    godtFraStartObs: Observable<MonthHolder[]> = this.monthDivisorStructure();

    get antalFrister() {
        return this.antalFrister_;
      }

    set antalFrister(val: any) {
    this.antalFrister_ = Number(val);
    this.deadLineMainObs = this.getDeadlinesObs();
    this.godtFraStartObs = this.monthDivisorStructure();
    }

     userSettings: UserCach;



    setStateInit() {

        const savedUserCaching: UserCach  = this._localService.get(this.nameLocalStorage);
 
        if (savedUserCaching) {
            this.userSettings = savedUserCaching;
            this.godtFraStartObs = this.monthDivisorStructure();
        } else {
            this.userSettings = this.defaultUserSetting();
        }


    }

    defaultUserSetting() {
        return {
            firmStartDate: null,
            fristerShown: [],
            isUntouched: true
        };
    }

    flipValue(id: string) {

        const frist_currentState = this.userSettings.fristerShown.findIndex(el => {
            return el === id;
        });

        if (frist_currentState === -1) {
            this.userSettings.fristerShown.push(id);
        } else {
            this.userSettings.fristerShown.splice(frist_currentState, 1);
        }

        this._localService.set(this.nameLocalStorage, this.userSettings);
        this.godtFraStartObs = this.monthDivisorStructure();

    }

    getAll() {
        return this._abstract.getAllTypes();
    }

    getallTypesMinusThese(ids: string[]) {
        return this.getAll().filter(el => {
          /* hvis ikke i id listen => adder til filter */
          return ids.indexOf(el) === -1;
        });
    }

    getStartingdate() {

        const
            today = new Date(),
            storeddate = this.userSettings.firmStartDate;


        return (storeddate === null)
            ? today
            : storeddate > today.getTime() ? new Date(storeddate) : today;
    }

    getDeadlinesObs(): Observable<DeadlineRequest> {

        const
            antalFrister = this.antalFrister_,
            single = ['selvangivelse'],
            types = this.userSettings ? this.userSettings.fristerShown : [],
            date = this.getStartingdate(),
            direction = 'from';

        return (antalFrister > 0)
            ? this._abstract
            .getSpecificNumberOfDeadlinesFromDate(antalFrister, types, date, direction, new Date(this.userSettings.firmStartDate))
            : Observable.from([]);

    }

    monthDivisorStructure() {

        return (this.antalFrister_ > 0 && this.userSettings && this.userSettings.fristerShown.length > 0)
            ? this.getDeadlinesObs()
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

        }) : Observable.from([]);

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



}

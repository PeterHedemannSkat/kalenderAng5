import { Injectable } from '@angular/core';
import { PeriodEntity } from '../periodClass/periodClass';
import { Period } from '../deadlineBaseAlgorithm/interfaceFristDNA';
import { RateMaster } from '../deadlineBaseAlgorithm/deadlineDataPrototypes';
import { Deadline } from '../deadlineBaseAlgorithm/getDeadline';
import { Observable } from 'rxjs/Observable';
import { DeadlineUnit, EdgeDate, DeadlineRequest } from './deadlineUnit';

import { periodsMap } from '../dataMapping/periodsPrYearOfFrister';
import { rateTypes } from '../dataMapping/fristerTypes';
import { CalenderServices } from '../sharedServices/dateServices';
import { StateFristTyperService } from '../stateTyperFrister/statetypeFrister';
import * as _ from 'lodash';


@Injectable()
export class DeadlinesFromDates {

    constructor (
        public _deadline: Deadline,
        public _dateService: CalenderServices
    ) {}

    public getSpecificNumberOfDeadlinesFromDate(numbers: number, types: string[], date: Date, direction: string, firmStartDate: Date) {

        return this
            .getSpecificNumberOfDeadlinesFromDate_(numbers, types, date, direction, firmStartDate)
            .map(el => {

                const
                    dateofLastElement   = el[numbers - 1].date,
                    deadlinesOfLastDate = el
                        .filter(el_ => {
                            return el_.date.getTime() === dateofLastElement.getTime();
                        })
                        .map(el_ => this.getIdOfPeriod(el_.period)),
                    bruttoDeadlines = el.slice(0, numbers),
                    notIncluded = el.slice(numbers),
                    included = bruttoDeadlines.filter(el_ => {
                        return deadlinesOfLastDate.indexOf(this.getIdOfPeriod(el_.period)) > -1;
                    }),
                    excluded = notIncluded.filter(el_ => {
                        return deadlinesOfLastDate.indexOf(this.getIdOfPeriod(el_.period)) > -1;
                    }),
                    edgeDate = new EdgeDate(included, excluded),
                    result = new DeadlineRequest(bruttoDeadlines, edgeDate, dateofLastElement);

                return result;
            });


    }

    /**
     * Finder X antal frister for hver given type for alle input-typer før/efter en given dato.
     */
    public getSpecificNumberOfDeadlinesFromDate_(numbers: number, types: string[], date: Date, direction: string, firmStartDate: Date) {
    /**
     * Pias rettelse: ikke fra dato med dato-i-periodens-næste-frist
     */
        const allObs = this.getFromDate(numbers, types, date, direction);

        const alt = this.getCorrectPeriod(numbers, types, date, direction, firmStartDate);

        /**
         * Observable.merge(...allObs)
            .flatMap(el => el)
         */

        return alt
            .toArray()
            .map(el => {


                return el.sort((a, b) => {
                    if (a.date < b.date) {
                        return -1;
                    } else if (a.date === b.date) {
                        return 0;
                    } else if (a.date > b.date) {
                        return 1;
                    }
                });
            });


    }


    getCorrectPeriod(numbers: number, types: string[], date: Date, direction: string, firmStartDate: Date) {

        const
            virkStartDate = firmStartDate,
            today = this._dateService.now,
            addADay = (1000 * 60 * 60 * 24);

        const b: Observable<{date, period}>[] = types
            .map(el => {
                /**
                 * Finder fristdato i den periode virksomheden starter, dvs.
                 * først kommmende frist for virksomhed (FKF)
                 */

                const period = this.getPeriodOfDate(el, virkStartDate);

                if (rateTypes.indexOf(el) > -1) {

                    const obs = this.getNextRateDeadlineOfGivenDate(period.id, date)

                    return obs;
                }

                return this._deadline.__getDeadLine__(period);
            });


        const t = Observable.merge(... b)
            .map(el => {
                /** Fra hvilken dato vil vi finde frister? =>
                 * afhænger af FKF
                 * hvis vi er langt efter virksomhedens startdato skal vi naturligvis ikke vise disse frister
                 * med udgangspunkt i den første periode, men fra DD.
                 * = Hvis DD er senere end FKF, vil vi vise frister fra DD og ikke Først kommende frist
                 * = hvis FKF er senere end DD, vil vi vise frister fra FKF
                 */

                 console.log(el);

                return today.getTime() > el.date.getTime() ? {date: today, period: el.period} : el;
                // return firstDayBeforeFrist.getTime() > today.getTime() ? firstDayBeforeFrist : today;

            })

            .map(el => {

                const
                  currentPeriod = el.period,
                  mapper: Period[] = [],
                  id = currentPeriod.id,
                  periodNumbers = periodsMap.find(el_ => el_.deadLineIDs.indexOf(id) > -1).periods,
                  isRateType = rateTypes.find(el_ => id === el_),
                  rates = isRateType ? RateMaster.find(el_ => el_.id.indexOf(id) > -1).baseDate.monthsAfterBase.length : null;

                const
                  periodStart_ = new PeriodEntity(currentPeriod, periodNumbers, rates),
                  periodEnd_ = periodStart_.movePeriod(numbers - 1),
                  periodStart = periodStart_.period,
                  periodEnd = periodEnd_.period;

                  return this.getDeadlinesFromPeriods(periodStart, periodEnd, id);

            })

            .flatMap(el => el);



        return t;


    }


    public getFromDate(numbers: number, types: string[], date_: Date, direction: string) {

        return  types
            .map(el => {

                return this.getBorderDeadline(el, date_, direction)
                    .map(deadline => {

                        const
                            currentPeriod = deadline.period,
                            mapper: Period[] = [],
                            id = currentPeriod.id,
                            periodNumbers = periodsMap.find(el_ => el_.deadLineIDs.indexOf(id) > -1).periods,
                            isRateType = rateTypes.find(el_ => id === el_),
                            rates = isRateType ? RateMaster.find(el_ => el_.id.indexOf(id) > -1).baseDate.monthsAfterBase.length : null;

                        const
                            periodStart_ = new PeriodEntity(currentPeriod, periodNumbers, rates),
                            periodEnd_ = periodStart_.movePeriod(numbers - 1),
                            periodStart = periodStart_.period,
                            periodEnd = periodEnd_.period;



                        return this.getDeadlinesFromPeriods(periodStart, periodEnd, id);

                    });

            });


    }

    public getAllDeadlinesOfAllTypesOfPeriod(types: string[], from: Date, to: Date) {

        const allTypes = types
            .map(el => this.getAllDeadlinesInTimeSpan(el, from, to));

        return Observable
            .merge(... allTypes);

    }

    public getAllDeadlinesInTimeSpan(id: string, from: Date, to: Date) {

        return this.getBordersDeadlineDate(id, from, to)
            .map(el => {
                const
                    firstPeriod = el[0].period,
                    lastPeriod = el[1].period;

                return this.getDeadlinesFromPeriods(firstPeriod, lastPeriod, id);

            })
            .flatMap(el => el);

    }

    /**
     * Finder første periode fra Fradato og frem TIL sidste periode, der ligger før/på
     * Til-datoen. Bemærk heavy-liften fra metoden under getBorder deadlines.
     * @param id firstId
     * @param from  Fraperiode
     * @param to  Til periode
     */

    public getBordersDeadlineDate(id: string, from: Date, to: Date) {

        const
            fromObs = this.getBorderDeadline(id, from, 'from'),
            toObs = this.getBorderDeadline(id, to, 'to');

        return Observable.forkJoin(fromObs, toObs).map(el => {
            return el;
        });

    }

    public getBorderDeadline(id: string, date: Date, direction: string) {

        const isRegularType = !rateTypes.find(el => el === id);

        date = this._dateService.resetDate(date);

        return isRegularType ? this.getBorderDeadlineDate_(id, date, direction) : this.getBorderDeadline_rateType(id, date, direction);
    }

    /**
     * Vi skal knytte fra og til datoerne vi har fået med nogler perioder, så vi har
     * EDGE perioderne. Men hvordan går vi fra en dato til nærmeste frist, før eller efter
     * denne dato.
     * FRA-datoen klienten vil have fristdatoer fra, ligger i en periode, som har en frist,
     * der ligger EFTER FRA-datoen. Det er Fristdato 0´ periode. Sammenhængen mellem
     * en dato og en periode udledes i getPeriodOfDate.
     * Oftest vil den førstefristdato ligge i Fristdato -1' periode, men kan ligge 2 perioder før.
     * Derfor skal vi test fra -2 til 2 (2 behøver vi vist ikke?), hvorfra filtrerer frister
     * uden for perioden fra og sidst i Reduce (ikke helt elegant) finder henholdsvis den
     * sidste/første frist (afhængig af )
     * @param id ID
     * @param date dato som skal testes
     * @param direction FROM eller TO Er det start eller slutningen af perioden.
     */
    public getBorderDeadlineDate_(id: string, date: Date, direction: string): Observable<DeadlineUnit> {

        const container: Observable<DeadlineUnit>[] = [];

        for (let index = -3; index <= 2; index++) {
            container.push(this.getClosestDeadlineOfDate(id, date, index));
        }

        return Observable.merge(...container)
            .filter(el => {
                const isEqual = date.getTime() === el.date.getTime();
                return (direction === 'from') ? (date < el.date || isEqual) : (date > el.date || isEqual);
            })
            .reduce((acc, el) => {
                return (direction === 'from')
                    ? ((el.date < acc.date) ? el : acc)
                    : ((el.date > acc.date) ? el : acc);
            });

    }

    public getBorderDeadline_rateType(id: string, date: Date, direction: string) {

                const
                    prevYear = date.getFullYear() - 1,
                    nextYear = date.getFullYear() + 1,
                    protoRule = RateMaster.find(el => el.id.indexOf(id) > -1),
                    rates = protoRule.baseDate.monthsAfterBase.length,
                    fromPeriod = {period: 1, year: prevYear, rate: 1, id: id},
                    toPeriod = {period: 1, year: nextYear, rate: rates, id: id},
                    start = (direction === 'from') ? new Date(2100, 0, 1) : new Date(2000, 0, 1);

                return this.getDeadlinesFromPeriods(fromPeriod, toPeriod, id)
                    .filter(el => {
                        const isEqual = date.getTime() === el.date.getTime();
                        return (direction === 'from') ? (date < el.date || isEqual) : (date > el.date || isEqual);
                    })
                    .reduce((acc, val) => {
                        return (direction === 'from')
                            ? (val.date < acc.date) ? val : acc
                            : (val.date > acc.date) ? val : acc;
                    });
            }

    public getClosestDeadlineOfDate(id: string, date: Date, distance: number) {

        /**
         * metode der finder frister med udgangspunkt i en dato
         * hvis @distance er 0 er det fristen for dato X i periode Y
         * er den +1 er det dato X => periode Y+1, dvs. længere frem
         * -1 går man naturligvis tilbage
         */

        const offSetPeriod = this.getPeriodPadded(id, date, distance);

        return this._deadline.getDeadLine(offSetPeriod)
            .map(el => new DeadlineUnit(offSetPeriod, el));

    }

    public getPeriodPadded(id: string, date: Date, distance: number) {

        const
        period = this.getPeriodOfDate(id, date),
        offSetPeriod = new PeriodEntity(period, this.periodsOfDeadlineType(id))
            .movePeriod(distance).period;

        return offSetPeriod;
    }

    public getPeriodOfDate(id: string, date: Date): Period {

        /**
         * => vi finder periodens længde i måneder
         * => konkret periode = forudgående perioder + 1
         * => forudgående perioder = måned i date / længden af én periode, rundet ned
         *  -- kvartalsmoms har 4 perioder i et år
         *  -- dvs. periodelængden er 3 måneder
         *  -- fx. for datoen 4. august, dvs. 8. måned, vil der være
         *  -- 8 / 3 (længde) = 2 forudgående perioder, dvs.
         * => vi befinder os i 3. periode 2 + 1
         *  Året fra date er uforandret.
         */

        const
            year = date.getFullYear(),
            periods = this.periodsOfDeadlineType(id),
            month /* 1-12 */ = date.getMonth() + 1,
            lengthOfPeriod = 12 / periods,
            period = Math.ceil(month / lengthOfPeriod );

        return {id: id, period: period, year: year};

    }

    getNextRateDeadlineOfGivenDate(id: string, date: Date): Observable<{date, period}> {

        const
            rate_ = rateTypes.find(el => el === id),
            period = this.getPeriodOfDate(id, date),
            exactTimeofDate = date.getTime();

        if (!!rate_) {

            const
                rate_info = RateMaster.find(el => el.id.indexOf(id) > -1),
                obsArray: Observable<{date, period}>[] = [],
                numberofRate = rate_info.baseDate.monthsAfterBase.length;

            for (let i = 0; i < numberofRate; i++) {

                const newPeriod = Object.assign({}, period);
                newPeriod.rate = i + 1;
                obsArray[i] = this._deadline.__getDeadLine__(newPeriod);

            }

            return Observable.forkJoin(... obsArray)
                .switchMap(el => {

                    const
                        year = el[0].date.getFullYear(),
                        first = new Date(year - 1, 11, 31, 23, 0);

                    const only = el.map(el_ => el_.date);

                    only.unshift(first);

                    const len = only.length;

                    let NKF; // Næst Kommende Frist

                    let periodId;

                    for (let i = 0; i < len; i++) {
                      if (i < len - 1) {
                        if (exactTimeofDate > only[i].getTime() && exactTimeofDate <= only[i + 1].getTime()) {
                          NKF = only[i + 1];
                          periodId = i + 1;

                        } else if (i === len - 1 && exactTimeofDate <= only[len - 1]) {
                          NKF = only[i];
                          periodId = i + 1;
                        }
                      }
                    }

                    const nextPeriod = this.getPeriodPadded(period.id, date, 1);
                    nextPeriod.rate = 1;

                    period.rate = periodId;

                    return NKF ? Observable.of({date: NKF, period: period}) : this._deadline.__getDeadLine__(nextPeriod);



                    });


        } else {

            throw new Error('getRatePeriodOfRatetype needs rate type');
        }

        

    }

    public firstDayAfterPeriod(period: Period) {

        const
            periodNr = period.period,
            numberOfPeriods = periodsMap.find(el => el.deadLineIDs.indexOf(period.id) > -1).periods,
            lengthOfPeriod = 12 / numberOfPeriods,
            month_ = periodNr * lengthOfPeriod;

        let month, year;

        if (month_ === 12) {
            month = 0;
            year = period.year + 1;
        } else {
            month = month_;
            year = period.year;
        }

        return new Date(year, month, 1);

    }

    private periodsOfDeadlineType (id: string) {
        return periodsMap.find(el => el.deadLineIDs.indexOf(id) > -1).periods;
    }

    public getDeadlinesFromPeriods(from: Period, to: Period, id: string) {

        const
            periods = periodsMap.find(el => el.deadLineIDs.indexOf(id) > -1).periods,
            isRegular = !rateTypes.find(el => el === id),
            datesObservables: Observable<Date>[] = [];

        let rates, period: PeriodEntity;

        if (!isRegular) {
            rates = RateMaster.find(el => el.id.indexOf(id) > -1).baseDate.monthsAfterBase.length;
        }

        const periodMapper: Period[] = [];
        period = new PeriodEntity(from, periods, rates);

        /**
         * vi skal udlede alle perioder fra Periode 0^ til Periode 1^
         * derfor skal vi bruge alle Periode-obj, som samles i en observer array.
         * => denne array kan resolves via forkJoin, som subscriber på alle elementerne
         * => objekterne skal dog dekoreres med periode og id, så de senere kan genkendes.
         * -- alle Periode bygges i While loopet, som kører indtil proxy-perioden er senere end til-perioden
         * PeriodEntity er en overbygning på Period, der har en række nyttige metode,
         * som sammenligning med andre periode-obj og ikke mindst inkrementere X antal perioder
         *
         */

        while (period.isEarlierOrEqualToThisPeriod(to)) {
            datesObservables.push(this._deadline.getDeadLine(period.period));
            periodMapper.push(period.period);
            period = period.movePeriod(1);

        }

        return Observable.forkJoin(datesObservables).map(el => {
            return  el.map((el_, i) => {
                return new DeadlineUnit(periodMapper[i], el_);
                // return new DeadlineItem(el_, periodMapper[i], from.id);
            });

        })
        .flatMap(el => el);

    }

    /**
     * Finder alle registrerede fristtyper
     */
    public getAllTypes() {
        return periodsMap
        .map(el => el.deadLineIDs)
        .reduce((prev, cur) => prev.concat(cur), []);
    }

    public getIdOfPeriod (period: Period) {
        return `${period.id}${period.period}${period.year}${period.rate || ''}`;
    }

}

class DeadlineItem {
    constructor (
        public date: Date,
        public period: Period,
        public id: string
    ) {}
}

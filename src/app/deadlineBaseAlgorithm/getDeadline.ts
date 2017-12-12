import { Period, DeadLineRule, RateDeadLineRule } from './interfaceFristDNA';
import { masterRules, RateMaster, ruleException } from './deadlineDataPrototypes';
import { Injectable } from '@angular/core';
import { CalenderServices } from '../sharedServices/dateServices';
import { MathCalc } from '../sharedServices/math.services';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { environment } from '../../environments/environment';
import { ManualDeadLines } from '../externalDataStore/dataStore';
import { periodsMap } from '../dataMapping/periodsPrYearOfFrister';
import { rateTypes } from '../dataMapping/fristerTypes';
import { TxtDap } from '../textServices/textInterface';


@Injectable()
export class Deadline {

    service: Observable<TxtDap[]>;

    constructor(
        public _calender: CalenderServices,
        public _math: MathCalc,
        public _http: Http
    ) {
        /**
         * Her bor Observablen, der henter manuelle frister. Initeres ved opstart, da klassen er en singleton.
         */

        const dapOid = 147384;

        const urlManual = (environment.production) ? `websrv/jsong.ashx?clear=1&Id=${dapOid}` : 'app/deadlinesManual';
        this.service =  this._http.get(urlManual).map(el =>  el.json())
            .map(el_ => {
                // const a = environment.production ? el_[0].children : el_;
                return el_ as TxtDap[];
            })
            .share();
    }

    public getDeadLine (period_: Period) {

        return this.service
            .map(deadLines => {
                /**
                 * Vi tjekker først om vi finder en manual datoopsætning, som skal
                 * override den automatiske beregnet.
                 * Normalt router vi direkte videre til getDeadLine_, som finder den automatisk beregnet frist.
                 */

                const manualExceptionDate = deadLines.find(el_ => {

                    const
                        _period_ = el_.en.split('-'),
                        period = Number(_period_[1]),
                        year = Number(_period_[0]),
                        rateCheck = (period_.rate > 0) ? (Number(_period_[2]) === period_.rate) : true;

                    return el_.id === period_.id && period === period_.period && period_.year === year && rateCheck;
                });

                return (manualExceptionDate) ? this.parseDate(manualExceptionDate.da) : this.getDeadLine_(period_);

            });

    }


    public getProxyID(id: string) {

        const isLoonSum = id.match(/loonsum.+[1|3|4A]/);
        return isLoonSum ? 'loonsum_method134' : id;
    }

    private parseDate(dateStr: string) {

        const
            dateStr_ = dateStr.split(' ')[0].split('-'),
            day = Number(dateStr_[0]),
            month = Number(dateStr_[1]),
            year = Number(dateStr_[2]);

        return new Date(year, month - 1, day);

    }


    private getDeadLine_(period_: Period) {

        const
            isNonRateType = rateTypes.indexOf(period_.id) === -1,
            period = period_.period,
            year = period_.year;


        let originalMonth, direction, monthsSpins, ruleProto: DeadLineRule, rateProto: RateDeadLineRule, rateDay, regDay;
        /**
         * vi leder efter en ny skille-dato, hvorfra vi enten bevæger os frem eller tilbage,
         * afhængig af om datoen må være i weekend eller på en helligdag =>
         * vi skal derfor beregne måned, dag og år udfra periode [year:xxxx,period:y, og måske rate]
         * vi skal vide om det en rate-frist type eller en normal type
         */
        if (isNonRateType) {
            /**
             * Er det en normal fristtype, skal først kende måned 0' efter periodens udløb, som vi udleder ved
             * først at finde længden i måneder på en periode og gange det med perioden måneden.
             * hvis den finder en ungtagelse (foreløbig kun to) er det dennes prototype der gælder (overwrite) ellers den normale
             * Kvartalsmoms:
             * -- periodelængde = 12 / 4 = 3 måneder
             * -- 3. periode = 3 * 3 => 9 måned => september (originalMonth)
             * -- => dvs. oktober (måned 9 i den normale Date array) er måned 0
             * -- ligger 2 måned efter 0´måned, dvs. => december
             * -- Denne operation bliver udført af
             * -- Skilledagen ligger fast på 1. med mindre det er en helligdag eller weekend
             * // gearMoves, som er en tandhjulsmetode, der finder den nye position i tandhjul.
             * // monthsSkins er antal måneder som skal roteres, fra udgangspunkts måneden
             * // I nogle tilfælde skifter året nemlig
             */


            const
                periods = periodsMap.find(el => el.deadLineIDs.indexOf(period_.id) > -1).periods,
                periodLength = (12 / periods),
                exception = ruleException.find(rule_ => rule_.id === period_.id && rule_.period === period_.period);
            // finder vi en exception bruger vi denne proto, ellers den normale
            ruleProto = exception ? exception.overwrite : masterRules.find(rule_ => rule_.id.indexOf(period_.id) > -1);
            // er IKKE originalmonth, men første efterfølgende måned efter perioden udløb
            originalMonth = periodLength * period;
            monthsSpins = ruleProto.baseDate.monthsDif;
            direction = ruleProto.searchParameters.heading;



        } else {

            /**
             * her er orginalMonth den første måned, da raterne er inden for et år
             * her er den specifikke rate sat i forhold til den første måned
             * 1. rate er 0 index i arrayen, som fortæller, hvor mange måneder man skal
             * frem for at nå til den konkrete ratemåned, dvs. monthsSpins variablen
             */

            rateProto = RateMaster.find(rule_ => rule_.id.indexOf(period_.id) > -1);
            originalMonth = 0;
            monthsSpins = rateProto.baseDate.monthsAfterBase[period_.rate - 1];
            direction = rateProto.searchParameters.heading;

            const content_ = rateProto.baseDate.rateType;

            rateDay = content_.isDayStatic ? content_.dayStatic : content_.dayDynamic[period_.rate - 1];

        }

        /**
         * herunder roterer vi måneder udledt ovenfor
         * skilledagen er i rate-scenariet afhængig af hvilken rate der er tale om
         */

        direction = (direction = '>') ? 'forward' : 'backward';

        const
            _spins = this._math.gearsMove(12, originalMonth, monthsSpins, direction),
            newMonth = _spins.newGearPosition,
            newYear = _spins.spins + year;

        if (isNonRateType) {
            regDay = ruleProto.searchParameters.special === 'LastDayOfMonth'
                ? this._calender.daysInMonthOfYear(newYear)[newMonth === 12 ? 0 : newMonth]
                : ruleProto.baseDate.dayInMonth;
        }

        const
            dayInMonth = (isNonRateType) ? regDay : rateDay,
            newDateDivider = new Date(newYear, newMonth, dayInMonth),
            excludeRaw = (isNonRateType) ? ruleProto.searchParameters : rateProto.searchParameters;
        const exclude = [excludeRaw].map(el => {
                return {weekends: el.onWeekends, holidays: el.onHolidays, specificWeekdays: el.specialweekdays };
            })[0];


        const theDate = this._calender.findClosest(newDateDivider, direction, exclude);

            return theDate;

    }
}

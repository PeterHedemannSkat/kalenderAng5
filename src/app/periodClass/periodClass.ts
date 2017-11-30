import { Period, DeadLineRule, RateDeadLineRule } from '../deadlineBaseAlgorithm/interfaceFristDNA';
import { MathCalc, MultiGears } from '../sharedServices/math.services';

export class PeriodEntity {

        constructor (public period: Period, public periods: number, public ratesInPeriod?: number) { }

        isEalierThanThisPeriod (period: Period) {

            const yearIsequal     = period.year === this.period.year,
                periodIdEqual   = period.period === this.period.period;

            if (period.year > this.period.year) {
                return true;
            } else if (yearIsequal && period.period > this.period.period) {
                return true;
            } else if (yearIsequal && periodIdEqual && (this.period.rate === undefined || period.rate > this.period.rate)) {
                return true;
            }

            return false;

        }

        isEqualTo (period: Period) {

            return  period.year      === this.period.year &&
                    period.period    === this.period.period &&
                    (this.period.rate === undefined || period.rate === this.period.rate);

        }

        isEarlierOrEqualToThisPeriod(period: Period) {
            return this.isEalierThanThisPeriod(period) || this.isEqualTo(period);

        }

        movePeriod (moves: number)  {

           /* return new period object  */

            const
                gearArray: MultiGears[] = [],
                math        = new MathCalc(),
                subs        = this.ratesInPeriod && this.ratesInPeriod > 0,
                direction   = (moves < 0) ? '<' : '>';

            gearArray.push({gears: this.periods, startingPosition: this.period.period});

            if (subs) {

                const
                    subGearsNumber  = this.ratesInPeriod,
                    rateNumber      = this.period.rate;

                gearArray.unshift({gears: subGearsNumber, startingPosition: rateNumber});

            }

            const
                spin        = math.multidimensionGearMove(gearArray, moves, direction),
                lastArray   = gearArray.length - 1,
                newPeriod   = spin[lastArray].position,
                newYear     = spin[lastArray].rounds;

            const
                newPeriodObj: Period = {
                    period: newPeriod,
                    year: newYear + this.period.year,
                    id: this.period.id
                };

            if (subs) {
                newPeriodObj.rate = spin[0].position;
            }

            return new PeriodEntity(newPeriodObj, this.periods, this.ratesInPeriod);

        }

    }

import { Injectable } from '@angular/core';

export interface MultiGears {
    gears: number;
    startingPosition: number;
}

@Injectable()
export class MathCalc {

    multidimensionGearMove (gearsDefinition: MultiGears[], moves: number, flow: string) {

        return gearsDefinition.map(gear => {

            const newSpin = this.gearsMove(gear.gears, gear.startingPosition, moves, flow);
            moves = newSpin.spins;

            return {
                position: newSpin.newGearPosition,
                rounds: newSpin.spins
            };

        });

    }

    gearsMove (gears: number, orginalposition: number, moves: number, flow: string) {

        const
            movesAbs                = Math.abs(moves),
            direction               = (moves < 0) ? '<' : '>',
            newPos                  = orginalposition + moves;

        let     spins               = 0;

        let    newGearPosition: number;

        /* first check if it's an easy one - in the same year - otherwise do math look in logik  */
        if (newPos <= gears && newPos > 0) {

            newGearPosition   = newPos;

        } else {

            /* rest is the moves BEYOND moves in the starting (period-block)
            [which is different depending on moving down or up]. Years and end period can be deffered from this  */

            const rest                = (direction === '>') ? (movesAbs - (gears - orginalposition)) : (movesAbs - (orginalposition - 1)),
                yearsChange         = Math.ceil(rest / gears),
                yearDirection       = (direction === '>') ? 1 : -1,
                mod                 = rest % gears,
                patternKey: number[] = [],
                patternFn: Object    = {
                    '>': function (i: number) {
                        if (i === gears - 1) {
                            patternKey.push(0); } else {
                            patternKey.push(i + 1);
                        }

                    },
                    '<': function (i: number) {
                        if (i === 0) {
                            patternKey.push(0); } else {
                                patternKey.push(gears - i);
                            }
                    }
                };

            for (let i = 0; i < gears; i++) {
                patternFn[direction](i);
            }

            newGearPosition      = patternKey.indexOf(mod) + 1;
            spins                =  Math.ceil(yearDirection * yearsChange);

        }

        return {
            newGearPosition: newGearPosition,
            spins: spins
        };


    }

    private getFraction (val: number) {
        return val - Math.floor(val);
    }

    maskInteger (number: number, seperator: string) {

        /*
            transforming 6453 -> [6,453] (array) -> joing 6 453
            Recursively chopping the three last digits and inserting the last-three block into an array.
             When number is smaller than 3 charecters the element will be smaller.
            Stops when there are not remaining numbers and returns array
        */

        const masking = function (number_: string, cached: string[]): string[] {

            const stringFormat    = number_.toString(),
                lastThreeDigits = stringFormat.slice(-3),
                remainingDigits = stringFormat.slice(0, -3);

            cached.unshift(lastThreeDigits);

            return (remainingDigits.length > 0) ? masking(remainingDigits, cached) : cached;

        };

        return masking(number.toString(), []).join(seperator);

    }

    maskFloatingNumber (val: number, seperator: string, fractionSize: number) {

        const integer     = Math.floor(val),
            fraction    = this.getFraction(val),
            mask        = this.maskInteger(integer, seperator),
            fractionStr = fraction.toFixed(fractionSize);

        return `${mask},${fractionStr}`;

    }


}

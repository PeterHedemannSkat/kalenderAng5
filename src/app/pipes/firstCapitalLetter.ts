import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'FirstLetterToCapital'})
export class FirstLetterToCapitalPipe implements PipeTransform {
    transform(str: string): string {

        if (str) {
            const
            firstLetter         = str.charAt(0),
            firstCapitalLetter  = firstLetter.toUpperCase();

            return str.replace(firstLetter, firstCapitalLetter);
        } else {
            return '';
        }


    }
}

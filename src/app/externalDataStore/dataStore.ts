import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { manualDeadLines, deadlinesManual } from './logic/manualDeadlines';
import { namesMainTypes } from './texts/fristNames';
import { normalNames } from './texts/diverseNames';
import { subTitles } from './texts/subTitles';
import { monthNames } from './texts/monthnamesDK';
import { periodTerms } from './texts/periodTerms';
import { weekdays } from './texts/weekDaysDK';
import { laeringsPakke } from './texts/laeringsPakkeNames';
import { activeLaeringsPakker } from './logic/activeLaeringsPakker';



export interface ManualDeadLines {

    Id: string;
    year: number;
    Periode: number;
    Frist: string;

}


export class ExternalData implements InMemoryWebApiModule {

        createDb() {

            return {
                manualDeadLines,
                namesMainTypes,
                normalNames,
                subTitles,
                monthNames,
                periodTerms,
                weekdays,
                laeringsPakke,
                activeLaeringsPakker,
                deadlinesManual
            };
        }
    }

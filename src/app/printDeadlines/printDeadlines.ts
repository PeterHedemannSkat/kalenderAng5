import { Injectable } from '@angular/core';
import { TxtSharedService } from '../TxtSharedService/txtSharedService';
import { textMapper } from '../dataMapping/textMapper';
import { rateTypes } from '../dataMapping/fristerTypes';
import { periodsMap } from '../dataMapping/periodsPrYearOfFrister';
import { Deadline } from '../deadlineBaseAlgorithm/getDeadline';
import { DeadlineUnit } from '../getDeadlinesFromDates/deadlineUnit';

@Injectable()
export class PrintDeadlinesService {
    constructor (
        public _txtService: TxtSharedService
    ) {}

    printMainLabel(deadline: DeadlineUnit) {
        const
          mainTypeID = textMapper.find(el => el.types.indexOf(deadline.period.id) > -1).id;
        return `${this._txtService.txt.get(mainTypeID)}`;
    }

    printPeriod(deadline: DeadlineUnit) {

        return `${this.print_subCategory(deadline)}
          ${this._txtService.txt.get('for')} ${this.print_forPeriod(deadline)} ${deadline.period.year}`;

    }

    print_forPeriod(deadline: DeadlineUnit) {

        const periods = periodsMap.find(el => el.deadLineIDs.indexOf(deadline.period.id) > -1).periods;

        switch (periods) {
            case 1:
            return this._txtService.txt.get('aar');
            case 2:
            return `${deadline.period.period}. ${this._txtService.txt.get('halvaar')}`;
            case 4:
            return `${deadline.period.period}. ${this._txtService.txt.get('kvartal')}`;
            case 12:
            const
                monthNum = deadline.period.period - 1,
                monthName = this._txtService.txt
                .getGroup('monthNames')
                .find(el => el.id === monthNum.toString());

            return monthName ? monthName.txt : '';

        }
    }

    print_subCategory(deadline: DeadlineUnit) {

        const isRegular = rateTypes.indexOf(deadline.period.id) === -1;

        if (isRegular) {

            const
            containsSub = textMapper.find(el => el.types.indexOf(deadline.period.id) > -1).types.length > 1;

            return containsSub ? this._txtService.txt.get(deadline.period.id, 'subTitles') : '' ;

        } else {

            return `${deadline.period.rate}. ${this._txtService.txt.get('rate')}`;

        }

    }

    print_date(deadline: DeadlineUnit) {

        const
            date = deadline.date,
            weekdays_ = this._txtService.txt.getGroup('weekdays'),
            months_ = this._txtService.txt.getGroup('monthNames'),
            year = date.getFullYear(),
            weekdayName_ = weekdays_.find(el => el.id === date.getDay().toString()),
            monthName_ = months_.find(el => el.id === date.getMonth().toString()),
            weekdayName = weekdayName_ ? weekdayName_.txt : '',
            monthName = monthName_ ? monthName_.txt : '';

        return `${weekdayName} ${date.getDate()}. ${monthName} ${year}`;

    }

}

import { Injectable } from '@angular/core';
import { TxtSharedService } from '../TxtSharedService/txtSharedService';
import { textMapper } from '../dataMapping/textMapper';
import { DeadlineUnit } from '../getDeadlinesFromDates/deadlineUnit';
import { UrlValues } from './transferClasses';

@Injectable()
export class TransferToCalenderService {

    startTime: Date;
    endTime: Date;

    constructor (
        public _TxtSharedService: TxtSharedService
    ) {}

    google(deadline: DeadlineUnit) {

        const
            baseGoogleUrl = 'https://www.google.com/calendar/render?action=TEMPLATE&sprop=&sprop=name',
            val = this.getUrlEntities(deadline),
            txt = `&text=${val.txt}`,
            from = val.from,
            to = val.to,
            dates = `&dates=${from}/${to}`,
            total = `${baseGoogleUrl}${txt}${dates}`,
            urlEncoded = encodeURI(total);

        return urlEncoded;

    }

    ics(deadline: DeadlineUnit) {

        const val = this.getUrlEntities(deadline);

            const href = encodeURI(
                'data:text/calendar;charset=utf8,' + [
                  'BEGIN:VCALENDAR',
                  'VERSION:2.0',
                  'BEGIN:VEVENT',
                  'URL:' + document.URL,
                  'DTSTART:' + (val.from || ''),
                  'DTEND:' + (val.to || ''),
                  'SUMMARY:' + (val.txt || ''),
                  'DESCRIPTION:',
                  'LOCATION:',
                  'END:VEVENT',
                  'END:VCALENDAR'].join('\n'));

            return href;

    }

    private getUrlEntities(deadline: DeadlineUnit) {

        const
            txt = this.fristName(deadline.period.id),
            hour = 60 * 60 * 1000,
            from_ = new Date(deadline.date.getTime() + (20 * hour)),
            from = this.formatDateToString(from_),
            oneHourLater = new Date(from_.getTime() + (3 * hour)),
            to = this.formatDateToString(oneHourLater);

        return new UrlValues(from, to, txt);

    }

    private formatDateToString (date) {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    }

    fristName(id: string) {

        const group = textMapper.find(el => el.types.indexOf(id) > -1);
        return group ? this._TxtSharedService.txt.get(group.id) : '';
    }
}

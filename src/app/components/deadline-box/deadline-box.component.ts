import { Component, OnInit, Input } from '@angular/core';
import { DeadlineUnit } from '../../getDeadlinesFromDates/deadlineUnit';
import { TxtSharedService } from '../../TxtSharedService/txtSharedService';
import { GetText } from '../../textServices/getTxt';
import { Texts } from '../../textServices/testServices';
import { textMapper } from '../../dataMapping/textMapper';
import { Period } from '../../deadlineBaseAlgorithm/interfaceFristDNA';
import { periodsMap } from '../../dataMapping/periodsPrYearOfFrister';
import { rateTypes } from '../../dataMapping/fristerTypes';
import { LaeringsPakkeService } from '../../laeringsPakkerLogik/laeringsPakke';
import { environment } from '../../../environments/environment';
import { iconMapping } from '../../dataMapping/iconUrlMap';
import { iconNames } from '../../dataMapping/iconOfMainDeadLines';
import { UrlRessourceService } from '../../urlRessource/urlressource';


@Component({
  selector: 'app-deadline-box',
  templateUrl: './deadline-box.component.html',
})
export class DeadlineBoxComponent implements OnInit {

  txt: GetText = new GetText();

  @Input()
  deadline: DeadlineUnit;

  constructor(
    public _txtService: TxtSharedService,
    public _laeringspakker: LaeringsPakkeService,
    public _UrlRessourceService: UrlRessourceService

) {}

  ngOnInit() {

  }

  srcGroupIcon() {

    const
      id = this.deadline.period.id,
      group = textMapper.find(el => el.types.indexOf(id) > -1).id,
      url = this._UrlRessourceService.getGodtFraStartIconUrlsOfFrist(group);

    return  url;

  }

  srcOfIcon(id: string) {
    return this._UrlRessourceService.getGodtFraStartIconUrlOfLeaeringsPakke(id);

  }

  getUrlOfLaeringsPakke(id: string) {
    return this._UrlRessourceService.getUrlForRegularSkatDkLink(id);
  }

  getLaeringsPakkeNavn(id: string) {
    return this._txtService.txt.get(id);
  }

  getLaeringsPakker() {
    return this._laeringspakker.getLaeringsPakker(this.deadline.period.id);
  }

  printMainLabel() {
    const
      mainTypeID = textMapper.find(el => el.types.indexOf(this.deadline.period.id) > -1).id;

    return `${this._txtService.txt.get(mainTypeID)}`;
  }

  printPeriod() {

    return `${this.print_subCategory()}
      ${this._txtService.txt.get('for')} ${this.print_forPeriod()} ${this.deadline.period.year}`;

  }

print_forPeriod() {

    const periods = periodsMap.find(el => el.deadLineIDs.indexOf(this.deadline.period.id) > -1).periods;

    switch (periods) {
        case 1:
        return this._txtService.txt.get('aar');
        case 2:
        return `${this.deadline.period.period}. ${this._txtService.txt.get('halvaar')}`;
        case 4:
        return `${this.deadline.period.period}. ${this._txtService.txt.get('kvartal')}`;
        case 12:
        const
            monthNum = this.deadline.period.period - 1,
            monthName = this._txtService.txt
            .getGroup('monthNames')
            .find(el => el.id === monthNum.toString());

        return monthName ? monthName.txt : '';

    }
}

print_subCategory() {

    const isRegular = rateTypes.indexOf(this.deadline.period.id) === -1;

    if (isRegular) {

        const
        containsSub = textMapper.find(el => el.types.indexOf(this.deadline.period.id) > -1).types.length > 1;

        return containsSub ? this._txtService.txt.get(this.deadline.period.id, 'subTitles') : '' ;

    } else {

        return `${this.deadline.period.rate}. ${this._txtService.txt.get('rate')}`;

    }

}

print_date() {

const
    date = this.deadline.date,
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

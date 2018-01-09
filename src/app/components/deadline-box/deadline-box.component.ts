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
import { PrintDeadlinesService } from '../../printDeadlines/printDeadlines';
import { LogOnMapper } from '../../dataMapping/logOnMapper';
import { DeadlinesFromDates } from '../../getDeadlinesFromDates/DeadlinesFromDates';


@Component({
  selector: 'app-deadline-box',
  templateUrl: './deadline-box.component.html',
  providers: [PrintDeadlinesService]
})
export class DeadlineBoxComponent implements OnInit  {

  logonMap = LogOnMapper;

  txt: GetText = new GetText();
  toogleCalenderTransferOpen = false;

  @Input()
  deadline: DeadlineUnit;

  constructor(
    public _txtService: TxtSharedService,
    public _laeringspakker: LaeringsPakkeService,
    public _UrlRessourceService: UrlRessourceService,
    public _txtDeadline: PrintDeadlinesService,
    public _deadline: DeadlinesFromDates

) {}

  ngOnInit() {



  }

  showBotton() {

    const maintype = textMapper.find(el => el.types.indexOf(this.deadline.period.id) > -1).id;
    const _frist = this.logonMap.find(el => el.id === maintype);

    if (_frist.button) {

      const
        now = new Date().getTime();

      /* er værdi -1 bruges den korrekte log på periode - ved selvangivelse bruges X før frist */

      const firstDayAfterPeriod = _frist.openBeforeDeadline === -1
        ? this._deadline.firstDayAfterPeriod(this.deadline.period).getTime()
        : (this.deadline.date.getTime() - (_frist.openBeforeDeadline * 24 * 60 * 60 * 1000));

      /* er tiden senere end første dag efter periodens afslutning kan man rette */
      return now > firstDayAfterPeriod;

    } else {

      return _frist.button;

    }


  }

  urlOfButton() {
    const maintype = textMapper.find(el => el.types.indexOf(this.deadline.period.id) > -1).id;
    const _frist = this.logonMap.find(el => el.id === maintype);

    return _frist.url;
  }

  srcGroupIcon() {

    const
      id = this.deadline.period.id,
      group = textMapper.find(el => el.types.indexOf(id) > -1).id,
      url = this._UrlRessourceService.getGodtFraStartIconUrlsOfFrist(group);

    return  url;

  }

  getArrow() {

    const
      collapsedUrl = 'style/images/collapsed.svg',
      expandedUrl = 'style/images/expanded.svg';

      return this.toogleCalenderTransferOpen ? expandedUrl : collapsedUrl;

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
    return this._txtDeadline.printMainLabel(this.deadline);
  }

  printPeriod() {
    return this._txtDeadline.printPeriod(this.deadline);
  }

  print_forPeriod() {
    return this._txtDeadline.print_forPeriod(this.deadline);
  }

  print_subCategory() {
    return this._txtDeadline.print_subCategory(this.deadline);
  }

  print_date() {
    return this._txtDeadline.print_date(this.deadline);
  }


}

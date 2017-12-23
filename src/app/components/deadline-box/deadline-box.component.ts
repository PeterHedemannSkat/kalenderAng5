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


@Component({
  selector: 'app-deadline-box',
  templateUrl: './deadline-box.component.html',
  providers: [PrintDeadlinesService]
})
export class DeadlineBoxComponent implements OnInit  {

  txt: GetText = new GetText();
  toogleCalenderTransferOpen = false;

  @Input()
  deadline: DeadlineUnit;

  constructor(
    public _txtService: TxtSharedService,
    public _laeringspakker: LaeringsPakkeService,
    public _UrlRessourceService: UrlRessourceService,
    public _txtDeadline: PrintDeadlinesService

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

import { Component, OnInit, Input } from '@angular/core';
import { DeadlineUnit } from '../../getDeadlinesFromDates/deadlineUnit';
import { TransferToCalenderService } from '../../transferCalender/transferToCalender';
import { TxtSharedService } from '../../TxtSharedService/txtSharedService';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-transfer-to-calender',
  templateUrl: './transfer-to-calender.component.html',
  styles: []
})
export class TransferToCalenderComponent implements OnInit {

  @Input()
  deadline: DeadlineUnit;

  constructor(
    public _transfer: TransferToCalenderService,
    public _txt: TxtSharedService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getGoogleUrl() {
    return this._transfer.google(this.deadline);
  }

  getIcs() {
    return this.sanitize(this._transfer.ics(this.deadline));
  }



}

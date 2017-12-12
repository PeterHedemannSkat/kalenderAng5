import { Component, OnInit, Input } from '@angular/core';
import { PrintDeadlinesService } from '../../printDeadlines/printDeadlines';
import { TxtSharedService } from '../../TxtSharedService/txtSharedService';
import { DeadlineUnit } from '../../getDeadlinesFromDates/deadlineUnit';

@Component({
  selector: 'app-regular-deadline-box',
  templateUrl: './regular-deadline-box.component.html',
  styleUrls: ['./regular-deadline-box.component.css'],
  providers: [PrintDeadlinesService]
})
export class RegularDeadlineBoxComponent implements OnInit {

  @Input()
  deadline: DeadlineUnit;

  constructor(
    public _txtDeadline: PrintDeadlinesService,
    public _txtService: TxtSharedService,
  ) {}

  ngOnInit() {
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

import { Component, OnInit, Input } from '@angular/core';
import { DeadlineRequest } from '../../getDeadlinesFromDates/deadlineUnit';
import { TxtSharedService } from '../../TxtSharedService/txtSharedService';
import { MonthHolder } from '../../app.component';

@Component({
  selector: 'app-deadline-godt-for-start',
  templateUrl: './deadline-godt-for-start.component.html',
  styles: []
})
export class DeadlineGodtForStartComponent implements OnInit {

  @Input()
  data: MonthHolder[];
  listindex: number;

  constructor(
      public _txt: TxtSharedService

  ) {}

  ngOnInit() {
  }

  printMonth(id: number) {

    const allmonths_ = this._txt.txt.getGroup('monthNames');
    return allmonths_.find(el => el.id === id.toString()).txt;
  }


  isOddListItem(m: number, l: number) {

    const itemsBefore = this.data.reduce((acc, val, i) => {
      return (i < m) ? (val.deadlines.length + acc) : acc;
    }, 0);

    const items = itemsBefore + (l + 1);

    return  (items % 2 !== 0) ? true : false;
  }

  newYear(index: number) {

    const cur = this.data[index].year;

    if (index > 0) {

      const prev = this.data[index - 1].year;
      return prev !== cur ? cur : '';

    } else {
      return cur;
    }

  }

}

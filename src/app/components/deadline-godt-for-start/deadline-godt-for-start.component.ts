import { Component, OnInit, Input } from '@angular/core';
import { DeadlineRequest, DeadlineUnit } from '../../getDeadlinesFromDates/deadlineUnit';
import { TxtSharedService } from '../../TxtSharedService/txtSharedService';
import { MonthHolder } from '../../app.component';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Deadline } from '../../deadlineBaseAlgorithm/getDeadline';

@Component({
  selector: 'app-deadline-godt-for-start',
  templateUrl: './deadline-godt-for-start.component.html',
  styles: []
})
export class DeadlineGodtForStartComponent implements OnInit, OnChanges {

  @Input()
  data: MonthHolder[];
  localdata: MonthHolder[] = [];
  listindex: number;

  @Input()
  number: number;

  constructor(
      public _txt: TxtSharedService

  ) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    /**
     * Vi vil gerne undgå i GUIen at den 100 % reloader (ved at overskrive observablen)
     * Derfor bruger vi ngOnChanges, som skriver til en lokal array, der holder styr på
     * om data input er forskelligt fra lokale data-arrayen.
     *
     * Skal holde styr på en masse bevægelige dele. Eksisterer month-var i d begge.
     */

    const value: MonthHolder[] = changes['data'].currentValue;

    if (value) {

      value.forEach(el => {

        const monthRefInStore = this.localdata.find(el_ => {
          return el_.month === el.month && el_.year === el.year;
        });

        if (!!monthRefInStore) {
          const deadlinesNotStoredInArrays = el.deadlines.filter(el_ => {

            const periodDoesNotExistInStore = !monthRefInStore.deadlines.some(el__ => {
              return this.compareDeadlines(el__, el_);
            });

            const inStoreButNotInNewDeadlinePackage = monthRefInStore.deadlines.filter(el__ => {
              return !el.deadlines.some(latestValues => {
                return this.compareDeadlines(latestValues, el__);
              });
            });

            inStoreButNotInNewDeadlinePackage.forEach(el__ => {

              const locateObj = monthRefInStore.deadlines.findIndex(el___ => {
                return this.compareDeadlines(el__, el___);
              });

              if (locateObj > -1) {
                monthRefInStore.deadlines.splice(locateObj, 1);
              }

            });


            if (periodDoesNotExistInStore) {
              monthRefInStore.deadlines.push(el_);
              monthRefInStore.deadlines.sort((a, b) => {
                if (a.date < b.date) {
                  return -1;
                } else if (a.date === b.date) {
                    return 0;
                } else if (a.date > b.date) {
                    return 1;
                }
              });

            }

          });

        } else {
          // create obj
          this.localdata.push({
            month: el.month,
            year: el.year,
            deadlines: el.deadlines
          });
        }

      });

      this.localdata.sort((a, b) => {
        if (a.year < b.year || (a.year === b.year && a.month < b.month)) {
          return -1;
        } else if (a.year > b.year || (a.year === b.year && a.month > b.month)) {
          return 1;
        } else {
          return 0;
        }
      });

      const count = this.localdata.reduce((state, cur) => {
        return state + cur.deadlines.length;
      }, 0);

      let index = 0;
      let monthIndex = 0;

      const emptyMonth = this.localdata.findIndex(el => {
        return value.findIndex(el_ => {
          return el_.month === el.month && el_.year === el.year;
        }) === -1;
      });

      if (emptyMonth > -1) {
        this.localdata.splice(emptyMonth, 1);
      }

      this.localdata.forEach((el, i) => {

         index = index + el.deadlines.length;

         if (index < this.number) {
          monthIndex++;
         }

      });

      const toDelete = this.localdata.length - (monthIndex + 1);

      if (toDelete > 0) {
        this.localdata.splice(monthIndex + 1, toDelete);
      }

      const lastMonth = this.localdata[monthIndex + 1];

      if (lastMonth) {
        const toErase = this.number - lastMonth.deadlines.length;
        if (toErase) {
          lastMonth.deadlines.splice(toErase);
        }
      }

    }

  }

  private compareDeadlines(first: DeadlineUnit, second: DeadlineUnit) {

    return  (first.period.id === second.period.id) &&
    first.period.period === second.period.period &&
    first.period.year === second.period.year &&
    first.period.rate === second.period.rate;

  }

  onlyAddNewItem() {

  }

  printMonth(id: number) {

    const allmonths_ = this._txt.txt.getGroup('monthNames');
    return allmonths_.length > 0 ? allmonths_.find(el => el.id === id.toString()).txt : '';
  }


  isOddListItem(m: number, l: number) {

    const itemsBefore = this.localdata.reduce((acc, val, i) => {
      return (i < m) ? (val.deadlines.length + acc) : acc;
    }, 0);

    const items = itemsBefore + (l + 1);

    return  (items % 2 !== 0) ? true : false;
  }

  newYear(index: number) {

    const cur = this.localdata[index].year;

    if (index > 0) {

      const prev = this.localdata[index - 1].year;
      return prev !== cur ? cur : '';

    } else {
      return cur;
    }

  }

}

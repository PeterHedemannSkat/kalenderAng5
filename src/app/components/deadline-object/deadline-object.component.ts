import { Component, OnInit, Input } from '@angular/core';
import { DeadlineRequest } from '../../getDeadlinesFromDates/deadlineUnit';
import { TxtSharedService } from '../../TxtSharedService/txtSharedService';

@Component({
  selector: 'app-deadline-object',
  templateUrl: './deadline-object.component.html'
})
export class DeadlineObjectComponent implements OnInit {

  @Input()
  deadlines: DeadlineRequest;

  constructor(
      public _txt: TxtSharedService

  ) {}

  ngOnInit() {
  }

}

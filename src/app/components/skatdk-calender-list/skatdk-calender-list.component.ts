import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DeadlineRequest } from '../../getDeadlinesFromDates/deadlineUnit';

@Component({
  selector: 'app-skatdk-calender-list',
  templateUrl: './skatdk-calender-list.component.html',
  styleUrls: ['./skatdk-calender-list.component.css']
})
export class SkatdkCalenderListComponent implements OnInit {

  @Input()
  data: DeadlineRequest;

  constructor() { }

  ngOnInit() {
 
  }

}

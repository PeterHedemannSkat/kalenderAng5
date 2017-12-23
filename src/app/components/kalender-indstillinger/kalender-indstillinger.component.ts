import { Component, OnInit } from '@angular/core';
import { StateFristTyperService } from '../../stateTyperFrister/statetypeFrister';
import { TxtSharedService } from '../../TxtSharedService/txtSharedService';
import { textMapper } from '../../dataMapping/textMapper';

@Component({
  selector: 'app-kalender-indstillinger',
  templateUrl: './kalender-indstillinger.component.html',
  styles: []
})
export class KalenderIndstillingerComponent implements OnInit {

  _textMapper = textMapper;
  frister: string[];

  constructor(
    public _txtService: TxtSharedService,
    public _settingService: StateFristTyperService
  ) {}

  ngOnInit() {
    this.frister = this._settingService.userSettings.fristerShown;
  }



  printAllTypes() {

    return this._settingService
      .getallTypesMinusThese(['accontoSkat'])
      .map(el => this._txtService.txt.get(el));
  }

  setChecked(id: string) {
    return this._settingService.userSettings.fristerShown.findIndex(el => el === id) > -1;
  }



}

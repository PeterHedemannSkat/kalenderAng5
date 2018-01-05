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

  structure: any[];

  constructor(
    public _txtService: TxtSharedService,
    public _settingService: StateFristTyperService
  ) {}

  ngOnInit() {
    this.frister = this._settingService.userSettings.fristerShown;
    this.structure = this.sortList();
  }



  printAllTypes() {

    return this._settingService
      .getallTypesMinusThese(['accontoSkat'])
      .map(el => this._txtService.txt.get(el))
      .filter(el => el !== 'moms_halvaar');
  }

  setChecked(id: string) {
    return this._settingService.userSettings.fristerShown.findIndex(el => el === id) > -1;
  }

  sortList() {

    const group = [];

    let
      counter = 0,
      index = 0;

    this._textMapper
      .filter(el =>
        el.id !== 'accontoSkat'
      )
      .forEach((el) => {

      const
        len = el.types.length;

      const currentReference = group[index];

      counter += len;

      if (currentReference === undefined) {
        group[index] = [];
      }

      if (counter > 6) {

        counter = len;
        index++;
        const a = group[index] = [];
        a.push(el);

      } else {

        /* hack */
        if (el.id === 'moms') {
          el = {
            types: ['moms_maaned', 'moms_kvartal'],
            id: 'moms'
          };
        }

        group[index].push(el);

      }

    });



    return group;

  }


}

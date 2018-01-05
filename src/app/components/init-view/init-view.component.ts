import { Component, OnInit } from '@angular/core';
import { StateFristTyperService } from '../../stateTyperFrister/statetypeFrister';
import { LocalStorageService } from 'angular-web-storage/core/service';
import { TxtSharedService } from '../../TxtSharedService/txtSharedService';
import { setTimeout } from 'timers';
import { textMapper } from '../../dataMapping/textMapper';

@Component({
  selector: 'app-init-view',
  templateUrl: './init-view.component.html',
  styles: []
})
export class InitViewComponent implements OnInit {

  _date: Date;
  _momsreg: boolean;


  initial = ['selvangivelse', 'bSkatteRater', 'moms_kvartal'];

  allVal = textMapper;
  showalltypes  = false;


  get date() {
    return this._date;
  }

  set date(date: Date) {

    if (date) {
      this._date = date;
      this._state.userSettings.firmStartDate = date.getTime();
      this._localService.set(this._state.nameLocalStorage, this._state.userSettings);
    }

  }

  get momsregistreret() {

    return this._momsreg;
  }

  set momsregistreret(value: boolean) {
    this._momsreg = value;
    /*
    if (value === true);
    this._state.userSettings.fristerShown

    */
  }

  startLabels(pligt: string) {
    return this._txt.txt.get(`${pligt}_intro`);
  }


  constructor(
    public _state: StateFristTyperService,
    public _localService: LocalStorageService,
    public _txt: TxtSharedService
  ) { }

  ngOnInit() {
    this._state.userSettings.fristerShown = ['selvangivelse', 'bSkatteRater'];
  }

  getFristtypes() {
    return (this.showalltypes) ? this.allTypes() : this.initial;
  }

  allTypes() {
    return this.allVal.reduce((state, cur) => {
      if (cur.id !== 'accontoSkat') {
        return state.concat(cur.types);
      } else {
        return state;
      }
    }, []).filter(el => el !== 'moms_halvaar');
  }

  toggleVis() {
    const type = (!this.showalltypes) ? 'visAlle' : 'skjul';
    return this._txt.txt.get(type);

  }

  getHeader(id: string) {
    return this.allVal.find(el => el.types.indexOf(id) > -1).id;
  }

  update() {
    this._state.userSettings.isUntouched = false;
    this._localService.set(this._state.nameLocalStorage, this._state.userSettings);
    this._state.godtFraStartObs = this._state.monthDivisorStructure();
  }


  setChecked(id: string) {
    return this._state.userSettings.fristerShown.findIndex(el => el === id) > -1;
  }

  getArrow() {

    const
      collapsedUrl = 'style/images/collapsed.svg',
      expandedUrl = 'style/images/expanded.svg';

    return this.showalltypes ? expandedUrl : collapsedUrl;

  }



}

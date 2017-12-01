import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Texts } from '../textServices/testServices';
import { urlMapper } from '../dataMapping/urlMapping';
import { GetText } from '../textServices/getTxt';




@Injectable()
export class TxtSharedService implements OnInit {

    txt: GetText = new GetText();

    constructor (
       public _lang: Texts
    ) {
        this.ngOnInit();
    }

    ngOnInit() {

        const neededTxt = [
            'namesMainTypes',
            'normalNames',
            'monthNames',
            'periodTerms',
            'subTitles',
            'weekdays',
            'laeringsPakke'
          ];

          this._lang.setRessources(urlMapper);
          this._lang.getMultipleTxt(neededTxt).subscribe(el => {
            this.txt.add(el);
          });

    }



}

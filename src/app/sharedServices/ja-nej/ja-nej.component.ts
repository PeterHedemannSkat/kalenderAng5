import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as _ from 'lodash';
import { JaNejTxtLanguage } from './janejTxtLanguage';

interface RadiobuttonUX {
    value: string;
    text: string;
}

@Component({
  selector: 'app-ja-nej',
  templateUrl: './ja-nej.component.html',
  styleUrls: ['./ja-nej.component.css']
})
export class JaNejComponent implements OnInit {

    toggleHelpTxt = true;

    name: string;
    state: boolean;

    @Input()
    helpTxt: string;

    @Output()
    changed: EventEmitter<any> = new EventEmitter();

    @Input()
    options: RadiobuttonUX [];

    @Input()
    default: string;

    @Input()
    label: string;

    @Input()
    txtJaNej: JaNejTxtLanguage;

    @Input() value: boolean;

    @Output()
    valueChange: EventEmitter<boolean> = new EventEmitter();

    @Output()
    change: EventEmitter<any> = new EventEmitter();

    getTxt() {
        return this.txtJaNej || new JaNejTxtLanguage('ja', 'nej');
    }

    showHelper () {
        return (this.helpTxt && this.helpTxt.length > 2);
    }

    ngOnInit() {

        this.name = `_name_${_.random(1, 9999999999999)}`;
    }


  constructor() { }



}

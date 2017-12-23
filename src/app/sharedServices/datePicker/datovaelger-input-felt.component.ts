import { Component, Input, AfterViewInit, EventEmitter, Output, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { element } from 'protractor';
declare var $: any;
declare var datePicker: any;
declare var datePickerController: any;

@Component({
    selector: 'app-skat-datovaelger-input-felt',
    templateUrl: 'datovaelger-input-felt.component.html'
})

export class DatovaelgerInputFeltComponent implements AfterViewInit, OnInit, AfterContentChecked, OnDestroy   {

    aarstal: string;
    periode: string;
    feltNavn: string;

    datePickerIsInit = false;
    datePickerStart: string;
    datePickerSlut: string;

    dato: Date;
    _modelStr: string;
    get modelStr() {
        return this._modelStr;
    }

    set modelStr(value: string) {
        this._modelStr = value;
        this.model = datePickerController.getSelectedDate(this.feltNavn);

    }

    @Output() modelChange = new EventEmitter();
    @Input() feltId: string;
    @Input() index: number;
    @Input() disabled: boolean;
    @Input() label: string;
    @Input() cursorStart: string;
    @Input() paakraevet: boolean;
    @Input() ingenStartdato: boolean;

    @Input()
    get model() {
        return this.dato;
    }

    set model(input: Date) {
        this.dato = input;

        this.modelChange.emit(input);

    }

    constructor() {
    }


    ngOnInit() {

        this.feltNavn = this.index != null ? this.feltId + '_' + this.index : this.feltId;
    }

    ngAfterContentChecked () {
        const elements = $('#' + this.feltNavn);

        const element = elements ? elements[0] : null;

        if (element && element.value && element.value !== this.model) {
            // Hack: Vent et tick for at undgå devMode fejlen:
            // Expression has changed after it was checked.

            setTimeout((_: any) => this.modelStr = element.value);
        }

    }

    ngAfterViewInit() {

        const element = $('#' + this.feltNavn);

        const obj: any = {};
        obj.formElements = {};

        obj.formElements[this.feltNavn] = '%d/%m/%Y';
        obj.callbackFunctions = {
            dateset: [() => {
                this.modelStr = element.val();
            }]
        };

        datePickerController.createDatePicker(obj);



    }

    ngOnDestroy() {
        datePickerController.destroyDatePicker(this.feltNavn);
    }
}

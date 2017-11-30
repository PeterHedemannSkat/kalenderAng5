import { Observable } from 'rxjs/Observable';
export interface TxtDap {
    id: string;
    da: string;
    en: string;
}

export interface DapJson {
    id: string;
    children: TxtDap[];
}

export interface Container {
    id: string;
    txtObs: Observable<TxtKey[]>;
}

export class TxtKey {
    constructor (
        public id: string,
        public txt: string,
        public groupId?: string
    ) {

    }

}



import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { TxtDap, TxtKey, Container, DapJson } from './textInterface';
import { UrlRessources } from '../dataMapping/interfacesMapping';
import { UrlRessourceService } from '../urlRessource/urlressource';

@Injectable()
export class Texts {
    namesMainTypes: Observable<TxtKey>;

    TxtContainer: Container[];

    constructor (
        public _http: Http,
        public _skatdk: UrlRessourceService
    ) {}

    setRessources(ressources: UrlRessources[]) {

        this.TxtContainer = ressources.map(el => {

            const skatdkurl = this._skatdk.getDapOidOfId(el.local);

            const ressource = (environment.production) ? `${skatdkurl}` : `app/${el.local}`;
            const obs = this._http.get(ressource)
                .map(el_ => el_.json())
                .map(el_ => {
                    // const a = environment.production ? el_[0].children : el_;
                    return el_ as TxtDap[];
                })
                .share()
                .map(el_ => {
                    return el_.map(el__ => new TxtKey(el__.id, el__[this.getLanguage()], el.local));
                });

            return {id: el.local, txtObs: obs};

        });

    }

    getTxtObs(id: string) {
        return this.TxtContainer.find(el => el.id === id);
    }

    getMultipleTxt(ids: string[]) {

        const allTxtObservable = this.TxtContainer
            .filter(el => ids.indexOf(el.id) > -1)
            .map(el => el.txtObs);

        return Observable.merge(...allTxtObservable)
            .flatMap(el => el)
            .toArray();

    }


    getLanguage() {
        return 'da';
    }


}

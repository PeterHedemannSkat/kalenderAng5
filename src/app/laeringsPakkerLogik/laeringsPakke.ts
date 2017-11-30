import { Injectable } from '@angular/core';
import { laeringspakker } from '../dataMapping/laeringspakker';
import { textMapper } from '../dataMapping/textMapper';
import { Http, Response } from '@angular/http';
import { UrlRessources } from '../dataMapping/interfacesMapping';
import { urlMapper } from '../dataMapping/urlMapping';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { TxtDap } from '../textServices/textInterface';
import { learingsPakkeUrls } from '../dataMapping/laeringsPakkeUrls';
import { UrlRessourceService } from '../urlRessource/urlressource';

interface SimpleBoolean {
    id: string;
    val: boolean;
}

@Injectable()
export class LaeringsPakkeService {

    constructor(
        public http: Http,
        public _skatdk: UrlRessourceService) {

        const
            id = 'activeLaeringsPakker',
            skatdkurl = this._skatdk.getDapOidOfId(id),
            url = (environment.production) ? `${skatdkurl}` : `app/${id}`;

        this.ressource = url;

        this.setshowLaeringsPakke().subscribe(el => {
            this.laeringspakker = el;
        });

    }

    ressource: string;

    laeringspakker: SimpleBoolean[] = [];


    private getLaeringsPakkerOfId(id: string): string[] {

        const
            groupId = textMapper.find(el => el.types.indexOf(id) > -1).id;

        const pakker = laeringspakker.reduce((acc, val) => {

            const
                groupIdMatch = val.groups.indexOf(groupId) > -1,
                idMatch = val.ids.indexOf(id) > -1;

            return (groupIdMatch || idMatch) ? acc.concat(val.laeringsPakkeIds) : acc;

        }, []);

        return pakker;

    }

    setshowLaeringsPakke() {
        return this.http.get(`${this.ressource}`).share()
            .map(el => el.json())
            .map(el_ => {
                // const a = environment.production ? el_[0].children : el_;
                return el_ as TxtDap[];
            })
            .map(el => {
                return el.map(el_ => {
                    return {val: el_.da === '+' ? true : false, id: el_.id};
                } );
            });
    }

    getLaeringsPakker(id: string) {

        const laeringsPakker = this.getLaeringsPakkerOfId(id)
            .filter(el => {

                const pakke_ = this.laeringspakker.find(el_ => el_.id === el);
                return pakke_ ? pakke_.val : false;

            });

        return laeringsPakker;
    }

    getUrlOfLaeringsPakke(id: string) {

        const
            dapOid_ = learingsPakkeUrls.find(el => el.id === id),
            dapOid = dapOid_ ? dapOid_.skatdkOid : '';
        return `/skat.aspx?oid=${dapOid}`;

    }
}

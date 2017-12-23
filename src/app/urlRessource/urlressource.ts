import { Injectable } from '@angular/core';
import { urlMapper } from '../dataMapping/urlMapping';
import { iconNames } from '../dataMapping/iconOfMainDeadLines';
import { iconMapping } from '../dataMapping/iconUrlMap';
import { environment } from '../../environments/environment';
import { learingsPakkeUrls } from '../dataMapping/laeringsPakkeUrls';

@Injectable()
export class UrlRessourceService {

    relativeMainUrl = 'websrv/jsong.ashx?Id=';
    skatdkOfIcons = 'style/images/marketing/godt-fra-start/';
    includeClear = '&clear=1';
    pathLocal = 'assets/';
    linksPath = 'skat.aspx?oid=';
    absoluteSkatdkUrl = '//skat.dk';

    getDapOidOfId(id: string) {

        const oId = urlMapper.find(el => el.local === id).skatdk;
        return `${this.relativeMainUrl}${oId}${this.includeClear}`;

    }

    getUrlForRegularSkatDkLink(id: string) {
        const
        url_ = learingsPakkeUrls.find(el => el.id === id),
        oid = url_ ? url_.skatdkOid : '';

    return (environment.production) ? `${this.linksPath}${oid}` : `${this.absoluteSkatdkUrl}/${this.linksPath}${oid}`;
    }

    getGodtFraStartIconUrlsOfFrist(id: string) {

        const
            icon_ = iconNames.find(el => el.id === id),
            svgName = icon_ ? icon_.name : '';

        return (environment.production) ? `${this.skatdkOfIcons}${svgName}--black.svg` : `${this.pathLocal}${svgName}--black.svg`;

    }

    getGodtFraStartIconUrlOfLeaeringsPakke(id: string) {

        const
            icon_ = iconMapping.find(el => el.id === id),
            svgName = icon_ ? icon_.srcName : '';

       return (environment.production) ? `${this.skatdkOfIcons}${svgName}--white.svg` : `${this.pathLocal}${svgName}--white.svg`;

    }

}

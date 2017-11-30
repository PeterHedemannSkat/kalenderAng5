// tslint:disable-next-line:quotemark
import { TxtKey } from './textInterface';

export class GetText {

    public txtrep: TxtKey[] = [];

    constructor () {}

    add(content: TxtKey[]) {
        this.txtrep = this.txtrep.concat(content);
    }

    get(id: string, group?: string) {

        if (this.txtrep.length > 0) {

            if (group) {

                const txt_ = this.txtrep
                    .filter(el => el.groupId === group)
                    .find(el => el.id === id);

                return (txt_) ? txt_.txt : '';



            } else {

                const txt_ = this.txtrep.find(el => el.id === id);
                return txt_ ? txt_.txt : '';

            }
        }
    }

    getGroup(groupId: string) {
        return this.txtrep.filter(el => el.groupId === groupId);
    }
}

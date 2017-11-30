class DynamicDateSearch {
    constructor (
        public heading: string,
        public onWeekends: boolean,
        public onHolidays: boolean,
        public special?: string

    ) {}
}

class BaseDate {
    constructor (
        public monthsDif: number,
        public dayInMonth: number
    ) {}
}

class DeadLineRule {
    constructor (
        public id: string[],
        public baseDate: BaseDate,
        public searchParameters: DynamicDateSearch
    ) {}
}

interface RateBaseType {

    isDayStatic: boolean;
    dayDynamic?: number[];
    dayStatic?: number;

}

interface Period {

    id: string;
    year: number;
    period: number;
    rate?: number;

}


class RateBase {
    constructor (
        public rateType: RateBaseType,
        public monthsAfterBase: number[]
    ) {}
}

class RateDeadLineRule {
    constructor (
        public id: string[],
        public baseDate: RateBase,
        public searchParameters: DynamicDateSearch
    ) {}
}

export {
    DynamicDateSearch,
    BaseDate,
    DeadLineRule,
    RateDeadLineRule,
    RateBase,
    Period
};

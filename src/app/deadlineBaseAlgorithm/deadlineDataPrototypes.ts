import { DeadLineRule, BaseDate, DynamicDateSearch, RateDeadLineRule, RateBase } from './interfaceFristDNA';

/**
 * baseForwardDynamicSearch: for det meste gælder det at datoen går fra skilledatoen og frem
 * og kan ikke være forekommende i en weekend eller på en helligdag
 */
const baseForwardDynamicSearch = new DynamicDateSearch('>', true, true);

/**
 * Her ligger de alm. regler for frister. 1. par BaseDate er antal måneder efter måned 0
 * efter periodens udløb. 2. par er dagen i måneden.
 */

const masterRules: DeadLineRule[] = [
    new DeadLineRule(
        ['selvangivelse'],
        new BaseDate(6, 1),
        baseForwardDynamicSearch
    ),
    new DeadLineRule(
        ['moms_halvaar', 'moms_kvartal'],
        new BaseDate(2, 1),
        baseForwardDynamicSearch
    ),
    new DeadLineRule(
        ['moms_maaned', 'EU_salg', 'EU_Salg_kvartal'],
        new BaseDate(0, 25),
        baseForwardDynamicSearch
    ),
    new DeadLineRule(
        ['loonsum_metode1', 'loonsum_metode2', 'loonsum_metode3',
        'loonsum_metode4A', 'punktafgifter'],
        new BaseDate(0, 15),
        baseForwardDynamicSearch
    ),
    new DeadLineRule(
        ['oneStopMoms'],
        new BaseDate(0, 20),
        new DynamicDateSearch('>', false, false)
    ),
    new DeadLineRule(
        ['aSkatStoreVirksomheder'],
        new BaseDate(-1, -1),
        new DynamicDateSearch('<', false, false, 'LastDayOfMonth')
    ),
    new DeadLineRule(
        ['aSkatSmaaVirksomheder'],
        new BaseDate(0, 10),
        baseForwardDynamicSearch
    ),
    new DeadLineRule(
        ['loonsum_metode4B'],
        new BaseDate(0, 10),
        baseForwardDynamicSearch
    ),
    new DeadLineRule(
        ['momsRefusion'],
        new BaseDate(8, 30),
        new DynamicDateSearch('>', false, false)
    )

];


const RateMaster: RateDeadLineRule[] = [

    new RateDeadLineRule(
        ['bSkatteRater'],
        new RateBase(
            {
                isDayStatic: true,
                dayStatic: 20
            },
            [0, 1, 2, 3, 4, 6, 7, 8, 9, 10],
        ),
        baseForwardDynamicSearch
    ),
    new RateDeadLineRule(
        ['accontoSkat'],
        new RateBase(
            {
                isDayStatic: false,
                dayDynamic: [20, 20, 1]
            },
            [2, 10, 13],
        ),
        baseForwardDynamicSearch
    )

];

const ruleException = [
    {
        period: 6,
        id: 'moms_maaned',
        overwrite: new DeadLineRule(
            ['moms_halvaar', 'moms_kvartal'],
            new BaseDate(2, 17),
            baseForwardDynamicSearch
        )
    },
    {
        period: 12,
        id: 'AskatSmaaVirksomheder',
        overwrite: new DeadLineRule(
            ['aSkatSmaaVirksomheder'],
            new BaseDate(0, 17),
            baseForwardDynamicSearch
        )
    }
];




export {RateMaster, masterRules, ruleException};




export const periodsMap = [
    { /* Månedlig frist */
        periods: 12,
        deadLineIDs: ['moms_maaned', 'EU_salg', 'aSkatStoreVirksomheder', 'aSkatSmaaVirksomheder', 'punktafgifter', 'loonsum_metode2']
    },
    { /* Kvartals frist */
        periods: 4,
        deadLineIDs:
        ['moms_kvartal', 'oneStopMoms', 'EU_Salg_kvartal', 'loonsum_metode1',
        'loonsum_metode3', 'loonsum_metode4A']
    },
    { /* Årlig frist */
        periods: 2,
        deadLineIDs: ['moms_halvaar']
    },
    { /* Årlig frist */
        periods: 1,
        deadLineIDs: ['loonsum_metode4B', 'selvangivelse', 'momsRefusion', 'bSkatteRater', 'accontoSkat']
    }
];

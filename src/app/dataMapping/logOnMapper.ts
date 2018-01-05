const urlTSE = 'https://pdcs.skat.dk/dcs-atn-gateway/login/tsklogin';

export const LogOnMapper = [
    {
        id: 'loonsum',
        button: true,
        url: urlTSE,
        openBeforeDeadline: -1
    },
    {
        id: 'askat',
        button: true,
        url: urlTSE,
        openBeforeDeadline: -1
    },
    {
        id: 'moms',
        button: true,
        url: urlTSE,
        openBeforeDeadline: -1
    },
    {
        id: 'EU_salg',
        button: true,
        url: urlTSE,
        openBeforeDeadline: -1
    },
    {
        id: 'momsRefusion',
        button: true,
        url: urlTSE,
        openBeforeDeadline: -1
    },
    {
        id: 'bSkatteRater',
        button: false,
        url: urlTSE,
        openBeforeDeadline: -1
    },
    {
        id: 'accontoSkat',
        button: false,
        url: urlTSE,
        openBeforeDeadline: null
    },
    {
        id: 'oneStopMoms',
        button: true,
        url: urlTSE,
        openBeforeDeadline: -1
    },
    {
        id: 'selvangivelse',
        button: true,
        url: 'https://www.tastselv.skat.dk/',
        openBeforeDeadline: 115
    },
    {
        id: 'punktafgifter',
        button: true,
        url: urlTSE,
        openBeforeDeadline: -1
    }
];

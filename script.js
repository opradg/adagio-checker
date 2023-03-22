/************************************************************************************************************************************************************
    MAIN
************************************************************************************************************************************************************/

console.clear();

let prebidObject = undefined;
let adagioAdapter = undefined;

checkPrebidVersion();
checkAdagioModule();
checkAdagioLocalStorage();
checkSupplyChainObject();
checkAdagioAdUnitParams();
checkAdagioConsent();

/************************************************************************************************************************************************************
    FUNCTIONS
************************************************************************************************************************************************************/

function checkPrebidVersion() {

    // Is Prebid.js detected, gives version
    let pbjsGlobals = window._pbjsGlobals;  

    if (pbjsGlobals === undefined) {
        console.log('❌ Prebid => window._pbjsGlobals: ' + pbjsGlobals);
        return;
    }

    // Sometimes, websites deal with multiple Prebids. If has pbjs, use it in priority
    if (pbjsGlobals.includes('pbjs')) {
        prebidObject = window['pbjs'];
        console.log('✅ pbjs ('+ prebidObject.version + ')');
    }
    else {
        prebidObject = window[pbjsGlobals[0]];
        console.log('✅ ' + pbjsGlobals[0] + ' ('+ prebidObject.version + ')');
    }
}

function checkAdagioModule() {

    // Is Adagio bidder adapter detected, gives version
    adagioAdapter = window.ADAGIO;
    if (adagioAdapter === undefined) console.log('❌ Adagio module => window.ADAGIO: ' + window.ADAGIO);
    else {
        console.log('✅ Adagio module');
        console.log(adagioAdapter.versions);
    }
}

function checkAdagioLocalStorage() {

    if (prebidObject === undefined) {
        console.log('❌ Localstorage => no pbjs found');
        return;
    }

    // Is global locastorage enabled
    let deviceAccess = prebidObject.getConfig('deviceAccess');
    let localStorage = prebidObject.bidderSettings;

    if (localStorage.standard?.storageAllowed === true) console.log('✅ Localstorage => bidderSettings.standard set to true');
    else if (localStorage.adagio?.storageAllowed === true) console.log('✅ Localstorage => bidderSettings.adagio set to true');
    else if (localStorage.adagio?.storageAllowed === false) console.log('❌ Localstorage => bidderSettings.adagio set to false');
    else if (prebidObject.getConfig('deviceAccess') === true) console.log('❓ Localstorage => check network for localstorage (deviceAccess set to true)');
    else if (parseInt(prebidObject.version.charAt(1) < 7)) console.log('❓ Localstorage: Prebid version lower than 7');
    else console.log('❌ Localstorage not found: if detected in network, contact dev!');
}

function checkSupplyChainObject() {

    if (prebidObject === undefined) {
        console.log('❌ Supply chain object => no pbjs found');
        return;
    }
    
    // Find the first Adagio bidRequested event with an SCO
    const adagioBid = prebidObject.getEvents()
    .filter(e => e.eventType === 'bidRequested' && e.args.bidderCode.toLowerCase().includes('adagio'))
    .map(e => e.args.bids)
    .flat()
    .find(r => r.schain)

    if (adagioBid !== undefined) {
        console.log('✅ Supply chain object');
        console.log(adagioBid.schain);
    }
    else console.log('❓ Supply chain object not found => if website owned and managed, no SCO');
}  

function checkAdagioConsent() {

    if (typeof window.__tcfapi !== 'function') {
        console.log('❌ Consent Management Platform: __tcfapi function is not is not defined');
        return;
    }

    // Gives the Consent Management strings values
    window.__tcfapi('getTCData', 2, (tcdata, success) => {
        const cmpAdagioBidders = new Map();
        cmpAdagioBidders.set(617 ,  'Adagio');
        cmpAdagioBidders.set(58 ,   '33Across');
        cmpAdagioBidders.set(285,   'Freewheel');
        cmpAdagioBidders.set(253 ,  'Improve Digital');
        cmpAdagioBidders.set(10 ,   'Index Exchange');
        cmpAdagioBidders.set(241 ,  'OneTag');
        cmpAdagioBidders.set(76 ,   'Pubmatic');
        cmpAdagioBidders.set(52 ,   'Rubicon');
        cmpAdagioBidders.set(13 ,   'Sovrn');
        cmpAdagioBidders.set(25 ,   'Yahoo');

        let inConsents, inLegitimates, stringResult = '', allConsentsTrue = true;

        for (let [key, value] of cmpAdagioBidders) {
            if (tcdata.vendor.consents[key]) inConsents = '✅';
            else { 
                inConsents = '❌';
                allConsentsTrue = false;
            }
            if (tcdata.vendor.legitimateInterests[key]) inLegitimates = '✅';
            else inLegitimates = '❌';
            stringResult += '   ' + value + ' (' + key + ')' + ' => Consents: ' + inConsents + ' / Legitimates: ' + inLegitimates + '\n';
        };

        if (allConsentsTrue) console.log('✅ Consent Management Platform');
        else console.log('❌ Consent Management Platform');
        console.log(stringResult);
    });
}

function checkAdagioAdUnitParams() {

    if (adagioAdapter === undefined) {
        console.log('❌ Adagio adUnits => no Adagio bidder adapter found');
        return;
    }

    // Find the params for Adagio adUnits
    const adagioAdUnits = adagioAdapter.pbjsAdUnits
    .map(e => e.bids)
    .flat();

    if (adagioAdUnits !== undefined) {
        console.log('✅ Adagio adUnits => ' + adagioAdUnits.length);
        adagioAdUnits.forEach(adUnit => {
            console.log(adUnit.params);
        });
    }
    else console.log('❌ No Adagio adUnit found.');
}  

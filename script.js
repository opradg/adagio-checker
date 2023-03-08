/************************************************************************************************************************************************************
    MAIN
************************************************************************************************************************************************************/

let prebidObject = undefined;
let isHubjs = false;

checkPrebidVersion();

if (prebidObject != undefined) {

    checkAdagioModule();
    checkAdagioLocalStorage();
    checkAdagioConsent();
    checkAdagioAdUnitParams();

}

/************************************************************************************************************************************************************
    FUNCTIONS
************************************************************************************************************************************************************/

function checkPrebidVersion() {

    // Is Prebid.js detected, gives version
    if (window.pbjs != undefined) {
        prebidObject = window.pbjs;
        console.log('✅ Prebid.js ('+ prebidObject.version + ')');
    } 
    else if (window.hubjs != undefined) {
        prebidObject = window.hubjs;
        isHubjs = true;
        console.log('✅ Hub.js ('+ prebidObject.version + ')');
    } 
    else {
        console.log('❌ Prebid.js or Hub.js not detected! window._pbjsGlobals: ' + window._pbjsGlobals);
    }
}

function checkAdagioModule() {

    // Is Adagio bidder adapter detected, gives version
    if (isHubjs) console.log("❓ Adagio adapter (Hubjs)");
    else {
        let adagioBidder = prebidObject.installedModules.includes("adagioBidAdapter");
        if (adagioBidder === false) console.log("❌ Adagio module");
        else console.log("✅ Adagio module");
    }
}

function checkAdagioLocalStorage() {

    // Is Adagio localstorage enabled
    let localstorage = prebidObject.bidderSettings; //.adagio.storageAllowed;
    if (localstorage.adagio === undefined) console.log("❌ Localstorage");
    else if (localstorage.adagio.storageAllowed === false) console.log("❌ Localstorage => storageAllowed: false");
    else console.log("✅ Localstorage");
}

function checkAdagioConsent() {

    // Gives the Consent Management strings values
    window.__tcfapi('getTCData', 2, (tcdata, success) => {

        const cmpAdagioBidders = new Map();
        cmpAdagioBidders.set(617 ,  "Adagio");
        cmpAdagioBidders.set(58 ,   "33Across");
        cmpAdagioBidders.set(285,   "Freewheel");
        cmpAdagioBidders.set(253 ,  "Improve Digital");
        cmpAdagioBidders.set(10 ,   "Index Exchange");
        cmpAdagioBidders.set(241 ,  "OneTag");
        cmpAdagioBidders.set(76 ,   "Pubmatic");
        cmpAdagioBidders.set(52 ,   "Rubicon");
        cmpAdagioBidders.set(13 ,   "Sovrn");
        cmpAdagioBidders.set(25 ,   "Yahoo");

        var inConsents, inLegitimates, stringResult = "", allConsentsTrue = true;

        for (let [key, value] of cmpAdagioBidders) {
            if (tcdata.vendor.consents[key]) inConsents = "✅";
            else { 
                inConsents = "❌";
                allConsentsTrue = false;
            }
            if (tcdata.vendor.legitimateInterests[key]) inLegitimates = "✅";
            else inLegitimates = "❌";
            stringResult += "   " + value + " (" + key + ")" + ' => Consents: ' + inConsents + ' / Legitimates: ' + inLegitimates + '\n';
        };

        if (allConsentsTrue) console.log("✅ Consent Management Platform");
        else console.log("❌ Consent Management Platform");
        console.log(stringResult);
    });
}

function checkAdagioAdUnitParams() {
    
    const adagioAdUnits = new Map();

    // Are Adagio adUnit params detected and corrects
    prebidObject.getEvents().forEach(event => {
        if (event.eventType === "beforeRequestBids") {
            event.args.forEach(arg => {
                arg.bids.forEach(bid => {
                    if (bid.bidder.toLowerCase().includes("adagio")) {
                        adagioAdUnits.set(arg, bid);
                    }
                });
            });
        }
    });

    // Display the Adagio params
    if (adagioAdUnits.size > 0) {
        console.log("✅ Adagio adUnits => " + adagioAdUnits.size);
        for (let [key, value] of adagioAdUnits) {
            console.log(key.code + " (" + JSON.stringify(key.mediaTypes) + ")");
            console.log(value.params);
        }
    }
    else {
        console.log("❌ No Adagio adUnit found.");
    }
}
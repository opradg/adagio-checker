/************************************************************************************************************************************************************
    MAIN
************************************************************************************************************************************************************/

let prebidObject = undefined;

checkPrebidVersion();

if (prebidObject !== undefined) {
    checkAdagioModule();
    checkAdagioLocalStorage();
    checkAdagioAdUnitParams();
}

checkAdagioConsent();

/************************************************************************************************************************************************************
    FUNCTIONS
************************************************************************************************************************************************************/

function checkPrebidVersion() {

    // Is Prebid.js detected, gives version
    let pbjsGlobals = window._pbjsGlobals;  
    if (pbjsGlobals !== undefined) {
        if (pbjsGlobals.includes('pbjs')) {
            prebidObject = window['pbjs'];
            console.log('✅ pbjs ('+ prebidObject.version + ')');
        }
        else {
            prebidObject = window[pbjsGlobals[0]];
            console.log('✅ ' + pbjsGlobals[0] + ' ('+ prebidObject.version + ')');
        }
    }
    else {
        console.log('❌ No Prebid.js => window._pbjsGlobals: ' + pbjsGlobals);
    }
}

function checkAdagioModule() {

    // Is Adagio bidder adapter detected, gives version
    let adagioBidder = prebidObject.installedModules.includes("adagioBidAdapter");
    if (adagioBidder === false) console.log("❌ Adagio module");
    else console.log("✅ Adagio module");
}

function checkAdagioLocalStorage() {

    // Is Adagio localstorage enabled
    let localstorage = prebidObject.bidderSettings;
    if (localstorage.adagio === undefined) {
        if (parseInt(prebidObject.version.charAt(1) < 7)) console.log("⚠️ Localstorage: Prebid version lower than 7");
        else console.log("❌ Localstorage => bidderSettings.adagio.storageAllowed not set");
    }
    else if (localstorage.adagio.storageAllowed === false) console.log("❌ Localstorage => bidderSettings.adagio.storageAllowed: false");
    else console.log("✅ Localstorage");
}

function checkAdagioConsent() {

    // Gives the Consent Management strings values
    if (typeof window.__tcfapi === "function") { 

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
    else console.log("❌ Consent Management Platform: __tcfapi function is not is not defined in the context");

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

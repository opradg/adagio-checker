// Creates the global pbjs and adagio variables
let prebidObject = undefined;
let adagioAdapter = undefined;
let iframe, iframeDoc;

createOverlay();

function createOverlay() {

    // create a new iframe element
    iframe = document.createElement('iframe');
    iframe.classList.add('adagio-overlay');
    iframe.style.position = "fixed";
    iframe.style.top = "20px";
    iframe.style.left = "20px";
    iframe.style.width = "600px";
    iframe.style.height = "350px";
    iframe.style.zIndex = "9999";
    iframe.style.backgroundColor = "transparent";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    // get the iframe document object
    iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.body.style.fontSize = "12px";
    buildHtml(iframeDoc);
    check();
}

function buildHtml(iframeDoc) {

    // append pico style
    const picoStyle = iframeDoc.createElement('link');
    picoStyle.setAttribute('rel', 'stylesheet');
    picoStyle.setAttribute('href', 'https://unpkg.com/@picocss/pico@1.5.7/css/pico.min.css');

    // create navigation element
    const nav = iframeDoc.createElement('nav');
    nav.classList.add('container-fluid');
    
    nav.style.zIndex = '99';
    nav.style.position = 'fixed';
    nav.style.top = '0';
    nav.style.right = '0';
    nav.style.left = '0';
    nav.style.padding = '0 var(--spacing)';
    nav.style.backgroundColor = 'var(--card-background-color)';
    nav.style.boxShadow = 'var(--card-box-shadow)';

    // create main container element
    const mainContainer = iframeDoc.createElement('main');
    mainContainer.classList.add('container-fluid');

    // create first unordered list inside navigation
    const ul1 = iframeDoc.createElement('ul');
    const li1 = iframeDoc.createElement('li');
    const strong1 = iframeDoc.createElement('strong');
    strong1.textContent = 'Adagio.io';
    li1.appendChild(strong1);
    ul1.appendChild(li1);

    // create second unordered list inside navigation
    const ul2 = iframeDoc.createElement('ul');
    const li2a = iframeDoc.createElement('li');
    const a2a = iframeDoc.createElement('a');
    a2a.href = '#';
    a2a.textContent = 'Checker';
    a2a.setAttribute('role', 'button');
    li2a.appendChild(a2a);
    const li2b = iframeDoc.createElement('li');
    const a2b = iframeDoc.createElement('a');
    a2b.href = '#';
    a2b.textContent = 'AdUnits';
    a2b.setAttribute('role', 'button');
    a2b.classList.add('outline');
    li2b.appendChild(a2b);
    const li2c = iframeDoc.createElement('li');
    const a2c = iframeDoc.createElement('a');
    a2c.href = '#';
    a2c.textContent = 'Consents';
    a2c.setAttribute('role', 'button');
    a2c.classList.add('outline');
    li2c.appendChild(a2c);
    ul2.appendChild(li2a);
    ul2.appendChild(li2b);
    ul2.appendChild(li2c);

    // append unordered lists to navigation
    nav.appendChild(ul1);
    nav.appendChild(ul2);

    // create headings container
    const headings = iframeDoc.createElement('div');
    headings.classList.add('headings');

    const br1 = iframeDoc.createElement('br');
    const br2 = iframeDoc.createElement('br');
    const h2 = iframeDoc.createElement('h2');
    h2.textContent = 'Integration checker';
    const h3 = iframeDoc.createElement('h3');
    h3.textContent = 'Expectations for a proper Adagio integration';
    headings.appendChild(br1);
    headings.appendChild(br2);
    headings.appendChild(h2);
    headings.appendChild(h3);

    // create table element
    const table = iframeDoc.createElement('table');
    const thead = iframeDoc.createElement('thead');
    const tr = iframeDoc.createElement('tr');
    const th1 = iframeDoc.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.textContent = 'Status';
    const th2 = iframeDoc.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.textContent = 'Name';
    const th3 = iframeDoc.createElement('th');
    th3.setAttribute('scope', 'col');
    th3.textContent = 'Details';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);
    const tbody = iframeDoc.createElement('tbody');
    tbody.setAttribute('id', 'checker-tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(table);

    // append main container to iframeDoc body
    iframeDoc.head.appendChild(picoStyle);
    iframeDoc.body.appendChild(nav);
    iframeDoc.body.appendChild(mainContainer);
}

function appendRow(status, name, details) {

    // get the tbody element
    const tableBody = iframeDoc.getElementById('checker-tbody');

    // Create the row
    const newRow = document.createElement('tr');
  
    // Create the cells
    const statusCell = document.createElement('td');
    const nameCell = document.createElement('td');
    const detailsCell = document.createElement('td');
  
    // Fill the cells
    nameCell.innerHTML = name;
    detailsCell.innerHTML = details
  
    // Style status
    switch (status) {
      case 'green':
        statusCell.innerHTML = `<kbd style="color:rgb(48 158 133);background-color:rgb(226 248 243);">OK</kbd>`;
        break;
      case 'red':
        statusCell.innerHTML = `<kbd style="color:rgb(179 49 90);background-color:rgb(253 226 235);">KO</kbd>`;
        
        break;  
      case 'yellow':
        statusCell.innerHTML = `<kbd style="color:rgb(180 130 59);background-color:rgb(253 243 228)";>!?</kbd>`;
        break;  
      default:
        "No badge found."
    }
  
    // Add the cells
    tableBody.appendChild(newRow);
    newRow.appendChild(statusCell);
    newRow.appendChild(nameCell);
    newRow.appendChild(detailsCell);
}

function jsonToHtml(json, indent = 2) {
    const keys = Object.keys(json);
    let html = '';
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = json[key];
        const valueType = typeof value;
        const isObject = valueType === 'object';
        html += '<span class="json-key">' + key + '</span>: ';
        if (isObject) {
        html += '{<br/>';
        html += jsonToHtml(value, indent + 2);
        html += '&nbsp;'.repeat(indent) + '}';
        } else if (valueType === 'string') {
        html += '<span class="json-string">"' + value + '"</span>';
        } else {
        html += '<span class="json-other">' + value + '</span>';
        }
        if (i < keys.length - 1) {
        html += ',';
        }
        html += '<br/>';
        html += '&nbsp;'.repeat(indent);
    }
    return html;
}

function check() {
    checkPrebidVersion();
    checkAdagioModule();
    checkAdagioLocalStorage();
    checkSupplyChainObject();
    checkAdagioCMP();
    checkAdagioAdUnitParams();
    checkConsentMetadata();
}

/*************************************************************************************************************************************************************************************************************************************
 * FUNCTIONS
 ************************************************************************************************************************************************************************************************************************************/

// Checks if a prebid object is found
function checkPrebidVersion() {
    // Is Prebid.js detected? If so, give version.
    const pbjsGlobals = window._pbjsGlobals;
    if (pbjsGlobals === undefined) {
      appendRow('red', 'Prebid', `<code>window._pbjsGlobals</code>: <code>${pbjsGlobals}</code>`);
      return;
    }
    // Sometimes, websites deal with multiple Prebids. If there's a pbjs global, use it in priority.
    prebidObject = window[pbjsGlobals.includes('pbjs') ? 'pbjs' : pbjsGlobals[0]];
    appendRow('green', 'Prebid', `<code>window._pbjsGlobals</code>: ${pbjsGlobals}`);
}
  
function checkAdagioModule() {
    // Is Adagio bidder adapter detected? If so, give version.
    adagioAdapter = window.ADAGIO;
    if (adagioAdapter === undefined) {
      appendRow('red', 'Adagio module', `window.ADAGIO: ${window.ADAGIO}`);
    } else {
      appendRow('green', 'Adagio module',  jsonToHtml(adagioAdapter.versions));
    }
}
  
function checkAdagioLocalStorage() {
    if (prebidObject === undefined) {
      appendRow('red', 'Localstorage', 'No pbjs found');
      return;
    }
    // Is local storage enabled?
    const deviceAccess = prebidObject.getConfig('deviceAccess');
    const localStorage = prebidObject.bidderSettings;
    if (localStorage.standard?.storageAllowed) {
      appendRow('green', 'Localstorage', 'bidderSettings.standard set to true');
    } else if (localStorage.adagio?.storageAllowed) {
      appendRow('green', 'Localstorage', 'bidderSettings.adagio set to true');
    } else if (localStorage.adagio?.storageAllowed === false) {
      appendRow('red', 'Localstorage', 'bidderSettings.adagio set to false');
    } else if (deviceAccess === true) {
      appendRow('yellow', 'Localstorage', 'Check network for local storage (deviceAccess set to true)');
    } else if (parseInt(prebidObject.version.charAt(1)) < 7) {
      appendRow('yellow', 'Localstorage', 'Prebid version lower than 7');
    } else {
      appendRow('red', 'Localstorage', 'Not found. If detected on network, contact dev!');
    }
}
  
function checkSupplyChainObject() {
    if (prebidObject === undefined) {
      appendRow('red', 'Supply chain object', 'No pbjs found');
      return;
    }
    else if (typeof prebidObject.getEvents !== 'function') {
        appendRow('red', 'Supply chain object', `${pbjsGlobals}.getEvents() not a function`);
        return;
    }
    // Find the first Adagio bidRequested event with an SCO
    const adagioBid = prebidObject.getEvents()
    .filter(e => e.eventType === 'bidRequested' && e.args.bidderCode.toLowerCase().includes('adagio'))
    .map(e => e.args.bids)
    .flat()
    .find(r => r.schain)
    if (adagioBid !== undefined) {
        appendRow('green', 'Supply chain object', adagioBid.schain);
    }
    else appendRow('yellow', 'Supply chain object', 'If website is owned and managed, no SCO');
} 
  
function checkAdagioCMP() {
    if (typeof window.__tcfapi !== 'function') {
        appendRow('red', 'Consent Management Platform', '__tcfapi function is not is not defined');
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
            stringResult += '   ' + value + ' (' + key + ')' + ' => Consents: ' + inConsents + ' / Legitimates: ' + inLegitimates + '<br>';
        };
        if (allConsentsTrue) appendRow('green', 'Consent Management Platform', stringResult);
        else appendRow('red', 'Consent Management Platform', stringResult);
    });
}
  
function checkAdagioAdUnitParams() {
  
    if (adagioAdapter === undefined) {
        appendRow('red', 'Adagio adUnits', 'No Adagio bidder adapter found');
        return;
    }
    // Find the params for Adagio adUnits
    const adagioAdUnits = adagioAdapter.pbjsAdUnits
    .map(e => e.bids)
    .flat();
    if (adagioAdUnits !== undefined) appendRow('green', 'Adagio adUnits', jsonToHtml(adagioAdUnits));
    else appendRow('red', 'Adagio adUnits', 'No Adagio adUnit found: adagioAdapter.pbjsAdUnits');
}  
  
function checkConsentMetadata() {
    if (prebidObject === undefined) {
        appendRow('red', 'Supply chain object', 'No pbjs found');
        return;
    }
    let consentMetadata = prebidObject.getConsentMetadata();
    if (consentMetadata !== undefined) appendRow('green', 'Supply chain object', jsonToHtml(consentMetadata));
    else appendRow('red', 'Supply chain object', `${pbjsGlobals}.getConsentMetada() not defined`);
    const adagioBid = prebidObject.getEvents()
    .filter(e => e.eventType === 'bidRequested' && e.args.bidderCode.toLowerCase().includes('adagio'))
    .map(e => e.args)
    .flat()
    .find(r => r.gdprConsent)
    if (adagioBid !== undefined) appendRow('green', 'GDPR consent string', jsonToHtml(adagioBid.gdprConsent));
    else appendRow('red', 'GDPR consent string', 'If consent metadata GDRP true, contact dev');
}

// Creates the global pbjs and adagio variables
let prebidObject, adagioAdapter;
let iframe, iframeDoc;
let activeTab;
let organizationId = undefined;
let siteName = undefined;

createOverlay();

function createOverlay() {

    // create a new iframe element
    iframe = document.createElement('iframe');
    iframe.classList.add('adagio-overlay');
    iframe.style.position = "fixed";
    iframe.style.top = "10px";
    iframe.style.right = "10px";
    iframe.style.width = "700px";
    iframe.style.height = "450px";
    iframe.style.zIndex = "9999";
    iframe.style.backgroundColor = "transparent";
    iframe.style.border = "none";
    iframe.style.borderRadius = "10px";
    iframe.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
    document.body.appendChild(iframe);

    // get the iframe document object
    iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    buildHtml();
    check();
}

function buildHtml() {

    // append pico style
    const picoStyle = iframeDoc.createElement('link');
    picoStyle.setAttribute('rel', 'stylesheet');
    picoStyle.setAttribute('href', 'https://unpkg.com/@picocss/pico@1.5.7/css/pico.min.css');

    // create navigation element
    const nav = iframeDoc.createElement('nav');
    nav.classList.add('container-fluid');
    nav.setAttribute('id', 'adagio-nav');
    nav.style.zIndex = '99';
    nav.style.position = 'fixed';
    nav.style.top = '0';
    nav.style.right = '0';
    nav.style.left = '0';
    nav.style.padding = '0 var(--spacing)';
    nav.style.backgroundColor = 'var(--card-background-color)';
    nav.style.boxShadow = 'var(--card-box-shadow)';

    // create first unordered list inside navigation
    const ul1 = iframeDoc.createElement('ul');
    const li1 = iframeDoc.createElement('li');
    const a1s = iframeDoc.createElement('a')
    const strong1 = iframeDoc.createElement('strong');
    strong1.textContent = 'Adagio.io';
    li1.appendChild(strong1);
    ul1.appendChild(li1);

    // create second unordered list inside navigation
    const ul2 = iframeDoc.createElement('ul');
    const mli2a = iframeDoc.createElement('li');
    const ma2a = iframeDoc.createElement('button');
    ma2a.textContent = 'Manager';
    ma2a.addEventListener("click", () => switchTab(ma2a, 'manager-container'));
    ma2a.classList.add('outline');
    mli2a.appendChild(ma2a);

    const li2a = iframeDoc.createElement('li');
    const a2a = iframeDoc.createElement('button');
    a2a.textContent = 'Checker';
    a2a.addEventListener("click", () => switchTab(a2a, 'checker-container'));
    li2a.appendChild(a2a);
    activeTab = a2a;

    const li2b = iframeDoc.createElement('li');
    const a2b = iframeDoc.createElement('button');
    a2b.textContent = 'AdUnits';
    a2b.addEventListener("click", () => switchTab(a2b, 'adunits-container'));
    a2b.classList.add('outline');
    li2b.appendChild(a2b);

    const li2c = iframeDoc.createElement('li');
    const a2c = iframeDoc.createElement('button');
    a2c.textContent = 'Consents';
    a2c.addEventListener("click", () => switchTab(a2c, 'consents-container'));
    a2c.classList.add('outline');
    
    li2c.appendChild(a2c);
    ul2.appendChild(mli2a);
    ul2.appendChild(li2a);
    ul2.appendChild(li2a);
    ul2.appendChild(li2b);
    ul2.appendChild(li2c);

    // append unordered lists to navigation
    nav.appendChild(ul1);
    nav.appendChild(ul2);

    // append main containers to iframeDoc body
    iframeDoc.head.appendChild(picoStyle);
    iframeDoc.body.appendChild(nav);
    createManagerDiv();
    createCheckerDiv();
    createAdUnitsDiv();
    createConsentsDiv();
}

function createManagerDiv() {
    // create main container element
    const mainContainer = iframeDoc.createElement('div');
    mainContainer.setAttribute('id', 'manager-container');
    mainContainer.style.display = "none";
    mainContainer.style.paddingTop = '5rem';
    mainContainer.style.paddingBottom = '0';

    // create the iframe
    const managerIframe = iframeDoc.createElement('iframe');
    managerIframe.setAttribute('id', 'manager-iframe');
    managerIframe.setAttribute('src', 'https://app.adagio.io/');
    managerIframe.style.width = '100%';
    managerIframe.style.height = '100%';

    // append the container to the body
    mainContainer.appendChild(managerIframe);
    iframeDoc.body.appendChild(mainContainer);
}

function createCheckerDiv() {
    // create main container element
    const mainContainer = iframeDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', 'checker-container');
    mainContainer.style.paddingTop = '5rem';
    mainContainer.style.paddingBottom = '0';

    // create headings container
    const headings = iframeDoc.createElement('div');
    headings.classList.add('headings');

    const br = iframeDoc.createElement('br');
    const h2 = iframeDoc.createElement('h2');
    h2.textContent = 'Integration checker';
    const h3 = iframeDoc.createElement('h3');
    h3.textContent = 'Expectations for a proper Adagio integration';
    headings.appendChild(br);
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

    // append the container to the body
    iframeDoc.body.appendChild(mainContainer);
}

function createAdUnitsDiv() {
    // create main container element
    const mainContainer = iframeDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', 'adunits-container');
    mainContainer.style.display = "none";
    mainContainer.style.paddingTop = '5rem';
    mainContainer.style.paddingBottom = '0';

    // create headings container
    const headings = iframeDoc.createElement('div');
    headings.classList.add('headings');

    const br = iframeDoc.createElement('br');
    const h2 = iframeDoc.createElement('h2');
    h2.textContent = 'AdUnits';
    const h3 = iframeDoc.createElement('h3');
    h3.textContent = 'AdUnits list for Adagio';
    headings.appendChild(br);
    headings.appendChild(h2);
    headings.appendChild(h3);

    // create table element
    const table = iframeDoc.createElement('table');
    const thead = iframeDoc.createElement('thead');
    const tr = iframeDoc.createElement('tr');
    const th1 = iframeDoc.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.textContent = 'Code';
    const th2 = iframeDoc.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.textContent = 'Mediatypes';
    const th3 = iframeDoc.createElement('th');
    th3.setAttribute('scope', 'col');
    th3.textContent = 'Sizes';
    const th4 = iframeDoc.createElement('th');
    th4.setAttribute('scope', 'col');
    th4.textContent = 'Params';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    thead.appendChild(tr);

    const tbody = iframeDoc.createElement('tbody');
    tbody.setAttribute('id', 'adunits-tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(table);

    // append the container to the body
    iframeDoc.body.appendChild(mainContainer);
}

function createConsentsDiv() {
    // create main container element
    const mainContainer = iframeDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', 'consents-container');
    mainContainer.style.display = "none";
    mainContainer.style.paddingTop = '5rem';
    mainContainer.style.paddingBottom = '0';

    // create headings container
    const headings = iframeDoc.createElement('div');
    headings.classList.add('headings');

    const br = iframeDoc.createElement('br');
    const h2 = iframeDoc.createElement('h2');
    h2.textContent = 'Consents';
    const h3 = iframeDoc.createElement('h3');
    h3.textContent = 'Expectations for consents compliance';
    headings.appendChild(br);
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
    tbody.setAttribute('id', 'consents-tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(table);

    // append the container to the body
    iframeDoc.body.appendChild(mainContainer);
}

function switchTab(tab, container) {
    // switch visible div and button outline
    if (tab !== activeTab) {
        tab.classList.remove('outline');
        activeTab.classList.add('outline');
        activeTab = tab;

        switch (container) {

            case 'manager-container':
                iframeDoc.getElementById('manager-container').style.display = "";
                iframeDoc.getElementById('checker-container').style.display = "none";
                iframeDoc.getElementById('adunits-container').style.display = "none";
                iframeDoc.getElementById('consents-container').style.display = "none";
                break;

            case 'checker-container':
                iframeDoc.getElementById('manager-container').style.display = "none";
                iframeDoc.getElementById('checker-container').style.display = "";
                iframeDoc.getElementById('adunits-container').style.display = "none";
                iframeDoc.getElementById('consents-container').style.display = "none";
                break;

            case 'adunits-container':
                iframeDoc.getElementById('manager-container').style.display = "none";
                iframeDoc.getElementById('checker-container').style.display = "none";
                iframeDoc.getElementById('adunits-container').style.display = "";
                iframeDoc.getElementById('consents-container').style.display = "none";
                break;

            case 'consents-container':
                iframeDoc.getElementById('manager-container').style.display = "none";
                iframeDoc.getElementById('checker-container').style.display = "none";
                iframeDoc.getElementById('adunits-container').style.display = "none";
                iframeDoc.getElementById('consents-container').style.display = "";
                break;

            default:
                console.log('No container found.');
                break;
        }
    }
}

function appendCheckerRow(status, name, details) {

    // get the tbody element
    const tableBody = iframeDoc.getElementById('checker-tbody');

    // Create the row
    const newRow = iframeDoc.createElement('tr');
  
    // Create the cells
    const statusCell = iframeDoc.createElement('td');
    const nameCell = iframeDoc.createElement('td');
    const detailsCell = iframeDoc.createElement('td');
  
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
        console.log('No badge found.')
    }
  
    // Add the cells
    tableBody.appendChild(newRow);
    newRow.appendChild(statusCell);
    newRow.appendChild(nameCell);
    newRow.appendChild(detailsCell);
}

function appendAdUnitsRow(adUnits) {

    // get the tbody element
    const tableBody = iframeDoc.getElementById('adunits-tbody');

    adUnits.forEach(adUnit => {

         // Create the row
        const newRow = iframeDoc.createElement('tr');
    
        // Create the cells
        const codeCell = iframeDoc.createElement('td');
        const mediatypesCell = iframeDoc.createElement('td');
        const sizesCell = iframeDoc.createElement('td');
        const parametersCell = iframeDoc.createElement('td');
    
        // Fill the cells
        codeCell.innerHTML = `<code>${adUnit.code}</code>`;

        for (const mediaType in adUnit.mediaTypes) {
            mediatypesCell.innerHTML += `<code>${mediaType}</code>`;
            adUnit.mediaTypes[mediaType].sizes.forEach(size => {
                sizesCell.innerHTML += `<code>${JSON.stringify(size)}</code>`;
            });
        }

        for (const bid in adUnit.bids) {
            if (organizationId === undefined) {
              organizationId = adUnit.bids[bid].params['organizationId'];
              siteName = adUnit.bids[bid].params['site'];
              if (organizationId !== undefined && siteName !== undefined) {
                const managerIframe = iframeDoc.getElementById('manager-iframe');
                const datadogIframe = iframeDoc.getElementById('datadog-iframe');
                const managerUrl = `https://app.adagio.io/publishers/${organizationId}/dashboards/41?filters=inventoryWebsiteName=${siteName}`;
                // const datadogUrl = `https://app.datadoghq.com/dashboard/7g6-prj-mtf/-csm-funnel?tpl_var_organization%5B0%5D=${organizationId}`;
                // console.log(managerUrl);
                managerIframe.setAttribute('src', managerUrl);
                // datadogIframe.setAttribute('src', datadogUrl);
              }
            }
            parametersCell.innerHTML += `<code>${JSON.stringify(adUnit.bids[bid].params)}</code><br>`;
        }
    
        // Add the cells
        newRow.appendChild(codeCell);
        newRow.appendChild(mediatypesCell);
        newRow.appendChild(sizesCell);
        newRow.appendChild(parametersCell);
        tableBody.appendChild(newRow);
    });
}

function appendConsentsRow(status, name, details) {

    // get the tbody element
    const tableBody = iframeDoc.getElementById('consents-tbody');

    // Create the row
    const newRow = iframeDoc.createElement('tr');
  
    // Create the cells
    const statusCell = iframeDoc.createElement('td');
    const nameCell = iframeDoc.createElement('td');
    const detailsCell = iframeDoc.createElement('td');
  
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
        console.log('No badge found.')
    }
  
    // Add the cells
    tableBody.appendChild(newRow);
    newRow.appendChild(statusCell);
    newRow.appendChild(nameCell);
    newRow.appendChild(detailsCell);
}

function check() {
    checkPrebidVersion();
    checkAdagioModule();
    checkAdagioLocalStorage();
    checkAdagioAdUnitParams();
    checkSupplyChainObject();
    checkAdagioCMP();
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
      appendCheckerRow('red', 'Prebid', `<code>window._pbjsGlobals</code>: <code>${pbjsGlobals}</code>`);
      return;
    }
    // Sometimes, websites deal with multiple Prebids. If there's a pbjs global, use it in priority.
    prebidObject = window[pbjsGlobals.includes('pbjs') ? 'pbjs' : pbjsGlobals[0]];
    appendCheckerRow('green', 'Prebid', `<code>window._pbjsGlobals</code>: <code>${pbjsGlobals}</code>`);
}
  
function checkAdagioModule() {
    // Is Adagio bidder adapter detected? If so, give version.
    adagioAdapter = window.ADAGIO;
    if (adagioAdapter === undefined) {
      appendCheckerRow('red', 'Adagio module', `<code>window.ADAGIO</code>: <code>${window.ADAGIO}</code>`);
    } else {
      appendCheckerRow('green', 'Adagio module', `<code>${JSON.stringify(adagioAdapter.versions)}</code>`);
    }
}
  
function checkAdagioLocalStorage() {
    if (prebidObject === undefined) {
      appendCheckerRow('red', 'Localstorage', 'No Prebid.js found');
      return;
    }
    // Is local storage enabled?
    const deviceAccess = prebidObject.getConfig('deviceAccess');
    const localStorage = prebidObject.bidderSettings;
    if (localStorage.standard?.storageAllowed) {
      appendCheckerRow('green', 'Localstorage', '<code>bidderSettings.standard</code> set to <code>true</code>');
    } else if (localStorage.adagio?.storageAllowed) {
      appendCheckerRow('green', 'Localstorage', '<code>bidderSettings.adagio</code> set to <code>true</code>');
    } else if (localStorage.adagio?.storageAllowed === false) {
      appendCheckerRow('red', 'Localstorage', 'bidderSettings.adagio set to false');
    } else if (deviceAccess === true) {
      appendCheckerRow('yellow', 'Localstorage', 'Check network for local storage (<code>deviceAccess</code> set to <code>true</code>)');
    } else if (parseInt(prebidObject.version.charAt(1)) < 7) {
      appendCheckerRow('yellow', 'Localstorage', 'Prebid version lower than <code>7</code>');
    } else {
      appendCheckerRow('red', 'Localstorage', 'Not found. If detected on network, contact dev!');
    }
}
  
function checkSupplyChainObject() {
    if (prebidObject === undefined) {
      appendCheckerRow('red', 'Supply chain object', 'No Prebid.js found');
      appendConsentsRow('red', 'Supply chain object', 'No Prebid.js found');
      return;
    }
    else if (typeof prebidObject.getEvents !== 'function') {
        appendCheckerRow('red', 'Supply chain object', `<code>${pbjsGlobals}.getEvents()</code> not a function`);
        appendConsentsRow('red', 'Supply chain object', `<code>${pbjsGlobals}.getEvents()</code> not a function`);
        return;
    }
    // Find the first Adagio bidRequested event with an SCO
    const adagioBid = prebidObject.getEvents()
    .filter(e => e.eventType === 'bidRequested' && e.args.bidderCode.toLowerCase().includes('adagio'))
    .map(e => e.args.bids)
    .flat()
    .find(r => r.schain)
    if (adagioBid !== undefined) {
        appendCheckerRow('green', 'Supply chain object', 'SCO found');
        appendConsentsRow('green', 'Supply chain object', `<code>${JSON.stringify(adagioBid.schain)}</code>`);
    }
    else {
      appendCheckerRow('yellow', 'Supply chain object', 'If website is owned and managed, no SCO');
      appendConsentsRow('yellow', 'Supply chain object', 'If website is owned and managed, no SCO');
    }
} 
  
function checkAdagioCMP() {
    if (typeof window.__tcfapi !== 'function') {
        appendCheckerRow('red', 'Consent Management Platform', '<code>window.__tcfapi</code> function is not is not defined');
        appendConsentsRow('red', 'Consent Management Platform', '<code>window.__tcfapi</code> function is not is not defined');
        return;
    }
    // Gives the Consent Management strings values
    window.__tcfapi('getTCData', 2, (tcdata, success) => {
        const cmpAdagioBidders = new Map();
        cmpAdagioBidders.set(617 ,  'Adagio');
        cmpAdagioBidders.set(58 ,   '33Across');
        cmpAdagioBidders.set(253 ,  'Improve Digital');
        cmpAdagioBidders.set(10 ,   'Index Exchange');
        cmpAdagioBidders.set(285,   'Freewheel');
        cmpAdagioBidders.set(241 ,  'OneTag');
        cmpAdagioBidders.set(69 ,   'OpenX');
        cmpAdagioBidders.set(76 ,   'Pubmatic');
        cmpAdagioBidders.set(52 ,   'Rubicon');
        cmpAdagioBidders.set(45 ,   'Smart Adserver');
        cmpAdagioBidders.set(13 ,   'Sovrn');
        cmpAdagioBidders.set(25 ,   'Yahoo');

        let inConsents, inLegitimates;
        let stringResult = '';
        let allConsentsTrue = true;
        let adagioFound = false;

        for (let [key, value] of cmpAdagioBidders) {

            if (tcdata.vendor.consents[key]) inConsents = `<kbd style="color:rgb(48 158 133);background-color:rgb(226 248 243);">OK</kbd>`;
            else { 
                inConsents = `<kbd style="color:rgb(179 49 90);background-color:rgb(253 226 235);">KO</kbd>`;
                allConsentsTrue = false;
            }
            if (tcdata.vendor.legitimateInterests[key]) inLegitimates = `<kbd style="color:rgb(48 158 133);background-color:rgb(226 248 243);">OK</kbd>`;
            else inLegitimates = `<kbd style="color:rgb(179 49 90);background-color:rgb(253 226 235);">KO</kbd>`;
            stringResult += '<code>' + value + ' (' + key + ')</code>' + ': Consents: ' + inConsents + ', Legitimates: ' + inLegitimates + '<br>';
        };
        if (allConsentsTrue) {
          appendCheckerRow('green', 'Consent Management Platform', 'All consents <code>true</code>');
          appendConsentsRow('green', 'Consent Management Platform', stringResult);
        }
        else {
          appendCheckerRow('red', 'Consent Management Platform', 'One or many consents <code>false</code>');
          appendConsentsRow('red', 'Consent Management Platform', stringResult);
        }
    });
}
  
function checkAdagioAdUnitParams() {
  
    if (adagioAdapter === undefined) {
        appendCheckerRow('red', 'Adagio adUnits', 'No Adagio bidder adapter found');
        return;
    }
    // Find the params for Adagio adUnits
    const adagioAdUnits = adagioAdapter.pbjsAdUnits;
    if (adagioAdUnits !== undefined) {

        if (adagioAdUnits.length !== 0) appendCheckerRow('green', 'Adagio adUnits', `<kbd>${adagioAdUnits.length}</kbd> adUnit(s) found`);
        else appendCheckerRow('red', 'Adagio adUnits', `<kbd>${adagioAdUnits.length}</kbd> adUnit(s) found`);
        appendAdUnitsRow(adagioAdUnits);
    }
    else appendCheckerRow('red', 'Adagio adUnits', '<kbd>0</kbd> Adagio adUnit found: <code>ADAGIO.pbjsAdUnits</code>');
}  
  
function checkConsentMetadata() {
    if (prebidObject === undefined) {
        appendConsentsRow('red', 'Supply chain object', 'No pbjs found');
        return;
    }
    else if (typeof prebidObject.getConsentMetadata !== 'function') {
      appendCheckerRow('red', 'Supply chain object', `<code>${pbjsGlobals}.getConsentMetadata()</code> not a function`);
      appendConsentsRow('red', 'Supply chain object', `<code>${pbjsGlobals}.getConsentMetadata()</code> not a function`);
      return;
    }

    let consentMetadata = prebidObject.getConsentMetadata();

    if (consentMetadata !== undefined) {
      appendCheckerRow('green', 'Supply chain object', `<code>Consent metadata found</code>`);
      appendConsentsRow('green', 'Supply chain object', `<code>${JSON.stringify(consentMetadata)}</code>`);
    }

    const adagioBid = prebidObject.getEvents()
    .filter(e => e.eventType === 'bidRequested' && e.args.bidderCode.toLowerCase().includes('adagio'))
    .map(e => e.args)
    .flat()
    .find(r => r.gdprConsent)

    if (adagioBid !== undefined) {
      appendCheckerRow('green', 'GDPR consent string', `GDPR string found`);
      appendConsentsRow('green', 'GDPR consent string', `<code>${JSON.stringify(adagioBid.gdprConsent)}</code>`);
    }
    else {
      appendCheckerRow('red', 'GDPR consent string', `GDPR string not found. If consent metadata GDRP true, contact dev`);
      appendConsentsRow('red', 'GDPR consent string', 'GDPR string not found. If consent metadata GDRP true, contact dev');
    }
}

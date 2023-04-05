/*************************************************************************************************************************************************************************************************************************************
 * MAIN
 ************************************************************************************************************************************************************************************************************************************/

// Creates the global pbjs and adagio variables
let prebidObject = undefined;
let adagioAdapter = undefined;
let tableBody, overlay;

createOverlay();

/*************************************************************************************************************************************************************************************************************************************
 * FUNCTIONS
 ************************************************************************************************************************************************************************************************************************************/

// Checks if a prebid object is found
function checkPrebidVersion() {
  // Is Prebid.js detected? If so, give version.
  const pbjsGlobals = window._pbjsGlobals;
  if (pbjsGlobals === undefined) {
    appendRow('red', 'Prebid', `window._pbjsGlobals: ${pbjsGlobals}`);
    return;
  }
  // Sometimes, websites deal with multiple Prebids. If there's a pbjs global, use it in priority.
  prebidObject = window[pbjsGlobals.includes('pbjs') ? 'pbjs' : pbjsGlobals[0]];
  appendRow('green', 'Prebid', `window._pbjsGlobals: ${pbjsGlobals}`);
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

/*************************************************************************************************************************************************************************************************************************************
 * HTML / CSS
 ************************************************************************************************************************************************************************************************************************************/

function createOverlay() {

  // Create a new iframe element
  const iframe = document.createElement('iframe');
  iframe.classList.add('adagio-overlay');
  document.body.appendChild(iframe);
  createIframeCSS();

  overlay = iframe.contentDocument || iframe.contentWindow.document;
  createInIframeCSS();
  
  // Creates the table element and append the table header and body
  const table = overlay.createElement('table');
  table.classList.add('styled-table');
  const tableHeader = overlay.createElement('thead');
  const headerRow = overlay.createElement('tr');
  const headerCols = ['Status', 'Name', 'Details'];
  tableBody = overlay.createElement('tbody');

  for (let i = 0; i < headerCols.length; i++) {
      const headerCol = document.createElement('th');
      headerCol.textContent = headerCols[i];
      headerRow.appendChild(headerCol);
  }

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);
  table.appendChild(tableBody);
  overlay.body.appendChild(table);

  //Play adagio
  checkPrebidVersion();
  checkAdagioModule();
  checkAdagioLocalStorage();
  checkSupplyChainObject();
  checkAdagioCMP();
  checkAdagioAdUnitParams();
  checkConsentMetadata();

  // Update table size
  iframe.style.height = table.scrollHeight + 'px';
  iframe.style.width = table.scrollWidth + 'px';
}

function appendRow(status, name, details) {

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
      statusCell.innerHTML = `<span class="badge badge-pill badge-success">OK</span>`;
      break;
    case 'red':
      statusCell.innerHTML = `<span class="badge badge-pill badge-danger">KO</span>`;
      break;  
    case 'yellow':
      statusCell.innerHTML = `<span class="badge badge-pill badge-warning">?</span>`;
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



function createIframeCSS() {
  const style = document.createElement('style');
  const styleCSS = `
    .adagio-overlay {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 9999;
      background-color: transparent;
      border: none;
    }
  `;
  style.innerHTML = styleCSS;
  document.head.appendChild(style);
}

function createInIframeCSS() {
  const style = document.createElement('style');
  const styleCSS = `
    body {
        font-family: Open Sans, sans-serif;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        margin: 0;
        text-align: left;
        color: #525f7f;
    }
    .styled-table {
      background-color: white;
      border-collapse: collapse;
      font-size: 14px;
      font-family: sans-serif;
      min-width: 400px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
      border-bottom: 1px;
      white-space: nowrap;
    }
    .styled-table thead tr {
        background-color: #5f74d6;
        color: #ffffff;
        text-align: left;
    }
    .styled-table th,
    .styled-table td {
        padding: 12px 15px;
    }
    .styled-table tbody tr {
        border-bottom: 1px solid #dddddd;
    }
    .badge-success {
        color: #fff;
        background-color: #28a745;
    }
    .badge-danger {
        color: #fff;
        background-color: #dc3545;
    }
    .badge-warning {
        color: #212529;
        background-color: #ffc107;
    }
    .badge {
        display: inline-block;
        padding: 0.25em 0.4em;
        font-size: 75%;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.25rem;
        padding-right: 0.6em;
        padding-left: 0.6em;
        border-radius: 10rem;
    }
  `;
  style.innerHTML = styleCSS;
  overlay.head.appendChild(style);
}

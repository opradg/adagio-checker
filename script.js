// Creates the global pbjs and adagio variables
let prebidObject, adagioAdapter;
let iframe, iframeDoc;
let activeTab;
let organizationId = undefined;
let siteName = undefined;
let adagioAdUnits;

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
    const a1a = iframeDoc.createElement('a');
    a1a.setAttribute('href', 'https://adagio.io');
    a1a.setAttribute('target', '_blank');
    const svgAdagio = '<svg viewBox="0 0 101 92" style="height:1.5em;"><path d="M97 88.598H84.91l-33.473-72.96-.817-1.707-6.398 13.836 28.143 60.916h-12.2l-.106-.237-21.82-47.743-6.428 13.9 15.978 34.08H35.59l-9.802-21.056-9.698 20.97H4L43.109 4H57.89L97 88.598Z"></path></svg>';
    a1a.innerHTML = svgAdagio;
    li1.appendChild(a1a);
    ul1.appendChild(li1);

    // create second unordered list inside navigation
    const ul2 = iframeDoc.createElement('ul');

    const mli2a = iframeDoc.createElement('li');
    const ma2a = iframeDoc.createElement('button');
    const svgManager = '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"></path></svg>';
    ma2a.innerHTML = svgManager;
    ma2a.innerHTML += ' Manager ';
    ma2a.addEventListener('click', () => switchTab(ma2a, 'manager-container'));
    ma2a.classList.add('outline');
    ma2a.style.padding = '0.3em';
    mli2a.appendChild(ma2a);

    const li2a = iframeDoc.createElement('li');
    const a2a = iframeDoc.createElement('button');
    const svgChecker = '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M19 15v4H5v-4h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 18.5c-.82 0-1.5-.67-1.5-1.5s.68-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19 5v4H5V5h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 8.5c-.82 0-1.5-.67-1.5-1.5S6.18 5.5 7 5.5s1.5.68 1.5 1.5S7.83 8.5 7 8.5z"></path></svg>';
    a2a.innerHTML = svgChecker;
    a2a.innerHTML += ' Checker ';
    a2a.addEventListener('click', () => switchTab(a2a, 'checker-container'));
    a2a.style.padding = '0.3em';
    li2a.appendChild(a2a);
    activeTab = a2a;

    const li2b = iframeDoc.createElement('li');
    const a2b = iframeDoc.createElement('button');
    const svgAdunit = '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM7 4V3h10v1H7zm0 14V6h10v12H7zm0 3v-1h10v1H7z"></path><path d="M16 7H8v2h8V7z"></path></svg>';
    a2b.innerHTML = svgAdunit;
    a2b.innerHTML += ' AdUnits ';
    a2b.addEventListener('click', () => switchTab(a2b, 'adunits-container'));
    a2b.classList.add('outline');
    a2b.style.padding = '0.3em';
    li2b.appendChild(a2b);

    const li2c = iframeDoc.createElement('li');
    const a2c = iframeDoc.createElement('button');
    const svgConsents = '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M13.17 4 18 8.83V20H6V4h7.17M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-2 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.99 0-1.93.21-2.78.58C8.48 15.9 8 16.62 8 17.43V18h8v-.57z"></path></svg>';
    a2c.innerHTML = svgConsents;
    a2c.innerHTML += ' Consents ';
    a2c.addEventListener('click', () => switchTab(a2c, 'consents-container'));
    a2c.classList.add('outline');
    a2c.style.padding = '0.3em';
    li2c.appendChild(a2c);

    const li2e = iframeDoc.createElement('li');
    const a2e = iframeDoc.createElement('button');    
    a2e.disabled = true;
    const svgEyeOpened = '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M6.30147 15.5771C4.77832 14.2684 3.6904 12.7726 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C14.1843 6 16.1261 7.07185 17.6986 8.42294C19.2218 9.73158 20.3097 11.2274 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18C9.81574 18 7.87402 16.9282 6.30147 15.5771ZM12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C2.00757 13.8624 3.23268 15.5772 4.99812 17.0941C6.75717 18.6054 9.14754 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C21.9925 10.1376 20.7674 8.42276 19.002 6.90595C17.2429 5.39462 14.8525 4 12 4ZM10 12C10 10.8954 10.8955 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8955 14 10 13.1046 10 12ZM12 8C9.7909 8 8.00004 9.79086 8.00004 12C8.00004 14.2091 9.7909 16 12 16C14.2092 16 16 14.2091 16 12C16 9.79086 14.2092 8 12 8Z"></path></svg>';
    a2e.innerHTML = svgEyeOpened;
    a2e.addEventListener('click', () => displayAdunits(a2e));
    a2e.classList.add('outline');
    a2e.style.borderColor = 'transparent';
    a2e.style.padding = '0.3em';
    li2e.appendChild(a2e);

    const li2d = iframeDoc.createElement('li');
    const a2d = iframeDoc.createElement('button');
    a2d.disabled = true;
    const svgRefresh = '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>';
    a2d.innerHTML = svgRefresh;
    a2d.addEventListener('click', () => refreshTables(a2d));
    a2d.classList.add('outline');
    a2d.style.borderColor = 'transparent';
    a2d.style.padding = '0.3em';
    li2d.appendChild(a2d);

    ul2.appendChild(mli2a);
    ul2.appendChild(li2a);
    ul2.appendChild(li2a);
    ul2.appendChild(li2b);
    ul2.appendChild(li2c);
    ul2.appendChild(li2e);
    ul2.appendChild(li2d);

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
    managerIframe.setAttribute('aria-busy', 'true')
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

    const h2 = iframeDoc.createElement('h2');
    h2.textContent = 'Integration checker';
    const h3 = iframeDoc.createElement('h3');
    h3.textContent = 'Expectations for a proper Adagio integration';
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
    const h2 = iframeDoc.createElement('h2');
    h2.textContent = 'AdUnits';
    const h3 = iframeDoc.createElement('h3');
    h3.textContent = 'Bid requested for each adUnit and by bidders';
    headings.appendChild(h2);
    headings.appendChild(h3);

    // create bidder filter
    const bidderFilter = iframeDoc.createElement('details');
    bidderFilter.setAttribute('role', 'list');
    const selectFilter = iframeDoc.createElement('summary');
    selectFilter.setAttribute('aria-haspopup', 'listbox');
    selectFilter.textContent = 'Filter requested bids by bidders';
    const ulFilter = iframeDoc.createElement('ul');
    ulFilter.setAttribute('role', 'listbox');
    ulFilter.setAttribute('id', 'bidderFilter');
    bidderFilter.appendChild(selectFilter);
    bidderFilter.appendChild(ulFilter);

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
    th3.textContent = 'Bidder params';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);

    const tbody = iframeDoc.createElement('tbody');
    tbody.setAttribute('id', 'adunits-tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(bidderFilter);
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

    const h2 = iframeDoc.createElement('h2');
    h2.textContent = 'Consents';
    const h3 = iframeDoc.createElement('h3');
    h3.textContent = 'Expectations for consents compliance';
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

function appendAdUnitsRow(bidders, bids) {

    // check if Adagio is detected and get bidder name
    let adagioId = bidders.filter(e => e.toLowerCase().includes('adagio'));
    if (adagioId.length > 0) adagioId = adagioId[0];
    else adagioId = '';

    // fill the bid table
    const tableBody = iframeDoc.getElementById('adunits-tbody');

    bids.forEach(bid => {

      const adUnitCode = bid.adUnitCode;
      const mediaTypes = bid.mediaTypes;
      const bidderId = bid.bidder;

      // Create the row
      const newRow = iframeDoc.createElement('tr');
      newRow.classList.add(`${bidderId.replace(' ', '-')}-bid`);
      // hides the row if adagio found
      if (adagioId !== '' && adagioId !== bidderId) {
        newRow.style.display = 'none';
      }
      
      // Create the cells
      const codeCell = iframeDoc.createElement('td');
      const mediatypesCell = iframeDoc.createElement('td');
      const bidderIdCell = iframeDoc.createElement('td');
      const bidderParamButton = iframeDoc.createElement('kbd');
      bidderParamButton.addEventListener("click", () => createBidderParamsModal(bid));
      bidderParamButton.style.cursor = 'pointer';

      codeCell.innerHTML = `<code>${adUnitCode}</code>`;
      for (const mediaType in mediaTypes) {
        mediatypesCell.innerHTML += `<code>${mediaType}</code>: `;
          for (const size in mediaTypes[mediaType].sizes) {
            mediatypesCell.innerHTML += `<code>${JSON.stringify(mediaTypes[mediaType].sizes[size])}</code>`;
          }
      }
      bidderParamButton.innerHTML = `${bidderId}`;

      // Add the cells
      newRow.appendChild(codeCell);
      newRow.appendChild(mediatypesCell);
      newRow.appendChild(bidderIdCell);
      bidderIdCell.appendChild(bidderParamButton);
      tableBody.appendChild(newRow);
    });

    // fill the filter dropdown list
    const bidderFilter = iframeDoc.getElementById('bidderFilter');

    bidders.forEach(bidder => {

      const libidder = iframeDoc.createElement('li');
      const labbidder = iframeDoc.createElement('label');
      const inputbidder = iframeDoc.createElement('input');
      inputbidder.setAttribute('type', 'checkbox');
      inputbidder.setAttribute('id', `${bidder.replace(' ', '-')}-bidder`);
      bidderFilter.appendChild(libidder);
      libidder.appendChild(labbidder);
      labbidder.appendChild(inputbidder);
      labbidder.innerHTML += `<code>${bidder}</code>`;

      const newInput = iframeDoc.getElementById(`${bidder.replace(' ', '-')}-bidder`);
      if (adagioId !== '' && adagioId !== bidder) newInput.checked = false;
      else newInput.checked = true;
      newInput.addEventListener('click', function() {
        toggleBidRow(newInput, bidder)
      });
    });
}

function toggleBidRow(inputbidder, bidder) {

  // Depending on checkbox, hide or show bidrequested for the bidder
  const bidderRows = iframeDoc.getElementsByClassName(`${bidder.replace(' ', '-')}-bid`);
  for (const bidderRow of bidderRows) {
    if (inputbidder.checked === false) {
      bidderRow.style.display = 'none';
    }
    else {
      bidderRow.style.display = '';
    }
  };
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

function refreshTables(refreshButton) {

  const refreshIcon = refreshButton.querySelector("svg");

  const keyframes = `@keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }`;
  
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(keyframes));
  iframeDoc.head.appendChild(style);

  console.log(refreshIcon);
  console.log('ok');

  refreshIcon.style.animation = "rotation 1s linear";
  setTimeout(() => {
    refreshIcon.style.animation = "";
  }, 1000);
}

function displayAdunits(eyeButton) {

  // <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z" fill="#000000"></path> </g></svg>
  adagioAdUnits.forEach(adagioAdUnit => {
    for (const bid in adagioAdUnit.bids) {
      const adUnitElementId = adagioAdUnit.bids[bid].params['adUnitElementId'];
      const originalDiv = document.getElementById(adUnitElementId);
      // Create a new div element
      const newDiv = document.createElement("div");
      newDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      // Add the new div as a parent of the original div
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      newDiv.appendChild(originalDiv);
    }
  });
}

function createBidderParamsModal(bid) {

  const dialog = iframeDoc.createElement('dialog');
  dialog.setAttribute('open', true);

  const article = iframeDoc.createElement('article');
  const header = iframeDoc.createElement('header');
  header.textContent = bid.bidder;
  const closeLink = iframeDoc.createElement('a');
  closeLink.setAttribute('aria-label', 'Close');
  closeLink.classList.add('close');
  closeLink.addEventListener("click", () => {dialog.remove();});

  const paragraph = iframeDoc.createElement('p');
  paragraph.innerHTML = `<pre><small><code class="language-json">${JSON.stringify(bid, null, 2)}</code></small></pre>`;

  article.appendChild(header);
  header.appendChild(closeLink);
  article.appendChild(paragraph);
  dialog.appendChild(article);
  iframeDoc.body.appendChild(dialog);
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

function checkAdagioAdUnitParams() {

  const prebidBidRequested = prebidObject.getEvents()
    .filter(e => e.eventType === 'bidRequested')
    .map(e => e.args);
  const bidders = [...new Set(prebidBidRequested.map(e => e.bidderCode))].sort();
  const bids = prebidBidRequested.map(e => e.bids).flat();
  appendAdUnitsRow(bidders, bids);
  
  if (adagioAdapter === undefined) {
      appendCheckerRow('red', 'Adagio adUnits', 'No Adagio bidder adapter found');
      return;
  }
  // Find the params for Adagio adUnits
  adagioAdUnits = adagioAdapter.pbjsAdUnits;
  if (adagioAdUnits !== undefined) {

      if (adagioAdUnits.length !== 0) appendCheckerRow('green', 'Adagio adUnits', `<kbd>${adagioAdUnits.length}</kbd> adUnit(s) found`);
      else appendCheckerRow('red', 'Adagio adUnits', `<kbd>${adagioAdUnits.length}</kbd> adUnit(s) found`);
      // appendAdUnitsRow(adagioAdUnits);
  }
  // else appendCheckerRow('red', 'Adagio adUnits', '<kbd>0</kbd> Adagio adUnit found: <code>ADAGIO.pbjsAdUnits</code>');
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
        appendCheckerRow('red', 'Consent Management Platform', '<code>window.__tcfapi</code> function is not defined');
        appendConsentsRow('red', 'Consent Management Platform', '<code>window.__tcfapi</code> function is not defined');
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

            const consent = tcdata.vendor.consents[key];
            const legitimate = tcdata.vendor.legitimateInterests[key];

            if (key === 617 && (consent || legitimate)) adagioFound = true;

            if (consent) inConsents = `<kbd style="color:rgb(48 158 133);background-color:rgb(226 248 243);">OK</kbd>`;
            else { 
                inConsents = `<kbd style="color:rgb(179 49 90);background-color:rgb(253 226 235);">KO</kbd>`;
                allConsentsTrue = false;
            }
            if (legitimate) inLegitimates = `<kbd style="color:rgb(48 158 133);background-color:rgb(226 248 243);">OK</kbd>`;
            else inLegitimates = `<kbd style="color:rgb(179 49 90);background-color:rgb(253 226 235);">KO</kbd>`;
            stringResult += '<code>' + value + ' (' + key + ')</code>' + ': Consents: ' + inConsents + ', Legitimates: ' + inLegitimates + '<br>';
        };
        if (allConsentsTrue) {
          appendCheckerRow('green', 'Consent Management Platform', 'All consents <code>true</code>');
          appendConsentsRow('green', 'Consent Management Platform', stringResult);
        }
        else if (!adagioFound) {
          appendCheckerRow('red', 'Consent Management Platform', 'Adagio consent <code>false</code>');
          appendConsentsRow('red', 'Consent Management Platform', stringResult);
        }
        else {
          appendCheckerRow('yellow', 'Consent Management Platform', 'One or many consents <code>false</code>');
          appendConsentsRow('yellow', 'Consent Management Platform', stringResult);
        }
    });
}
  
function checkConsentMetadata() {
    if (prebidObject === undefined) {
        appendConsentsRow('red', 'Consent metadata', 'No pbjs found');
        return;
    }
    else if (typeof prebidObject.getConsentMetadata !== 'function') {
      appendCheckerRow('red', 'Consent metadata', `<code>${pbjsGlobals}.getConsentMetadata()</code> not a function`);
      appendConsentsRow('red', 'Consent metadata', `<code>${pbjsGlobals}.getConsentMetadata()</code> not a function`);
      return;
    }

    let consentMetadata = prebidObject.getConsentMetadata();

    if (consentMetadata !== undefined) {
      appendCheckerRow('green', 'Consent metadata', 'Consent metadata found');
      appendConsentsRow('green', 'Consent metadata', `<code>${JSON.stringify(consentMetadata)}</code>`);
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




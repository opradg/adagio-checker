/*************************************************************************************************************************************************************************************************************************************
 * Global variables
 ************************************************************************************************************************************************************************************************************************************/
// Overlay iframe html object, and iframe document
let iframe = undefined;
let iframeDoc = undefined;
// Prebid.js object, and window.ADAGIO object and events
let pbjsGlobals = undefined;
let prebidObject = undefined;
let adagioAdapter = undefined;
// Prebid events, bids and adUnits
let prebidEvents = undefined;
let prebidBidRequested = undefined;
let prebidAdagioBidRequested = undefined;
let prebidBids = undefined;
let prebidBidders = undefined;
let prebidAdUnitsCode = undefined;
let prebidAdagioAdUnitsCode = undefined;
let adagioBidsRequested = undefined;
let adagioPbjsAdUnitsCode = [];
let prebidAdagioParams = undefined;
// Active tab (from button html element)
let activeTab = undefined;

/*************************************************************************************************************************************************************************************************************************************
 * Enums
 ************************************************************************************************************************************************************************************************************************************/

const ADAGIOSVG = Object.freeze({
    LOGO: '<svg viewBox="0 0 101 92" style="height:1.5em;"><path d="M97 88.598H84.91l-33.473-72.96-.817-1.707-6.398 13.836 28.143 60.916h-12.2l-.106-.237-21.82-47.743-6.428 13.9 15.978 34.08H35.59l-9.802-21.056-9.698 20.97H4L43.109 4H57.89L97 88.598Z"></path></svg>',
    MANAGER: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"></path></svg>',
    CHECKER: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M19 15v4H5v-4h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 18.5c-.82 0-1.5-.67-1.5-1.5s.68-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19 5v4H5V5h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 8.5c-.82 0-1.5-.67-1.5-1.5S6.18 5.5 7 5.5s1.5.68 1.5 1.5S7.83 8.5 7 8.5z"></path></svg>',
    ADUNITS: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM7 4V3h10v1H7zm0 14V6h10v12H7zm0 3v-1h10v1H7z"></path><path d="M16 7H8v2h8V7z"></path></svg>',
    CONSENTS: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M13.17 4 18 8.83V20H6V4h7.17M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-2 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.99 0-1.93.21-2.78.58C8.48 15.9 8 16.62 8 17.43V18h8v-.57z"></path></svg>',
    EYEOPENED: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M6.30147 15.5771C4.77832 14.2684 3.6904 12.7726 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C14.1843 6 16.1261 7.07185 17.6986 8.42294C19.2218 9.73158 20.3097 11.2274 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18C9.81574 18 7.87402 16.9282 6.30147 15.5771ZM12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C2.00757 13.8624 3.23268 15.5772 4.99812 17.0941C6.75717 18.6054 9.14754 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C21.9925 10.1376 20.7674 8.42276 19.002 6.90595C17.2429 5.39462 14.8525 4 12 4ZM10 12C10 10.8954 10.8955 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8955 14 10 13.1046 10 12ZM12 8C9.7909 8 8.00004 9.79086 8.00004 12C8.00004 14.2091 9.7909 16 12 16C14.2092 16 16 14.2091 16 12C16 9.79086 14.2092 8 12 8Z"></path></svg>',
    EYECLOSED: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z"></path></svg>',
    REFRESH: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>',
    INFO: '<svg viewBox="0 0 416.979 416.979" style="height:1.2em;"><path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path></svg>'
});

const ADAGIOTABSNAME = Object.freeze({
    MANAGER: 'Manager',
    CHECKER: 'Checker',
    ADUNITS: 'Adunits',
    CONSENTS: 'Consents'
});

const COLOR = Object.freeze({
    GREENTEXT: 'rgb(48 158 133)',
    GREENBACKGROUND: 'rgb(226 248 243)',
    REDTEXT: 'rgb(179 49 90)',
    REDBACKGROUND: 'rgb(253 226 235)',
    YELLOWTEXT: 'rgb(180 130 59)',
    YELLOWBACKGROUND: 'rgb(253 243 228)'
});

const STATUSBADGES = Object.freeze({
    OK: `<kbd style="color:${COLOR.GREENTEXT};background-color:${COLOR.GREENBACKGROUND};">OK</kbd>`,
    KO: `<kbd style="color:${COLOR.REDTEXT};background-color:${COLOR.REDBACKGROUND};">KO</kbd>`,
    CHECK: `<kbd style="color:${COLOR.YELLOWTEXT};background-color:${COLOR.YELLOWBACKGROUND};">!?</kbd>`,
});

const ADAGIOCHECK = Object.freeze({
    PREBID: 'Prebid.js',
    ADAPTER: 'Adagio adapter',
    LOCALSTORAGE: 'Localstorage',
    ADUNITS: 'Adunits',
    SCO: 'Supply chain object',
    CMP: 'Consent management platform',
    CONSENT: 'Consent metadata',
    GDPR: 'GDPR consent string'
});

const ADAGIOERRORS = Object.freeze({
    PREBIDNOTFOUND: 'Prebid.js not found',
    PREBIDFOUND: 'Prebid.js found',
    ADAPTERNOTFOUND: 'Adagio adapter not found'
});

const ADAGIOLINKS = Object.freeze({
    WEBSITE: 'https://adagio.io/',
    MANAGER: 'https://app.adagio.io/'
});

const ADAGIOPARAMS = {
    ORGANIZATIONID: null,
    SITE: null,
    ENVIRONMENT: null,
    CATEGORY: null,
    PAGETYPE: null
};

/*************************************************************************************************************************************************************************************************************************************
 * Main
 ************************************************************************************************************************************************************************************************************************************/

createOverlay();
buildHtml();
createManagerDiv();
createCheckerDiv();
createAdUnitsDiv();
createConsentsDiv();
check();

/*************************************************************************************************************************************************************************************************************************************
 * HTML functions
 ************************************************************************************************************************************************************************************************************************************/

function createOverlay() {

    // create a new iframe element
    iframe = window.document.createElement('iframe');
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
	iframe.style.resize = 'both';
    iframe.style.direction = 'rtl';
    window.document.body.appendChild(iframe);

    // get the iframe document object
    iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
}

function buildNavBar() {
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
    return nav;
}

function buildAdagioButton() {
    // create first unordered list inside navigation
    const ul = iframeDoc.createElement('ul');
    const li = iframeDoc.createElement('li');
    const a = iframeDoc.createElement('a');
    a.setAttribute('href', ADAGIOLINKS.WEBSITE);
    a.setAttribute('target', '_blank');
    a.innerHTML = ADAGIOSVG.LOGO;
    li.appendChild(a);
    ul.appendChild(li);
    return ul;
}

function buildTabButton(name, svg, isactive) {

    const tabName = name.toLowerCase().replace(' ', '-');
    const li = iframeDoc.createElement('li');
    const tabButton = iframeDoc.createElement('button');
    tabButton.setAttribute('id', `${tabName}-button`)
    tabButton.innerHTML = svg;
    tabButton.innerHTML += ` ${name} `;
    tabButton.addEventListener('click', () => switchTab(tabName));
    if (!isactive) tabButton.classList.add('outline');
    else activeTab = tabName;
    tabButton.style.padding = '0.3em';
    li.appendChild(tabButton);
    return li;
}

function buildOverlayButton(name, svg, isactive) {

    const li = iframeDoc.createElement('li');
    const button = iframeDoc.createElement('button');
    button.setAttribute('title', name);
    if (!isactive) button.disabled = true;
    button.innerHTML = svg;
    button.addEventListener('click', () => displayAdunits(button));
    button.classList.add('outline');
    button.style.borderColor = 'transparent';
    button.style.padding = '0.3em';
    li.appendChild(button);
    return li;
}

function buildRefreshButton(name, svg, isactive) {

    const li = iframeDoc.createElement('li');
    const button = iframeDoc.createElement('button');
    button.setAttribute('title', name);
    if (!isactive) button.disabled = true;
    button.innerHTML = svg;
    button.addEventListener('click', () => refreshTables());
    button.classList.add('outline');
    button.style.borderColor = 'transparent';
    button.style.padding = '0.3em';
    li.appendChild(button);
    return li;
}

function buildHtml() {

    // append pico style
    const picoStyle = iframeDoc.createElement('link');
    picoStyle.setAttribute('rel', 'stylesheet');
    picoStyle.setAttribute('href', 'https://unpkg.com/@picocss/pico@1.5.7/css/pico.min.css');

    // create navigation element
    const nav = buildNavBar();
    nav.appendChild(buildAdagioButton());

    // create second unordered list inside navigation
    const ul = iframeDoc.createElement('ul');
    ul.appendChild(buildTabButton(ADAGIOTABSNAME.MANAGER, ADAGIOSVG.MANAGER, false));
    ul.appendChild(buildTabButton(ADAGIOTABSNAME.CHECKER, ADAGIOSVG.CHECKER, true));
    ul.appendChild(buildTabButton(ADAGIOTABSNAME.ADUNITS, ADAGIOSVG.ADUNITS, false));
    ul.appendChild(buildTabButton(ADAGIOTABSNAME.CONSENTS, ADAGIOSVG.CONSENTS, false));
    ul.appendChild(buildOverlayButton('Show adunits overlay', ADAGIOSVG.EYECLOSED, false));
    ul.appendChild(buildRefreshButton('Refresh', ADAGIOSVG.REFRESH, true));

    // append unordered lists to navigation
    nav.appendChild(ul);

    // append main containers to iframeDoc body
    iframeDoc.head.appendChild(picoStyle);
    iframeDoc.body.appendChild(nav);
}

function createManagerDiv() {
    // build id name
    const tabName = ADAGIOTABSNAME.MANAGER.toLowerCase().replace(' ', '-');

    // create main container element
    const mainContainer = iframeDoc.createElement('div');
    mainContainer.setAttribute('id', `${tabName}-container`);
    mainContainer.style.display = "none";
    mainContainer.style.paddingTop = '3rem';
    mainContainer.style.paddingBottom = '0';

    // create the iframe
    const managerIframe = iframeDoc.createElement('iframe');
    managerIframe.setAttribute('id', `${tabName}-iframe`);
    managerIframe.setAttribute('src', ADAGIOLINKS.MANAGER);
    managerIframe.setAttribute('aria-busy', 'true')
    managerIframe.style.width = '100%';
    managerIframe.style.height = '100%';

    // append the container to the body
    mainContainer.appendChild(managerIframe);
    iframeDoc.body.appendChild(mainContainer);
}

function createCheckerDiv() {
    // build id name
    const tabName = ADAGIOTABSNAME.CHECKER.toLowerCase().replace(' ', '-');

    // create main container element
    const mainContainer = iframeDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', `${tabName}-container`);
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
    tbody.setAttribute('id', `${tabName}-tbody`);
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(table);

    // append the container to the body
    iframeDoc.body.appendChild(mainContainer);
}

function createAdUnitsDiv() {
    // build id name
    const tabName = ADAGIOTABSNAME.ADUNITS.toLowerCase().replace(' ', '-');

    // create main container element
    const mainContainer = iframeDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', `${tabName}-container`);
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

    // create the alert article
    /*const alertContainer = iframeDoc.createElement('article');
    alertContainer.style.padding = '1em';
    alertContainer.style.marginLeft = '';
    alertContainer.style.marginRight = '';
    alertContainer.style.marginTop = '1em';
    alertContainer.style.marginBottom = '1em';
    alertContainer.style.color = COLOR.YELLOWTEXT;
    alertContainer.style.backgroundColor = COLOR.YELLOWBACKGROUND;
    const alertTextDivTitle = iframeDoc.createElement('div');
    alertTextDivTitle.style.display = 'flex';
    alertTextDivTitle.style.alignItems = 'center';
    alertTextDivTitle.innerHTML += ADAGIOSVG.INFO;
    alertTextDivTitle.innerHTML += '&nbsp;&nbsp;This is a test';
    const alertTextDiv = iframeDoc.createElement('div');
    alertTextDiv.innerHTML += 'This is another test with a second line';
    alertContainer.appendChild(alertTextDivTitle);
    alertContainer.appendChild(alertTextDiv);*/

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
    tbody.setAttribute('id', `${tabName}-tbody`);
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    // mainContainer.appendChild(alertContainer);
    mainContainer.appendChild(bidderFilter);
    mainContainer.appendChild(table);

    // append the container to the body
    iframeDoc.body.appendChild(mainContainer);
}

function createConsentsDiv() {
    // build id name
    const tabName = ADAGIOTABSNAME.CONSENTS.toLowerCase().replace(' ', '-');

    // create main container element
    const mainContainer = iframeDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', `${tabName}-container`);
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
    tbody.setAttribute('id', `${tabName}-tbody`);
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(table);

    // append the container to the body
    iframeDoc.body.appendChild(mainContainer);
}

function switchTab(tabName) {
    // switch visible div and button outline
    if (tabName !== activeTab) {
		goTopPage();
        const activeTabButton = iframeDoc.getElementById(`${activeTab}-button`);
        const activeTabContainer = iframeDoc.getElementById(`${activeTab}-container`);
        const targetTabButton = iframeDoc.getElementById(`${tabName}-button`);
        const targetTabContainer = iframeDoc.getElementById(`${tabName}-container`);
        targetTabButton.classList.remove('outline');
        activeTabButton.classList.add('outline');
        targetTabContainer.style.display = "";
        activeTabContainer.style.display = "none";
        activeTab = tabName;
    }
}

function goTopPage() {

	iframeDoc.body.scrollTop = 0;
	// $('html, body').animate({ scrollTop: 0 }, 'fast');

}

function appendCheckerRow(status, name, details) {
    // build id name
    const tabName = ADAGIOTABSNAME.CHECKER.toLowerCase().replace(' ', '-');
    // get the tbody element
    const tableBody = iframeDoc.getElementById(`${tabName}-tbody`);
    // Create the row
    const newRow = iframeDoc.createElement('tr');
    // Create the cells
    const statusCell = iframeDoc.createElement('td');
    const nameCell = iframeDoc.createElement('td');
    const detailsCell = iframeDoc.createElement('td');
    // Fill the cells
    statusCell.innerHTML = status;
    nameCell.innerHTML = name;
    detailsCell.innerHTML = details;
    // Add the cells
    tableBody.appendChild(newRow);
    newRow.appendChild(statusCell);
    newRow.appendChild(nameCell);
    newRow.appendChild(detailsCell);
}

function appendAdUnitsRow(bidders, bids) {

    // check if Adagio is detected and get bidder name
    let adagioId = '';
    if (prebidAdagioBidRequested.length > 0) adagioId = prebidAdagioBidRequested[0].bidder;

    // build id name
    const tabName = ADAGIOTABSNAME.ADUNITS.toLowerCase().replace(' ', '-');
    // fill the bid table
    const tableBody = iframeDoc.getElementById(`${tabName}-tbody`);

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
        } else {
            bidderRow.style.display = '';
        }
    }
}

function appendConsentsRow(status, name, details) {

    // build id name
    const tabName = ADAGIOTABSNAME.CONSENTS.toLowerCase().replace(' ', '-');
    // get the tbody element
    const tableBody = iframeDoc.getElementById(`${tabName}-tbody`);

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
        case STATUSBADGES.OK:
            statusCell.innerHTML = `<kbd style="color:rgb(48 158 133);background-color:rgb(226 248 243);">OK</kbd>`;
            break;
        case STATUSBADGES.KO:
            statusCell.innerHTML = `<kbd style="color:rgb(179 49 90);background-color:rgb(253 226 235);">KO</kbd>`;

            break;
        case STATUSBADGES.CHECK:
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

function refreshTables() {
	goTopPage();
    const checkertbody = iframeDoc.getElementById(`${ADAGIOTABSNAME.CHECKER.toLowerCase().replace(' ', '-')}-tbody`);
    const checkeradunits = iframeDoc.getElementById(`${ADAGIOTABSNAME.ADUNITS.toLowerCase().replace(' ', '-')}-tbody`);
    const checkerconsents = iframeDoc.getElementById(`${ADAGIOTABSNAME.CONSENTS.toLowerCase().replace(' ', '-')}-tbody`);
    checkertbody.innerHTML = '';
    checkeradunits.innerHTML = '';
    checkerconsents.innerHTML = '';
    check();
}

function displayAdunits(eyeButton) {

    // <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z" fill="#000000"></path> </g></svg>
    adagioAdUnits.forEach(adagioAdUnit => {
        for (const bid in adagioAdUnit.bids) {
            const adUnitElementId = adagioAdUnit.bids[bid].params['adUnitElementId'];
            const originalDiv = window.document.getElementById(adUnitElementId);
            // Create a new div element
            const newDiv = window.document.createElement("div");
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
    closeLink.addEventListener("click", () => {
        dialog.remove();
    });

    const paragraph = iframeDoc.createElement('p');
    paragraph.innerHTML = `<pre><code class="language-json">${JSON.stringify(bid, null, 2)}</code></pre>`;

    article.appendChild(header);
    header.appendChild(closeLink);
    article.appendChild(paragraph);
    dialog.appendChild(article);
    iframeDoc.body.appendChild(dialog);
}

function updateManagerFilters(params) {

    ADAGIOPARAMS.ORGANIZATIONID = params.organizationId
    ADAGIOPARAMS.SITE = params.site;

    let managerURL = 'https://app.adagio.io/';
    if (ADAGIOPARAMS.ORGANIZATIONID !== null) {
        managerURL += `publishers/${ADAGIOPARAMS.ORGANIZATIONID}/`;
        if (ADAGIOPARAMS.SITE !== null) {
            managerURL += `dashboards/41?filters=inventoryWebsiteName=${ADAGIOPARAMS.SITE};`
        }
    }

    // build id name
    const tabName = ADAGIOTABSNAME.MANAGER.toLowerCase().replace(' ', '-');
    const managerIframe = iframeDoc.getElementById(`${tabName}-iframe`);
    managerIframe.setAttribute('src', managerURL);
}

/*************************************************************************************************************************************************************************************************************************************
 * PBJS functions
 ************************************************************************************************************************************************************************************************************************************/

function check() {
    checkPrebidVersion();
    checkAdagioModule();
    checkAdagioLocalStorage();
    checkAdagioAdUnitParams();
    checkSupplyChainObject();
    checkAdagioCMP();
    checkConsentMetadata();
}

function checkPrebidVersion() {
    // Look for pbjs object (pbjs, hubjs, etc...)
    pbjsGlobals = window._pbjsGlobals;
    // To add: getGlobal() => https://github.com/prebid/Prebid.js/pull/9568
    if (pbjsGlobals === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.PREBID, `<code>window._pbjsGlobals</code>: <code>${pbjsGlobals}</code>`);
    } else {
        // Sometimes, websites deal with multiple Prebids. If there's a pbjs global, use it in priority.
        appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.PREBID, `<code>window._pbjsGlobals</code>: <code>${pbjsGlobals}</code>`);
        prebidObject = window[pbjsGlobals.includes('pbjs') ? 'pbjs' : pbjsGlobals[0]];
        if (typeof prebidObject.getEvents === 'function') {
            prebidEvents = prebidObject.getEvents();
        }
    }
}

function checkAdagioModule() {
    // Gets ADAGIO adapter object
    adagioAdapter = window.ADAGIO;
    // Checks if found
    if (adagioAdapter === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ADAPTER, `<code>window.ADAGIO</code>: <code>${window.ADAGIO}</code>`);
    } else {
        appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.ADAPTER, `<code>${JSON.stringify(adagioAdapter.versions)}</code>`);
    }
}

function checkAdagioLocalStorage() {

    // Localstorage requieres pbjs
    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.LOCALSTORAGE, ADAGIOERRORS.PREBIDNOTFOUND);
    } else {
        // Is local storage enabled?
        const deviceAccess = prebidObject.getConfig('deviceAccess');
        const localStorage = prebidObject.bidderSettings;

        if (localStorage.standard?.storageAllowed) {
            appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.LOCALSTORAGE, '<code>bidderSettings.standard.storageAllowed</code> set to <code>true</code>');
        } else if (localStorage.adagio?.storageAllowed) {
            appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.LOCALSTORAGE, '<code>bidderSettings.adagio.storageAllowed</code> set to <code>true</code>');
        } else if (localStorage.adagio?.storageAllowed === false) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.LOCALSTORAGE, '<code>bidderSettings.adagio.storageAllowed</code> set to <code>false</code>');
        } else if (deviceAccess === true) {
            appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.LOCALSTORAGE, 'Check network for local storage (<code>deviceAccess</code> set to <code>true</code>)');
        } else if (parseInt(prebidObject.version.charAt(1)) < 7) {
            appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.LOCALSTORAGE, 'Prebid version lower than <code>7</code>');
        } else {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.LOCALSTORAGE, 'Localstorage not found. If detected on network, contact dev!');
        }
    }
}

function checkAdagioAdUnitParams() {

    // Adunits requieres pbjs
    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ADUNITS, ADAGIOERRORS.PREBIDNOTFOUND);
    } else {
        // Gets bidrequest arguments
        prebidBidRequested = prebidEvents.filter(e => e.eventType === 'bidRequested').map(e => e.args);
        // Gets list of bidders out of bidrequested
        prebidBidders = [...new Set(prebidBidRequested.map(e => e.bidderCode))].sort();
        // Gets flat list of bids
        prebidBids = prebidBidRequested.map(e => e.bids).flat();
        // Gets the Adagio bids requested
        prebidAdagioBidRequested = prebidBids.filter(e => e.bidder.toLowerCase().includes('adagio'));
        // Fill the Adunits table with all the requested bids
        appendAdUnitsRow(prebidBidders, prebidBids);
        // Find the params for Adagio adUnits and update manager URL
        prebidAdagioParams = prebidAdagioBidRequested.map(e => e.params);
        if (prebidAdagioParams.length !== 0) updateManagerFilters(prebidAdagioParams[0]);

        // Find every adUnitsCode declared through bid requested
        prebidAdUnitsCode = new Set();
        const bidRequested = prebidBidRequested.map(e => e.bids);
        for (const bid of bidRequested) {
            for (const adUnit of bid) {
                prebidAdUnitsCode.add(adUnit.adUnitCode);
            }
        }
        // Find adUnitsCodes found in Adagio bid requested
        prebidAdagioAdUnitsCode = prebidAdagioBidRequested.map(e => e.adUnitCode);
        // Find adUnitsCode found in ADAGIO object (adCall received)
        let adagioAdUnitsCode = '';
        if (adagioAdapter !== undefined) adagioAdUnitsCode = adagioAdapter.adUnits;
        if (adagioAdapter !== undefined) adagioPbjsAdUnitsCode = adagioAdapter.pbjsAdUnits.map(e => e.code);

        const totalPrebidAdUnitsCode = prebidAdUnitsCode.size;
        const totalPrebidAdagioAdUnitsCode = prebidAdagioAdUnitsCode.length;
        const totalAdagioAdUnitsCode = adagioAdUnitsCode.length;
        const totalAdagioPbjsAdUnitsCode = adagioPbjsAdUnitsCode.length;
        console.log(totalPrebidAdUnitsCode + ', ' + totalPrebidAdagioAdUnitsCode + ', ' + totalAdagioAdUnitsCode + ', ' + totalAdagioPbjsAdUnitsCode);
        console.log(prebidAdUnitsCode);
        console.log(prebidAdagioAdUnitsCode);
        console.log(adagioAdUnitsCode);
        console.log(adagioPbjsAdUnitsCode);

        if (totalPrebidAdUnitsCode === 0) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ADUNITS, `<kbd>${totalPrebidAdUnitsCode}</kbd> adUnits(s) found`);
        } else if (totalPrebidAdUnitsCode > 0 && totalPrebidAdagioAdUnitsCode === 0) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ADUNITS, `Adagio called for <kbd>${totalPrebidAdagioAdUnitsCode}</kbd> adUnit(s) out of <kbd>${totalPrebidAdUnitsCode}</kbd> adUnits(s) found`);
        } else if (totalPrebidAdUnitsCode > 0 && totalPrebidAdagioAdUnitsCode > 0) {
            if (totalPrebidAdUnitsCode > totalPrebidAdagioAdUnitsCode) appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.ADUNITS, `Adagio called for <kbd>${totalPrebidAdagioAdUnitsCode}</kbd> adUnit(s) out of <kbd>${totalPrebidAdUnitsCode}</kbd> adUnits(s) found`);
            else appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.ADUNITS, `Adagio called for <kbd>${totalPrebidAdagioAdUnitsCode}</kbd> adUnit(s) out of <kbd>${totalPrebidAdUnitsCode}</kbd> adUnits(s) found`);
        }
    }
}

function checkSupplyChainObject() {

    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, 'Supply chain object', ADAGIOERRORS.PREBIDNOTFOUND);
        appendConsentsRow(STATUSBADGES.KO, 'Supply chain object', ADAGIOERRORS.PREBIDNOTFOUND);
        return;
    } else if (typeof prebidObject.getEvents !== 'function') {
        appendCheckerRow(STATUSBADGES.KO, 'Supply chain object', `<code>${pbjsGlobals}.getEvents()</code> not a function`);
        appendConsentsRow(STATUSBADGES.KO, 'Supply chain object', `<code>${pbjsGlobals}.getEvents()</code> not a function`);
        return;
    }
    // Find the first Adagio bidRequested event with an SCO
    const adagioBid = prebidEvents
        .filter(e => e.eventType === 'bidRequested' && e.args.bidderCode.toLowerCase().includes('adagio'))
        .map(e => e.args.bids)
        .flat()
        .find(r => r.schain)
    if (adagioBid !== undefined) {
        appendCheckerRow(STATUSBADGES.OK, 'Supply chain object', 'SCO found');
        appendConsentsRow(STATUSBADGES.OK, 'Supply chain object', `<code>${JSON.stringify(adagioBid.schain)}</code>`);
    } else {
        appendCheckerRow(STATUSBADGES.CHECK, 'Supply chain object', 'If website is owned and managed, no SCO');
        appendConsentsRow(STATUSBADGES.CHECK, 'Supply chain object', 'If website is owned and managed, no SCO');
    }
}

function checkAdagioCMP() {
    if (typeof window.__tcfapi !== 'function') {
        appendCheckerRow(STATUSBADGES.KO, 'Consent Management Platform', '<code>window.__tcfapi</code> function is not defined');
        appendConsentsRow(STATUSBADGES.KO, 'Consent Management Platform', '<code>window.__tcfapi</code> function is not defined');
        return;
    }
    // Gives the Consent Management strings values
    window.__tcfapi('getTCData', 2, (tcdata, success) => {
        const cmpAdagioBidders = new Map();
        cmpAdagioBidders.set(617, 'Adagio');
        cmpAdagioBidders.set(58, '33Across');
        cmpAdagioBidders.set(253, 'Improve Digital');
        cmpAdagioBidders.set(10, 'Index Exchange');
        cmpAdagioBidders.set(285, 'Freewheel');
        cmpAdagioBidders.set(241, 'OneTag');
        cmpAdagioBidders.set(69, 'OpenX');
        cmpAdagioBidders.set(76, 'Pubmatic');
        cmpAdagioBidders.set(52, 'Rubicon');
        cmpAdagioBidders.set(45, 'Smart Adserver');
        cmpAdagioBidders.set(13, 'Sovrn');
        cmpAdagioBidders.set(25, 'Yahoo');

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
            appendCheckerRow(STATUSBADGES.OK, 'Consent Management Platform', 'All consents <code>true</code>');
            appendConsentsRow(STATUSBADGES.OK, 'Consent Management Platform', stringResult);
        } else if (!adagioFound) {
            appendCheckerRow(STATUSBADGES.KO, 'Consent Management Platform', 'Adagio consent <code>false</code>');
            appendConsentsRow(STATUSBADGES.KO, 'Consent Management Platform', stringResult);
        } else {
            appendCheckerRow(STATUSBADGES.CHECK, 'Consent Management Platform', 'One or many consents <code>false</code>');
            appendConsentsRow(STATUSBADGES.CHECK, 'Consent Management Platform', stringResult);
        }
    });
}

function checkConsentMetadata() {
    if (prebidObject === undefined) {
        appendConsentsRow(STATUSBADGES.KO, 'Consent metadata', ADAGIOERRORS.PREBIDNOTFOUND);
        return;
    } else if (typeof prebidObject.getConsentMetadata !== 'function') {
        appendCheckerRow(STATUSBADGES.KO, 'Consent metadata', `<code>${pbjsGlobals}.getConsentMetadata()</code> not a function`);
        appendConsentsRow(STATUSBADGES.KO, 'Consent metadata', `<code>${pbjsGlobals}.getConsentMetadata()</code> not a function`);
        return;
    }

    let consentMetadata = prebidObject.getConsentMetadata();

    if (consentMetadata !== undefined) {
        appendCheckerRow(STATUSBADGES.OK, 'Consent metadata', 'Consent metadata found');
        appendConsentsRow(STATUSBADGES.OK, 'Consent metadata', `<code>${JSON.stringify(consentMetadata)}</code>`);
    }

    const adagioBid = prebidObject.getEvents()
        .filter(e => e.eventType === 'bidRequested' && e.args.bidderCode.toLowerCase().includes('adagio'))
        .map(e => e.args)
        .flat()
        .find(r => r.gdprConsent)

    if (adagioBid !== undefined) {
        appendCheckerRow(STATUSBADGES.OK, 'GDPR consent string', `GDPR string found`);
        appendConsentsRow(STATUSBADGES.OK, 'GDPR consent string', `<code>${JSON.stringify(adagioBid.gdprConsent)}</code>`);
    } else {
        appendCheckerRow(STATUSBADGES.KO, 'GDPR consent string', `GDPR string not found. If consent metadata GDRP true, contact dev`);
        appendConsentsRow(STATUSBADGES.KO, 'GDPR consent string', 'GDPR string not found. If consent metadata GDRP true, contact dev');
    }
}

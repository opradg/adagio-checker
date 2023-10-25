/*************************************************************************************************************************************************************************************************************************************
 * Global variables
 ************************************************************************************************************************************************************************************************************************************/
// Overlay iframe html object, and iframe document
let overlayFrame = undefined;
let buttonFrame = undefined;
let overlayFrameDoc = undefined;
let buttonFrameDoc = undefined;
// Overlay current state
let overlayVisible = true;
// Prebid.js object, and window.ADAGIO object and events
let prebidObject = undefined;
let prebidWrappers = []; // arrays of [wrapper, window] : window[wrapper]
let prebidWrapper = undefined;
let adagioAdapter = undefined;
// Prebid events, bids and adUnits
let prebidEvents = undefined;
let prebidBidsRequested = undefined;
let prebidAdagioBidsRequested = undefined;
let prebidBids = undefined;
let prebidBidders = undefined;
let prebidAdUnitsCodes = undefined;
let prebidAdagioAdUnitsCodes = undefined;
let adagioBidsRequested = undefined;
let adagioPbjsAdUnitsCode = [];
let prebidAdagioParams = undefined;
let totalPrebidAdUnitsCodes = 0;
let totalPrebidAdagioAdUnitsCode = 0;
let totalAdagioAdUnitsCodes = 0;
let totalAdagioPbjsAdUnitsCodes = 0;
let organizationIds = [];
// Active tab (from button html element)
let activeTab = undefined;
// Variables for draggable iframe
let isDragging = false;

/*************************************************************************************************************************************************************************************************************************************
 * Enums
 ************************************************************************************************************************************************************************************************************************************/

const ADAGIOSVG = Object.freeze({
    LOGO: '<svg viewBox="0 0 101 92" style="height:1.5em;"><path d="M97 88.598H84.91l-33.473-72.96-.817-1.707-6.398 13.836 28.143 60.916h-12.2l-.106-.237-21.82-47.743-6.428 13.9 15.978 34.08H35.59l-9.802-21.056-9.698 20.97H4L43.109 4H57.89L97 88.598Z"></path></svg>',
    MANAGER: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"></path></svg>',
    CHECKER: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M19 15v4H5v-4h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 18.5c-.82 0-1.5-.67-1.5-1.5s.68-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19 5v4H5V5h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 8.5c-.82 0-1.5-.67-1.5-1.5S6.18 5.5 7 5.5s1.5.68 1.5 1.5S7.83 8.5 7 8.5z"></path></svg>',
    ADUNITS: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM7 4V3h10v1H7zm0 14V6h10v12H7zm0 3v-1h10v1H7z"></path><path d="M16 7H8v2h8V7z"></path></svg>',
    CONSENTS: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M13.17 4 18 8.83V20H6V4h7.17M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-2 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.99 0-1.93.21-2.78.58C8.48 15.9 8 16.62 8 17.43V18h8v-.57z"></path></svg>',
    PREBID: '<svg viewBox="0 0 24 24" style="height:1.2em"><g><g><g><path d="M19.973 4.724H.746A.743.743 0 0 1 0 3.978c0-.414.331-.746.746-.746H19.89c.415 0 .746.332.746.746.083.414-.248.746-.663.746z"/></g><g><path d="M27.35 8.868H4.391a.743.743 0 0 1-.745-.746c0-.414.331-.746.745-.746H27.35c.415 0 .746.332.746.746a.743.743 0 0 1-.746.746z"/></g><g><path d="M25.029 21.3H2.072a.743.743 0 0 1-.746-.747c0-.414.332-.745.746-.745h22.957c.414 0 .746.331.746.745 0 .332-.332.746-.746.746z"/></g><g><path d="M17.238 13.012H2.984a.743.743 0 0 1-.746-.746c0-.415.331-.746.746-.746h14.254c.415 0 .746.331.746.746a.743.743 0 0 1-.746.746z"/></g><g><path d="M23.371 17.155H7.045a.743.743 0 0 1-.746-.745c0-.415.331-.746.746-.746H23.37c.415 0 .746.331.746.746 0 .331-.331.745-.746.745z"/></g></g></g></svg>',
    EYEOPENED: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M6.30147 15.5771C4.77832 14.2684 3.6904 12.7726 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C14.1843 6 16.1261 7.07185 17.6986 8.42294C19.2218 9.73158 20.3097 11.2274 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18C9.81574 18 7.87402 16.9282 6.30147 15.5771ZM12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C2.00757 13.8624 3.23268 15.5772 4.99812 17.0941C6.75717 18.6054 9.14754 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C21.9925 10.1376 20.7674 8.42276 19.002 6.90595C17.2429 5.39462 14.8525 4 12 4ZM10 12C10 10.8954 10.8955 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8955 14 10 13.1046 10 12ZM12 8C9.7909 8 8.00004 9.79086 8.00004 12C8.00004 14.2091 9.7909 16 12 16C14.2092 16 16 14.2091 16 12C16 9.79086 14.2092 8 12 8Z"></path></svg>',
    EYECLOSED: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z"></path></svg>',
    DEBUGGING: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M4.6 15c-.9-2.6-.6-4.6-.5-5.4 2.4-1.5 5.3-2 8-1.3.7-.3 1.5-.5 2.3-.6-.1-.3-.2-.5-.3-.8h2l1.2-3.2-.9-.4-1 2.6h-1.8C13 4.8 12.1 4 11.1 3.4l2.1-2.1-.7-.7L10.1 3c-.7 0-1.5 0-2.3.1L5.4.7l-.7.7 2.1 2.1C5.7 4.1 4.9 4.9 4.3 6H2.5l-1-2.6-.9.4L1.8 7h2C3.3 8.3 3 9.6 3 11H1v1h2c0 1 .2 2 .5 3H1.8L.6 18.3l.9.3 1-2.7h1.4c.4.8 2.1 4.5 5.8 3.9-.3-.2-.5-.5-.7-.8-2.9 0-4.4-3.5-4.4-4zM9 3.9c2 0 3.7 1.6 4.4 3.8-2.9-1-6.2-.8-9 .6.7-2.6 2.5-4.4 4.6-4.4zm14.8 19.2l-4.3-4.3c2.1-2.5 1.8-6.3-.7-8.4s-6.3-1.8-8.4.7-1.8 6.3.7 8.4c2.2 1.9 5.4 1.9 7.7 0l4.3 4.3c.2.2.5.2.7 0 .2-.2.2-.5 0-.7zm-8.8-3c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1 5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1z"/><path fill="none" d="M0 0h24v24H0z"/></svg>',
    REFRESH: '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>',
    INFO: '<svg viewBox="0 0 416.979 416.979" style="height:1.2em;"><path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path></svg>'
});

const ADAGIOTABSNAME = Object.freeze({
    MANAGER: 'Manager',
    CHECKER: 'Checker',
    ADUNITS: 'Adunits',
    CONSENTS: 'Consents',
    BUYERUIDS: 'BuyerUids'
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
    ANALYTICS: 'Adagio analytics',
    LOCALSTORAGE: 'Localstorage',
    ADUNITS: 'Adunits',
    DUPLICATED: 'Duplicated adUnitCode',
    USERSYNC: 'Usersync',
    FLOORS: 'Floors price module',
    CURRENCY: 'Currency module',
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

const ADAGIOLINKS = {
    WEBSITE: 'https://app.adagio.io/',
    MANAGER: 'https://app.adagio.io/'
};

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
getPrebidWrappers();
buildOverlayHtml();
buildAdagioButton();
createManagerDiv();
createCheckerDiv();
createAdUnitsDiv();
createConsentsDiv();
// createBuyerUidsDiv();
makeIframeDraggable();
check();

/*************************************************************************************************************************************************************************************************************************************
 * HTML functions
 ************************************************************************************************************************************************************************************************************************************/

function createOverlay() {

    // create a new button element
    buttonFrame = window.document.createElement('iframe');
    buttonFrame.style.position = "fixed";
    buttonFrame.style.top = "10px";
    buttonFrame.style.right = "10px";
    buttonFrame.style.width = "45px";
    buttonFrame.style.height = "45px";
    buttonFrame.style.zIndex = "999999999";
    buttonFrame.style.backgroundColor = "rgb(47, 55, 87)";
    buttonFrame.style.border = "none";
    buttonFrame.style.borderRadius = "10px";
    buttonFrame.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
    buttonFrame.style.display = "block";
    window.document.body.appendChild(buttonFrame);

    // create a new iframe element
    overlayFrame = window.document.createElement('iframe');
    overlayFrame.classList.add('adagio-overlay');
    overlayFrame.style.position = "fixed";
    overlayFrame.style.top = "10px";
    overlayFrame.style.left = "10px";
    overlayFrame.style.width = "700px";
    overlayFrame.style.height = "450px";
    overlayFrame.style.zIndex = "999999999";
    overlayFrame.style.backgroundColor = "transparent";
    overlayFrame.style.border = "none";
    overlayFrame.style.borderRadius = "10px";
    overlayFrame.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
    overlayFrame.style.resize = 'both';
    overlayFrame.style.display = "block";
    window.document.body.appendChild(overlayFrame);

    if (!overlayVisible) overlayFrame.style.display = 'none';
    else buttonFrame.style.opacity = '0.4';

    // get the iframe document objects
    buttonFrameDoc = buttonFrame.contentDocument || buttonFrame.contentWindow.document;
    overlayFrameDoc = overlayFrame.contentDocument || overlayFrame.contentWindow.document;

    // set the background color
    // overlayFrameDoc.body.style.setProperty('--primary', 'rgb(246, 247, 248)');
    // overlayFrameDoc.body.style.setProperty('--primary-hover', 'rgb(246, 247, 248)');
}

function getPrebidWrappers() {
    // To add: getGlobal() => https://github.com/prebid/Prebid.js/pull/9568
    // Look for pbjs object (pbjs, hubjs, etc...)
    if (window._pbjsGlobals !== undefined && window._pbjsGlobals !== null) {
        for (let wrapper of window._pbjsGlobals) {
            prebidWrappers.push([wrapper, window]);
        }
        prebidWrapper = prebidWrappers[0];
        prebidObject = prebidWrapper[1][prebidWrapper[0]];
    }    
    // In some configurations, the wrapper is inside iframes
    else {
        const iframes = document.getElementsByTagName("iframe");
        for (let iframe of iframes) {
            try {
                const prebidIframeDoc = iframe.contentWindow;
                if (prebidIframeDoc._pbjsGlobals !== undefined) {
                    for (let wrapper of prebidIframeDoc._pbjsGlobals) {
                        prebidWrappers.push([wrapper, prebidIframeDoc]);
                    }
                }
            }
            catch (error) {
                console.error(error);
                // Expected output: ReferenceError: nonExistentFunction is not defined
                // (Note: the exact output may be browser-dependent)
            }
        }
        if (prebidWrappers.length !== 0) {
            prebidWrapper = prebidWrappers[0];
            prebidObject = prebidWrapper[1][prebidWrapper[0]];
        }
    }
}

function buildOverlayHtml() {

    // append pico style
    const picoStyle = overlayFrameDoc.createElement('link');
    picoStyle.setAttribute('rel', 'stylesheet');
    picoStyle.setAttribute('href', 'https://unpkg.com/@picocss/pico@1.5.7/css/pico.min.css');

    // create navigation element
    const nav = buildNavBar();
    nav.appendChild(buildAdagioLogo());

    // create second unordered list inside navigation
    const ul = overlayFrameDoc.createElement('ul');
    ul.appendChild(buildTabButton(ADAGIOTABSNAME.MANAGER, ADAGIOSVG.MANAGER, false));
    ul.appendChild(buildTabButton(ADAGIOTABSNAME.CHECKER, ADAGIOSVG.CHECKER, true));
    ul.appendChild(buildTabButton(ADAGIOTABSNAME.ADUNITS, ADAGIOSVG.ADUNITS, false));
    ul.appendChild(buildTabButton(ADAGIOTABSNAME.CONSENTS, ADAGIOSVG.CONSENTS, false));
    // ul.appendChild(buildTabButton(ADAGIOTABSNAME.BUYERUIDS, ADAGIOSVG.CONSENTS, false));
    ul.appendChild(buildPrebidButton('Prebid versions detected', ADAGIOSVG.PREBID, true));
    // ul.appendChild(buildOverlayButton('Show adunits overlay', ADAGIOSVG.EYECLOSED, false));
    ul.appendChild(buildDebuggingButton('Enable debbug mode and reload page', ADAGIOSVG.DEBUGGING, true));
    ul.appendChild(buildRefreshButton('Refresh', ADAGIOSVG.REFRESH, true));

    // append unordered lists to navigation
    nav.appendChild(ul);

    // append main containers to iframeDoc body
    overlayFrameDoc.head.appendChild(picoStyle);
    overlayFrameDoc.body.appendChild(nav);
}

function buildNavBar() {
    // create navigation element
    const nav = overlayFrameDoc.createElement('nav');
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
    // button to hide and show the iframe
    const a = buttonFrameDoc.createElement('a');
    a.innerHTML = ADAGIOSVG.LOGO;
    a.style.fill = 'white';
    buttonFrameDoc.body.appendChild(a);

    buttonFrameDoc.querySelector('html').style.cursor = 'pointer';
    buttonFrameDoc.querySelector('html').addEventListener('click', () => {
        if (overlayVisible) {
            overlayVisible = false;
            overlayFrame.style.display = 'none';
            buttonFrame.style.opacity = '';
        }
        else {
            overlayVisible = true;
            overlayFrame.style.display = '';
            buttonFrame.style.opacity = '0.4';
        }
    });
}

function buildAdagioLogo() {
    // create first unordered list inside navigation
    const ul = overlayFrameDoc.createElement('ul');
    const li = overlayFrameDoc.createElement('li');
    const a = overlayFrameDoc.createElement('a');
    a.setAttribute('href', ADAGIOLINKS.WEBSITE);
    a.setAttribute('target', '_blank');
    a.innerHTML = ADAGIOSVG.LOGO;
    li.appendChild(a);
    ul.appendChild(li);
    return ul;
}

function buildTabButton(name, svg, isactive) {

    const tabName = name.toLowerCase().replace(' ', '-');
    const li = overlayFrameDoc.createElement('li');
    const tabButton = overlayFrameDoc.createElement('button');
    tabButton.setAttribute('id', `${tabName}-button`)
    tabButton.innerHTML = svg;
    tabButton.innerHTML += ` ${name} `;
    tabButton.addEventListener('click', () => switchTab(tabName));
    if (!isactive) tabButton.classList.add('outline');
    else activeTab = tabName;
    tabButton.style.padding = '0.3em';
    tabButton.style.textTransform = 'uppercase';
    tabButton.style.fontSize = '0.85em';
    li.appendChild(tabButton);
    return li;
}

function buildPrebidButton(name, svg, isactive) {

    // Get the number of wrapper found
    let nbWrappers = prebidWrappers.length;

    // As website can use different wrapper for Prebid, this button allows to switch between them
    const li = overlayFrameDoc.createElement('li');
    const button = overlayFrameDoc.createElement('button');
    button.setAttribute('title', name);
    // Disabled button if no wrapper found
    if (!isactive || nbWrappers === 0) button.disabled = true;
    button.innerHTML = svg;
    button.addEventListener('click', () => displayAdunits(button));
    button.classList.add('outline');
    button.style.borderColor = 'transparent';
    button.style.position = 'relative';
    button.style.display = 'inline-block';
    button.style.padding = '0.3em';

    // If more than one wrapper, display a badge with the number of wrappers found
    const badge = overlayFrameDoc.createElement('span');
    badge.style.position = 'absolute';
    badge.style.top = '-10px';
    badge.style.right = '-10px';
    badge.style.padding = '0.5em 0.9em';
    badge.style.borderRadius = '50%';
    badge.style.fontSize = '0.6em';
    badge.style.background = COLOR.REDBACKGROUND;
    badge.style.color = COLOR.REDTEXT;
    badge.innerHTML = nbWrappers;
    // Shows number if more than 1
    if (nbWrappers < 2) badge.style.display = 'none';

    // On click, a modal appears to select the wrapper and work on the according Prebid object
    const dialog = overlayFrameDoc.createElement('dialog');
    dialog.setAttribute('open', false);
    const article = overlayFrameDoc.createElement('article');
    const header = overlayFrameDoc.createElement('header');
    const closeLink = overlayFrameDoc.createElement('a');
    closeLink.setAttribute('aria-label', 'Close');
    closeLink.classList.add('close');
    header.innerHTML = 'Prebid wrappers detected';
    const paragraph = overlayFrameDoc.createElement('p');

    // Add eventlistner to show and hide the modal
    closeLink.addEventListener("click", () => {
        dialog.setAttribute('open', false);
    });
    button.addEventListener("click", () => {
        dialog.setAttribute('open', true);
    });

    // Append elements
    li.appendChild(button);
    button.appendChild(badge);
    overlayFrameDoc.body.appendChild(dialog);
    dialog.appendChild(article);
    article.appendChild(header);
    header.appendChild(closeLink);
    article.appendChild(paragraph);

    // Fill the modal with the list Prebid wrappers found
    for (let i = 0; i < nbWrappers; i++) {
        // Create the radio button for the current wrapper item
        const item = prebidWrappers[i];
        const wrapperItem = overlayFrameDoc.createElement('div');
        const itemInput = overlayFrameDoc.createElement('input');
        itemInput.setAttribute('type', 'radio');
        itemInput.setAttribute('value', i);
        itemInput.setAttribute('name', 'radio-group'); // added the 'name' attribute
        // itemInput.setAttribute('id', `${item.replace(' ', '-')}-wrapper`)
        const itemLabel = overlayFrameDoc.createElement('label');
        itemLabel.setAttribute('for', i);
        itemLabel.innerHTML = item[0];
        if (prebidWrappers[i][1] !== window) itemLabel.innerHTML += ' (iframe)';

        // If current wrapper is the used one at the moment, check the radio
        if (prebidWrapper === item) {
            itemInput.checked = true;
        }

        itemInput.addEventListener("click", function () {
            if (itemInput.checked) {
                prebidWrapper = prebidWrappers[itemInput.value];
                prebidObject = prebidWrapper[1][prebidWrapper[0]];
                refreshTables();
            }
        });

        // Append the wrapper item
        paragraph.appendChild(wrapperItem);
        wrapperItem.appendChild(itemInput);
        wrapperItem.appendChild(itemLabel);
    }

    return li;
}

function buildOverlayButton(name, svg, isactive) {

    const li = overlayFrameDoc.createElement('li');
    const button = overlayFrameDoc.createElement('button');
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

function buildDebuggingButton(name, svg, isactive) {

    const li = overlayFrameDoc.createElement('li');
    const button = overlayFrameDoc.createElement('button');
    button.setAttribute('title', name);
    if (!isactive) button.disabled = true;
    button.innerHTML = svg;
    button.addEventListener('click', () => loadDebuggingMode());
    button.classList.add('outline');
    button.style.borderColor = 'transparent';
    button.style.padding = '0.3em';
    li.appendChild(button);
    return li;
}

function buildRefreshButton(name, svg, isactive) {

    const li = overlayFrameDoc.createElement('li');
    const button = overlayFrameDoc.createElement('button');
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

function createManagerDiv() {
    // build id name
    const tabName = ADAGIOTABSNAME.MANAGER.toLowerCase().replace(' ', '-');

    // create main container element
    const mainContainer = overlayFrameDoc.createElement('div');
    mainContainer.setAttribute('id', `${tabName}-container`);
    mainContainer.style.display = "none";
    mainContainer.style.paddingTop = '3rem';
    mainContainer.style.paddingBottom = '0';

    // create the iframe
    const managerIframe = overlayFrameDoc.createElement('iframe');
    managerIframe.setAttribute('id', `${tabName}-iframe`);
    managerIframe.setAttribute('src', ADAGIOLINKS.MANAGER);
    managerIframe.setAttribute('aria-busy', 'true')
    managerIframe.style.width = '100%';
    managerIframe.style.height = '100%';

    // append the container to the body
    mainContainer.appendChild(managerIframe);
    overlayFrameDoc.body.appendChild(mainContainer);
}

function createCheckerDiv() {
    // build id name
    const tabName = ADAGIOTABSNAME.CHECKER.toLowerCase().replace(' ', '-');

    // create main container element
    const mainContainer = overlayFrameDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', `${tabName}-container`);
    mainContainer.style.paddingTop = '5rem';
    mainContainer.style.paddingBottom = '0';

    // create headings container
    const headings = overlayFrameDoc.createElement('div');
    headings.classList.add('headings');

    const h2 = overlayFrameDoc.createElement('h2');
    h2.textContent = 'Integration checker';
    const h3 = overlayFrameDoc.createElement('h3');
    h3.textContent = 'Expectations for a proper Adagio integration';
    headings.appendChild(h2);
    headings.appendChild(h3);

    // create the alert article and text
    const alertContainer = overlayFrameDoc.createElement('article');
    alertContainer.style.padding = '1em';
    alertContainer.style.marginLeft = '';
    alertContainer.style.marginRight = '';
    alertContainer.style.marginTop = '1em';
    alertContainer.style.marginBottom = '1em';
    alertContainer.style.color = COLOR.YELLOWTEXT;
    alertContainer.style.backgroundColor = COLOR.YELLOWBACKGROUND;

    const alertTextDiv = overlayFrameDoc.createElement('div');
    alertTextDiv.setAttribute('id', `${tabName}-alert`);
    alertContainer.appendChild(alertTextDiv);

    // create table element
    const table = overlayFrameDoc.createElement('table');
    const thead = overlayFrameDoc.createElement('thead');
    const tr = overlayFrameDoc.createElement('tr');
    const th1 = overlayFrameDoc.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.textContent = 'Status';
    const th2 = overlayFrameDoc.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.textContent = 'Name';
    const th3 = overlayFrameDoc.createElement('th');
    th3.setAttribute('scope', 'col');
    th3.textContent = 'Details';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);
    const tbody = overlayFrameDoc.createElement('tbody');
    tbody.setAttribute('id', `${tabName}-tbody`);
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(alertContainer);
    mainContainer.appendChild(table);

    // append the container to the body
    overlayFrameDoc.body.appendChild(mainContainer);
}

function createAdUnitsDiv() {
    // build id name
    const tabName = ADAGIOTABSNAME.ADUNITS.toLowerCase().replace(' ', '-');

    // create main container element
    const mainContainer = overlayFrameDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', `${tabName}-container`);
    mainContainer.style.display = "none";
    mainContainer.style.paddingTop = '5rem';
    mainContainer.style.paddingBottom = '0';

    // create headings container
    const headings = overlayFrameDoc.createElement('div');
    headings.classList.add('headings');
    const h2 = overlayFrameDoc.createElement('h2');
    h2.textContent = 'AdUnits';
    const h3 = overlayFrameDoc.createElement('h3');
    h3.textContent = 'Bid requested for each adUnit and by bidders';
    headings.appendChild(h2);
    headings.appendChild(h3);

    // create the alert article
    const alertContainer = overlayFrameDoc.createElement('article');
    alertContainer.style.padding = '1em';
    alertContainer.style.marginLeft = '';
    alertContainer.style.marginRight = '';
    alertContainer.style.marginTop = '1em';
    alertContainer.style.marginBottom = '1em';
    alertContainer.style.color = COLOR.YELLOWTEXT;
    alertContainer.style.backgroundColor = COLOR.YELLOWBACKGROUND;

    const alertTextDiv = overlayFrameDoc.createElement('div');
    alertTextDiv.setAttribute('id', `${tabName}-alert`);
    alertContainer.appendChild(alertTextDiv);

    // create bidder filter
    const bidderFilter = overlayFrameDoc.createElement('details');
    bidderFilter.setAttribute('role', 'list');
    const selectFilter = overlayFrameDoc.createElement('summary');
    selectFilter.setAttribute('aria-haspopup', 'listbox');
    selectFilter.textContent = 'Filter requested bids by bidders';
    const ulFilter = overlayFrameDoc.createElement('ul');
    ulFilter.setAttribute('role', 'listbox');
    ulFilter.setAttribute('id', 'bidderFilter');
    bidderFilter.appendChild(selectFilter);
    bidderFilter.appendChild(ulFilter);

    // create table element
    const table = overlayFrameDoc.createElement('table');
    const thead = overlayFrameDoc.createElement('thead');
    const tr = overlayFrameDoc.createElement('tr');
    const th1 = overlayFrameDoc.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.textContent = 'Code';
    const th2 = overlayFrameDoc.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.textContent = 'Mediatypes';
    const th3 = overlayFrameDoc.createElement('th');
    th3.setAttribute('scope', 'col');
    th3.textContent = 'Bidder params';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);

    const tbody = overlayFrameDoc.createElement('tbody');
    tbody.setAttribute('id', `${tabName}-tbody`);
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(alertContainer);
    mainContainer.appendChild(bidderFilter);
    mainContainer.appendChild(table);

    // append the container to the body
    overlayFrameDoc.body.appendChild(mainContainer);
}

function createConsentsDiv() {
    // build id name
    const tabName = ADAGIOTABSNAME.CONSENTS.toLowerCase().replace(' ', '-');

    // create main container element
    const mainContainer = overlayFrameDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', `${tabName}-container`);
    mainContainer.style.display = "none";
    mainContainer.style.paddingTop = '5rem';
    mainContainer.style.paddingBottom = '0';

    // create headings container
    const headings = overlayFrameDoc.createElement('div');
    headings.classList.add('headings');

    const h2 = overlayFrameDoc.createElement('h2');
    h2.textContent = 'Consents';
    const h3 = overlayFrameDoc.createElement('h3');
    h3.textContent = 'Consents managemement platform for Adagio partners';
    headings.appendChild(h2);
    headings.appendChild(h3);

    // create table element
    const table = overlayFrameDoc.createElement('table');
    const thead = overlayFrameDoc.createElement('thead');
    const tr = overlayFrameDoc.createElement('tr');
    const th1 = overlayFrameDoc.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.textContent = 'Partner';
    const th2 = overlayFrameDoc.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.textContent = 'Consent';
    const th3 = overlayFrameDoc.createElement('th');
    th3.setAttribute('scope', 'col');
    th3.textContent = 'Legitimate';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);
    const tbody = overlayFrameDoc.createElement('tbody');
    tbody.setAttribute('id', `${tabName}-tbody`);
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(table);

    // append the container to the body
    overlayFrameDoc.body.appendChild(mainContainer);
}

function createBuyerUidsDiv() {

    // build id name
    const tabName = ADAGIOTABSNAME.BUYERUIDS.toLowerCase().replace(' ', '-');

    // create main container element
    const mainContainer = overlayFrameDoc.createElement('main');
    mainContainer.classList.add('container-fluid');
    mainContainer.setAttribute('id', `${tabName}-container`);
    mainContainer.style.display = "none";
    mainContainer.style.paddingTop = '5rem';
    mainContainer.style.paddingBottom = '0';

    // create headings container
    const headings = overlayFrameDoc.createElement('div');
    headings.classList.add('headings');

    const h2 = overlayFrameDoc.createElement('h2');
    h2.textContent = 'Consents';
    const h3 = overlayFrameDoc.createElement('h3');
    h3.textContent = 'User synchronization for Adagio partners';
    headings.appendChild(h2);
    headings.appendChild(h3);

    // create table element
    const table = overlayFrameDoc.createElement('table');
    const thead = overlayFrameDoc.createElement('thead');
    const tr = overlayFrameDoc.createElement('tr');
    const th1 = overlayFrameDoc.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.textContent = 'Partner';
    const th2 = overlayFrameDoc.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.textContent = 'Uids';
    const th3 = overlayFrameDoc.createElement('th');
    th3.setAttribute('scope', 'col');
    th3.textContent = 'Sync';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);
    const tbody = overlayFrameDoc.createElement('tbody');
    tbody.setAttribute('id', `${tabName}-tbody`);
    table.appendChild(thead);
    table.appendChild(tbody);

    // append navigation, headings, and table to main container
    mainContainer.appendChild(headings);
    mainContainer.appendChild(table);

    // append the container to the body
    overlayFrameDoc.body.appendChild(mainContainer);
}

function switchTab(tabName) {
    // switch visible div and button outline
    if (tabName !== activeTab) {
        goTopPage();
        const activeTabButton = overlayFrameDoc.getElementById(`${activeTab}-button`);
        const activeTabContainer = overlayFrameDoc.getElementById(`${activeTab}-container`);
        const targetTabButton = overlayFrameDoc.getElementById(`${tabName}-button`);
        const targetTabContainer = overlayFrameDoc.getElementById(`${tabName}-container`);
        targetTabButton.classList.remove('outline');
        activeTabButton.classList.add('outline');
        targetTabContainer.style.display = "";
        activeTabContainer.style.display = "none";
        activeTab = tabName;
    }
}

function goTopPage() {
    overlayFrameDoc.body.scrollTop = 0;
}

function appendCheckerRow(status, name, details) {
    // build id name
    const tabName = ADAGIOTABSNAME.CHECKER.toLowerCase().replace(' ', '-');
    // get the tbody element
    const tableBody = overlayFrameDoc.getElementById(`${tabName}-tbody`);
    // Create the row
    const newRow = overlayFrameDoc.createElement('tr');
    // Create the cells
    const statusCell = overlayFrameDoc.createElement('td');
    const nameCell = overlayFrameDoc.createElement('td');
    const detailsCell = overlayFrameDoc.createElement('td');
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
    if (prebidAdagioBidsRequested.length > 0) adagioId = prebidAdagioBidsRequested[0].bidder;

    // build id name
    const tabName = ADAGIOTABSNAME.ADUNITS.toLowerCase().replace(' ', '-');
    // gets working element element
    const tableBody = overlayFrameDoc.getElementById(`${tabName}-tbody`);
    const alertTextDiv = overlayFrameDoc.getElementById(`${tabName}-alert`);

    // fill the article section
    alertTextDiv.innerHTML = '<small>Adunit(s) found:</small> ';
    if (prebidAdUnitsCodes !== undefined && totalPrebidAdUnitsCodes > 0) {
        for (const adUnitCode of prebidAdUnitsCodes) {
            alertTextDiv.innerHTML += `<small> <code>${adUnitCode}</code>;</small>`;
        };
    }
    else alertTextDiv.innerHTML += `<small><kbd> 0</kbd></small>`;

    // fill the table section
    bids.forEach(bid => {

        const adUnitCode = bid.adUnitCode;
        const mediaTypes = bid.mediaTypes;
        const bidderId = bid.bidder;

        // Create the row
        const newRow = overlayFrameDoc.createElement('tr');
        newRow.classList.add(`${bidderId.replace(' ', '-')}-bid`);
        // hides the row if adagio found
        if (adagioId !== '' && adagioId !== bidderId) {
            newRow.style.display = 'none';
        }

        // Create the cells
        const codeCell = overlayFrameDoc.createElement('td');
        const mediatypesCell = overlayFrameDoc.createElement('td');
        const bidderIdCell = overlayFrameDoc.createElement('td');
        const bidderParamButton = overlayFrameDoc.createElement('kbd');
        bidderParamButton.addEventListener("click", () => createBidderParamsModal(bid));
        bidderParamButton.style.cursor = 'pointer';

        codeCell.innerHTML = `<code>${adUnitCode}</code>`;
        for (const mediaType in mediaTypes) {
            mediatypesCell.innerHTML += `<code>${mediaType}</code>`;
            /*for (const size in mediaTypes[mediaType].sizes) {
                mediatypesCell.innerHTML += `<code>${JSON.stringify(mediaTypes[mediaType].sizes[size])}</code>`;
                // DEAL WITH PLAYERSIZE for VIDEO
            }*/
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
    const bidderFilter = overlayFrameDoc.getElementById('bidderFilter');

    bidders.forEach(bidder => {

        const libidder = overlayFrameDoc.createElement('li');
        const labbidder = overlayFrameDoc.createElement('label');
        const inputbidder = overlayFrameDoc.createElement('input');
        inputbidder.setAttribute('type', 'checkbox');
        inputbidder.setAttribute('id', `${bidder.replace(' ', '-')}-bidder`);
        bidderFilter.appendChild(libidder);
        libidder.appendChild(labbidder);
        labbidder.appendChild(inputbidder);
        labbidder.innerHTML += `<code>${bidder}</code>`;

        const newInput = overlayFrameDoc.getElementById(`${bidder.replace(' ', '-')}-bidder`);
        if (adagioId !== '' && adagioId !== bidder) newInput.checked = false;
        else newInput.checked = true;
        newInput.addEventListener('click', function () {
            toggleBidRow(newInput, bidder);
        });
    });
}

function toggleBidRow(inputbidder, bidder) {

    // Depending on checkbox, hide or show bidrequested for the bidder
    const bidderRows = overlayFrameDoc.getElementsByClassName(`${bidder.replace(' ', '-')}-bid`);
    for (const bidderRow of bidderRows) {
        if (inputbidder.checked === false) {
            bidderRow.style.display = 'none';
        } else {
            bidderRow.style.display = '';
        }
    }
}

function appendConsentsRow(bidderName, bidderConsent, bidderLegitimate) {

    // build id name
    const tabName = ADAGIOTABSNAME.CONSENTS.toLowerCase().replace(' ', '-');
    // get the tbody element
    const tableBody = overlayFrameDoc.getElementById(`${tabName}-tbody`);

    // Create the row
    const newRow = overlayFrameDoc.createElement('tr');

    // Create the cells
    const bidderNameCell = overlayFrameDoc.createElement('td');
    const bidderConsentCell = overlayFrameDoc.createElement('td');
    const bidderLegitimateCell = overlayFrameDoc.createElement('td');

    // Fill the cells
    bidderNameCell.innerHTML = bidderName;
    bidderConsentCell.innerHTML = bidderConsent;
    bidderLegitimateCell.innerHTML = bidderLegitimate;

    // Add the cells
    tableBody.appendChild(newRow);
    newRow.appendChild(bidderNameCell);
    newRow.appendChild(bidderConsentCell);
    newRow.appendChild(bidderLegitimateCell);
}

function loadDebuggingMode() {
    window.localStorage.setItem('ADAGIO_DEV_DEBUG',true);
    let url = window.location.href.indexOf('?pbjs_debug=true') ? window.location.href + '?pbjs_debug=true' : window.location.href;
    window.location.href = url;
}

function refreshTables() {
    goTopPage();
    const checkertbody = overlayFrameDoc.getElementById(`${ADAGIOTABSNAME.CHECKER.toLowerCase().replace(' ', '-')}-tbody`);
    const checkeradunits = overlayFrameDoc.getElementById(`${ADAGIOTABSNAME.ADUNITS.toLowerCase().replace(' ', '-')}-tbody`);
    const checkerconsents = overlayFrameDoc.getElementById(`${ADAGIOTABSNAME.CONSENTS.toLowerCase().replace(' ', '-')}-tbody`);
    checkertbody.innerHTML = '';
    checkeradunits.innerHTML = '';
    checkerconsents.innerHTML = '';
    check();
}

function displayAdunits(eyeButton) {
    /*
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z" fill="#000000"></path> </g></svg>
    */
    adagioPbjsAdUnitsCode.forEach(adagioAdUnit => {
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

    const dialog = overlayFrameDoc.createElement('dialog');
    dialog.setAttribute('open', true);

    const article = overlayFrameDoc.createElement('article');
    const header = overlayFrameDoc.createElement('header');
    header.textContent = bid.bidder;
    header.style.marginBottom = '0px';
    const closeLink = overlayFrameDoc.createElement('a');
    closeLink.setAttribute('aria-label', 'Close');
    closeLink.classList.add('close');
    closeLink.addEventListener("click", () => {
        dialog.remove();
    });

    const parametersCheckTable = overlayFrameDoc.createElement('p');
    createParametersCheckTable(parametersCheckTable, bid);

    const paragraph = overlayFrameDoc.createElement('p');
    paragraph.innerHTML = `<pre><code class="language-json">${JSON.stringify(bid, null, 2)}</code></pre>`;

    article.appendChild(header);
    header.appendChild(closeLink);
    article.appendChild(parametersCheckTable);
    article.appendChild(paragraph);
    dialog.appendChild(article);
    overlayFrameDoc.body.appendChild(dialog);
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
    const managerIframe = overlayFrameDoc.getElementById(`${tabName}-iframe`);
    managerIframe.setAttribute('src', managerURL);
}

function makeIframeDraggable() {

    // Gets elements IDs
    const navbar = overlayFrameDoc.getElementById('adagio-nav');
    let targetElement = undefined;

    // Set up start x, y
    let startX = 0;
    let startY = 0;

    navbar.addEventListener('mousedown', startDragging);
    navbar.addEventListener('mouseup', stopDragging);
    navbar.addEventListener("mouseover", updateCursor);
    overlayFrame.addEventListener('mouseup', stopDragging);

    function updateCursor(e) {
        targetElement = e.target.tagName;
        if (targetElement === 'NAV' || targetElement === 'UL' || targetElement === 'LI') {
            navbar.style.cursor = 'grab';
        }
        else navbar.style.cursor = 'default';
    }

    function startDragging(e) {
        targetElement = e.target.tagName;
        if (targetElement === 'NAV' || targetElement === 'UL' || targetElement === 'LI') {
            isDragging = true;
            navbar.style.cursor = 'grabbing';
            overlayFrame.style.opacity = '0.4';
            startX = e.clientX;
            startY = e.clientY;
        }
    }

    function stopDragging() {
        isDragging = false;
        navbar.style.cursor = 'grab';
        overlayFrame.style.opacity = '';
    }

    overlayFrameDoc.addEventListener('mousemove', function (e) {
        if (!isDragging) {
            return;
        }
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const iframeRect = overlayFrame.getBoundingClientRect();
        const iframeX = iframeRect.left;
        const iframeY = iframeRect.top;
        overlayFrame.style.left = iframeX + deltaX + 'px';
        overlayFrame.style.top = iframeY + deltaY + 'px';
    });
}

function base64Decode(base64String) {
    var base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var bufferLength = base64String.length * 0.75;
    var len = base64String.length;
    var decodedBytes = new Uint8Array(bufferLength);
  
    var p = 0;
    var encoded1, encoded2, encoded3, encoded4;
  
    for (var i = 0; i < len; i += 4) {
      encoded1 = base64.indexOf(base64String[i]);
      encoded2 = base64.indexOf(base64String[i + 1]);
      encoded3 = base64.indexOf(base64String[i + 2]);
      encoded4 = base64.indexOf(base64String[i + 3]);
  
      decodedBytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      decodedBytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      decodedBytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
  
    return new TextDecoder().decode(decodedBytes);
  }

  function createParametersCheckTable(paragraph, bid) {

    // Create the alert text
    // create the alert article
    const alertContainer = overlayFrameDoc.createElement('article');
    alertContainer.style.padding = '1em';
    alertContainer.style.marginLeft = '';
    alertContainer.style.marginRight = '';
    alertContainer.style.marginTop = '1em';
    alertContainer.style.marginBottom = '1em';
    alertContainer.style.color = COLOR.YELLOWTEXT;
    alertContainer.style.backgroundColor = COLOR.YELLOWBACKGROUND;

    const alertTextDiv = overlayFrameDoc.createElement('div');
    alertTextDiv.innerHTML = `<small>Checks if the <code>parameters</code> are <b>found</b>. Not if their string value exists in the data.</small>`;
    alertTextDiv.innerHTML += `<small><br><li><code>ortb2.site.domain</code>: <code>${bid?.ortb2?.site?.domain}</code></li></small>`;
    alertContainer.appendChild(alertTextDiv);

    // Create the parameter checker table
    const table = overlayFrameDoc.createElement('table');
    const thead = overlayFrameDoc.createElement('thead');
    const tr = overlayFrameDoc.createElement('tr');
    const th1 = overlayFrameDoc.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.textContent = 'Status';
    const th2 = overlayFrameDoc.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.textContent = 'Parameter';
    const th3 = overlayFrameDoc.createElement('th');
    th3.setAttribute('scope', 'col');
    th3.textContent = 'Details';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);

    const tbody = overlayFrameDoc.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // Check the adagio bidder params
    let paramOrganizationId = bid.params?.organizationId;
    let paramSite = bid.params?.site;
    let paramPlacement = bid.params?.placement;
    let paramAdUnitElementId = bid.params?.adUnitElementId;
    let paramUseAdUnitCodeAsAdUnitElementId = bid.params?.useAdUnitCodeAsAdUnitElementId;

    // Check the organizationId
    if (paramOrganizationId === undefined) appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>params.organizationId</code>', 'Parameter not found...');
    else {
        if (paramOrganizationId.length !== 4) appendParametersCheckerTableRow(tbody, STATUSBADGES.CHECK, '<code>params.organizationId</code>', `More than 4 characters: <code>${paramOrganizationId}</code>`);
        else if (/\D/.test(paramOrganizationId) !== false) appendParametersCheckerTableRow(tbody, STATUSBADGES.CHECK, '<code>params.organizationId</code>', `Not only numbers:  <code>${paramOrganizationId}</code>`);
        else appendParametersCheckerTableRow(tbody, STATUSBADGES.OK, '<code>params.organizationId</code>', `<code>${paramOrganizationId}</code>`);
    }

    // Check the site name
    if (paramSite === undefined) appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>params.site</code>', 'Parameter not found...');
    else {
        if (paramSite.trim() !== paramSite) appendParametersCheckerTableRow(tbody, STATUSBADGES.CHECK, '<code>params.site</code>', `Space character at the beginning or end of the string: <code>${paramSite}</code>`);
        else appendParametersCheckerTableRow(tbody, STATUSBADGES.OK, '<code>params.site</code>', `<code>${paramSite}</code>`);
    }

    // Check the adUnitElementId
    if (paramAdUnitElementId === undefined) appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>params.adUnitElementId</code>', 'Parameter not found...');
    else {
        const htlmDiv = document.getElementById(paramAdUnitElementId);
        if (paramAdUnitElementId.trim() !== paramAdUnitElementId) appendParametersCheckerTableRow(tbody, STATUSBADGES.CHECK, '<code>params.adUnitElementId</code>', `Space character at the beginning or end of the string: <code>${paramAdUnitElementId}</code>`);
        else if (htlmDiv === null) appendParametersCheckerTableRow(tbody, STATUSBADGES.CHECK, '<code>params.adUnitElementId</code>', `Id not found: <code>${paramAdUnitElementId}</code>`);
        else appendParametersCheckerTableRow(tbody, STATUSBADGES.OK, '<code>params.adUnitElementId</code>', `<code>${paramAdUnitElementId}</code>`);
    }

    // Check the placement
    if (paramPlacement === undefined) appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>params.placement</code>', 'Parameter not found...');
    else {
        if (paramPlacement.trim() !== paramPlacement) appendParametersCheckerTableRow(tbody, STATUSBADGES.CHECK, '<code>params.placement</code>', `Space character at the beginning or end of the string: <code>${paramPlacement}</code>`);
        else if (/mobile/i.test(paramPlacement) || /desktop/i.test(paramPlacement) || /tablet/i.test(paramPlacement)) appendParametersCheckerTableRow(tbody, STATUSBADGES.CHECK, '<code>params.placement</code>', `Includes reference to an environment: <code>${paramPlacement}</code>`);
        else appendParametersCheckerTableRow(tbody, STATUSBADGES.OK, '<code>params.placement</code>', `<code>${paramPlacement}</code>`);
    }

    // Check the mediatypes parameters
    let mediatypeBanner = bid.mediaTypes?.banner;
    let mediatypeVideo = bid.mediaTypes?.video;
    let mediatypeNative = bid.mediaTypes?.native;

    if (mediatypeBanner === undefined && mediatypeVideo === undefined && mediatypeNative === undefined) appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>mediaTypes</code>', `No mediatype found: <code>${JSON.stringify(bid.mediaTypes)}</code>`);
    else {
        if (mediatypeBanner !== undefined) {
            let mediatypeBannerSizes = mediatypeBanner?.sizes;

            // Check the banner sizes
            if (mediatypeBannerSizes !== undefined) {
                let supportedSizes = [[160,600],[250,250],[300,100],[300,250],[300,300],[300,50],[300,600],[320,100],[320,160],[320,320],[320,480],[320,50],[336,280],[728,90],[800,250],[930,180],[970,250],[970,90],[1800,1000]];
                let commonArrays = [];
                supportedSizes.forEach(ss => {
                    mediatypeBannerSizes.forEach(mbs => {
                        if (JSON.stringify(ss) === JSON.stringify(mbs)) commonArrays.push(ss);
                    });
                });
                if (commonArrays.length > 0) appendParametersCheckerTableRow(tbody, STATUSBADGES.OK, '<code>mediaTypes.banner.sizes</code>', `<code>${JSON.stringify(commonArrays)}</code>`);
                else appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>mediaTypes.banner.sizes</code>', `No supported size: <code>${JSON.stringify(mediatypeBannerSizes)}</code>`);
            }
            else appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>mediaTypes.banner.sizes</code>', `No parameter found...`);
        }

        if (mediatypeVideo !== undefined) {
            let mediatypeVideoContext = mediatypeVideo?.context;
            let mediatypeVideoPlayerSize = mediatypeVideo?.playerSize;
            let mediatypeVideoApi = mediatypeVideo?.api;
            let mediatypeVideoPlaybackMethod = mediatypeVideo?.playbackmethod;

            // Check the video context
            if (mediatypeVideoContext !== undefined) {
                if (mediatypeVideoContext === 'outstream') appendParametersCheckerTableRow(tbody, STATUSBADGES.OK, '<code>mediaTypes.video.context</code>', `<code>${mediatypeVideoContext}</code>`);
                else appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>mediaTypes.video.context</code>', `Different of <code>outstream<code>: <code>${JSON.stringify(mediatypeVideoContext)}</code>`);
            }
            else appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>mediaTypes.video.context</code>', `No parameter found...`);

            // Check the video playerSize
            if (mediatypeVideoPlayerSize !== undefined) appendParametersCheckerTableRow(tbody, STATUSBADGES.OK, '<code>mediaTypes.video.playerSize</code>', `<code>${JSON.stringify(mediatypeVideoPlayerSize)}</code>`);
            else appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>mediaTypes.video.playerSize</code>', `No parameter found...`);

            // Check the video api
            if (mediatypeVideoApi !== undefined) {
                if (!mediatypeVideoApi.includes(2) || !mediatypeVideoApi.includes(7)) appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>mediaTypes.video.api</code>', `Api <code>[2,7]</code> not found: <code>${JSON.stringify(mediatypeVideoApi)}</code>`);
                else appendParametersCheckerTableRow(tbody, STATUSBADGES.OK, '<code>mediaTypes.video.api</code>', `<code>${JSON.stringify(mediatypeVideoApi)}</code>`);
            }
            else appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>mediaTypes.video.api</code>', `No parameter found...`);

            // Check the video playbackmethod
            if (mediatypeVideoPlaybackMethod !== undefined) {
                if (!mediatypeVideoPlaybackMethod.includes(6)) appendParametersCheckerTableRow(tbody, STATUSBADGES.CHECK, '<code>mediaTypes.video.playbackmethod</code>', `playbackmethod <code>6</code> not found: <code>${JSON.stringify(mediatypeVideoPlaybackMethod)}</code>`);
                else appendParametersCheckerTableRow(tbody, STATUSBADGES.OK, '<code>mediaTypes.video.playbackmethod</code>', `<code>${JSON.stringify(mediatypeVideoPlaybackMethod)}</code>`);
            }
            else appendParametersCheckerTableRow(tbody, STATUSBADGES.KO, '<code>mediaTypes.video.playbackmethod</code>', `No parameter found...`);
        }

        if (mediatypeNative !== undefined) {
            // TODO
        }
    }

    paragraph.appendChild(alertContainer);
    paragraph.appendChild(table);
  }

  function appendParametersCheckerTableRow(tbody, status, parameter, details) {
    // Create the row
    const newRow = overlayFrameDoc.createElement('tr');
    // Create the cells
    const statusCell = overlayFrameDoc.createElement('td');
    const parameterCell = overlayFrameDoc.createElement('td');
    const detailsCell = overlayFrameDoc.createElement('td');
    // Fill the cells
    statusCell.innerHTML = status;
    parameterCell.innerHTML = parameter;
    detailsCell.innerHTML = details;
    // Add the cells
    tbody.appendChild(newRow);
    newRow.appendChild(statusCell);
    newRow.appendChild(parameterCell);
    newRow.appendChild(detailsCell);
}

// Compare two strings representing a version: '8.14.0'
function isHigherOrEqualVersion(v1, v2) {
    // Split the version strings into arrays of numbers.
    const v1Parts = v1.split('.');
    const v2Parts = v2.split('.');

    // Iterate over the parts of the version strings, comparing them one by one.
    for (let i = 0; i < Math.min(v1Parts.length, v2Parts.length); i++) {
        // If the current part of v1 is less than the current part of v2, then v1 is lower than v2.
        if (parseInt(v1Parts[i]) < parseInt(v2Parts[i])) {
        return false;
        }

        // If the current part of v1 is greater than the current part of v2, then v1 is higher than v2.
        if (parseInt(v1Parts[i]) > parseInt(v2Parts[i])) {
        return true;
        }
    }

    // If we reach here, then the two version strings are equal.
    return true;
}

/*************************************************************************************************************************************************************************************************************************************
 * PBJS functions
 ************************************************************************************************************************************************************************************************************************************/

function check() {
    checkAdServer();
    checkPrebidVersion();
    checkAdagioModule();
    checkAdagioLocalStorage();
    checkAdagioUserSync();
    checkAdagioAnalyticsModule();
    checkAdagioAdUnitParams();
    checkDuplicatedAdUnitCode();
    checkSupplyChainObject();
    checkFloorPriceModule();
    checkCurrencyModule();
    checkConsentMetadata();
    checkGgprConsentString();
    checkAdagioCMP();
    checkPublisher();
}

function checkAdServer() {

    const adServers = new Map();
    adServers.set('Google Ad Manager', window.googletag);
    adServers.set('Kevel', window.kv);
    adServers.set('Smart (Equativ)', window.smart);
    adServers.set('Smart Ad Server', window.sas);
    adServers.set('Xandr Monetize', window.xandr);
    adServers.set('Appnexus', window.apn);
    adServers.set('Amazon Advertising',	window.a9);
    adServers.set('Criteo',	window.criteo);
    adServers.set('Media.net', window.medianet);
    adServers.set('Yieldmo', window.yieldmo);
    adServers.set('TripleLift', window.triplelift);
    adServers.set('Moat by Oracle', window.moat);
    adServers.set('Comscore', window.comscore);
    adServers.set('Nielsen', window.nielsen);
    adServers.set('VerifyAds', window.verifyads);

    let stringAdServer = "";

    // Loop on the map to check if value != undefined
    for (let [key, value] of adServers) {
        if (value !== undefined) {
            stringAdServer += `<code>${key}</code> `;
        }
    }

    // Fill the alert with number of orgIds found
    const tabName = ADAGIOTABSNAME.CHECKER.toLowerCase().replace(' ', '-');
    const alertTextDiv = overlayFrameDoc.getElementById(`${tabName}-alert`);
    alertTextDiv.innerHTML = `<small>Adserver(s) detected: ${stringAdServer}</small><br>`;

    // const slots = window.googletag.pubads().getSlots()
    // slots.forEach(slot => {
    //     console.log(`slot ${slot.getAdUnitPath()} || ${slot.getSlotElementId()}`);
    // })
}

function checkPrebidVersion() {
    if (prebidWrapper === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.PREBID, `<code>window._pbjsGlobals</code>: <code>undefined</code>`);
    } else {
        appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.PREBID, `<code>window._pbjsGlobals</code>: <code>${prebidWrapper[0]} (${prebidObject?.version})</code>`);
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
            appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.LOCALSTORAGE, `<code>${prebidWrapper[0]}.bidderSettings.standard.storageAllowed</code>: <code>true</code>`);
        } else if (localStorage.adagio?.storageAllowed) {
            appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.LOCALSTORAGE, `<code>${prebidWrapper[0]}.bidderSettings.adagio.storageAllowed</code>: <code>true</code>`);
        } else if (localStorage.adagio?.storageAllowed === false) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.LOCALSTORAGE, `<code>${prebidWrapper[0]}.bidderSettings.adagio.storageAllowed</code>: <code>false</code>`);
        } else if (deviceAccess === true) {
            appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.LOCALSTORAGE, `Check network for local storage (<code>${prebidWrapper[0]}.getConfig('deviceAccess')</code>: <code>true</code>)`);
        } else if (parseInt(prebidObject.version.charAt(1)) < 7) {
            appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.LOCALSTORAGE, 'Prebid version lower than <code>7</code>');
        } else {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.LOCALSTORAGE, 'Localstorage not found. If detected on network, contact dev!');
        }
    }
}

function checkAdagioUserSync() {
    // Adagio strongly recommends enabling user syncing through iFrames. 
    // This functionality improves DSP user match rates and increases the bid rate and bid price.
    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.USERSYNC, ADAGIOERRORS.PREBIDNOTFOUND);
    }
    else {
        const prebidUserSync = prebidObject.getConfig('userSync');
        if (prebidUserSync === undefined) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.USERSYNC, `<code>${prebidWrapper[0]}.getConfig('userSync')</code>: <code>${prebidUserSync}</code>`);
        }
        else {
            const prebidUserSyncIframe = prebidUserSync?.filterSettings?.iframe;
            const prebidUserSyncAll = prebidUserSync?.filterSettings?.all;

            if (prebidUserSyncIframe !== undefined && (prebidUserSyncIframe?.bidders.includes('*') || (Array.isArray(prebidUserSyncIframe?.bidders) && prebidUserSyncIframe.bidders.some(item => item.includes('adagio')))) && prebidUserSyncIframe?.filter === 'include') {
                appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.USERSYNC, `<code>${JSON.stringify(prebidUserSyncIframe)}</code>`);
            }
            else if (prebidUserSyncAll !== undefined && (prebidUserSyncAll?.bidders.includes('*') || (Array.isArray(prebidUserSyncAll?.bidders) && prebidUserSyncAll.bidders.some(item => item.includes('adagio')))) && prebidUserSyncAll?.filter === 'include') {
                appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.USERSYNC, `<code>${JSON.stringify(prebidUserSyncAll)}</code>`);
            }
            else {
                appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.USERSYNC, `<code>${JSON.stringify(prebidUserSync)}</code>`);
            }
        }
    }
}

function checkAdagioAnalyticsModule() {
    // Looking for Prebid version > to 8.14, and ADAGIO.versions.adagioAnalyticsAdapter
    if (prebidObject != undefined && adagioAdapter !== undefined) {

        let hasEligibleVersion = isHigherOrEqualVersion(prebidObject.version.replace('v', ''), '8.14.0');
        let hasEnabledAnalytics = adagioAdapter.versions?.adagioAnalyticsAdapter;
    
        if (!hasEligibleVersion && !hasEnabledAnalytics) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ANALYTICS, `Prebid version: <code>${prebidObject.version}</code> / Analytics: <code>${ADAGIO.versions.adagioAnalyticsAdapter}</code>`);
        }
        else if (!hasEligibleVersion) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ANALYTICS, `Prebid version: <code>${prebidObject.version}</code>`);
        }
        else if (!hasEnabledAnalytics) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ANALYTICS, `Analytics: <code>${hasEnabledAnalytics}</code>`);
        }
        else {
            appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.ANALYTICS, `Prebid version: <code>${prebidObject.version}</code> / Analytics: <code>${ADAGIO.versions.adagioAnalyticsAdapter}</code>`);
        }
    }
    else {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ANALYTICS, `Prebid wrapper or Adabio adapter: <code>undefined</code>`);
    }
}

function checkAdagioAdUnitParams() {
    // Adunits requieres pbjs
    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ADUNITS, ADAGIOERRORS.PREBIDNOTFOUND);
    } else {
        // Gets bidrequest arguments
        prebidBidsRequested = prebidEvents.filter(e => e.eventType === 'bidRequested').map(e => e.args);
        // Gets list of bidders out of bidrequested
        prebidBidders = [...new Set(prebidBidsRequested.map(e => e.bidderCode))].sort();
        // Gets flat list of bids
        prebidBids = prebidBidsRequested.map(e => e.bids).flat();
        // Gets the Adagio bids requested
        prebidAdagioBidsRequested = prebidBids.filter(e => e.bidder.toLowerCase().includes('adagio'));
        // Find the params for Adagio adUnits and update manager URL
        prebidAdagioParams = prebidAdagioBidsRequested.map(e => e.params);
        if (prebidAdagioParams.length !== 0) {
            // Update manager url
            updateManagerFilters(prebidAdagioParams[0]);
            // Get all the orgId parameter value sent to fill organizationIds[]
            for (const param in prebidAdagioParams) {
                let paramOrganizationId = prebidAdagioParams[param]?.organizationId;
                if (!organizationIds.includes(paramOrganizationId)) organizationIds.push(paramOrganizationId);
            }
        }

        // Find every adUnitsCode declared through bid requested
        prebidAdUnitsCodes = new Set();
        const bidRequested = prebidBidsRequested.map(e => e.bids);
        for (const bid of bidRequested) {
            for (const adUnit of bid) {
                prebidAdUnitsCodes.add(adUnit.adUnitCode);
            }
        }
        // Find adUnitsCodes found in Adagio bid requested
        prebidAdagioAdUnitsCodes = [...new Set(prebidAdagioBidsRequested.map(e => e.adUnitCode))];
        // Find adUnitsCode found in ADAGIO object (adCall received)
        let adagioAdUnitsCodes = '';
        if (adagioAdapter !== undefined) adagioAdUnitsCodes = adagioAdapter.adUnits;
        if (adagioAdapter !== undefined) adagioPbjsAdUnitsCode = adagioAdapter.pbjsAdUnits.map(e => e.code);

        totalPrebidAdUnitsCodes = prebidAdUnitsCodes.size;
        totalPrebidAdagioAdUnitsCode = prebidAdagioAdUnitsCodes.length;
        totalAdagioAdUnitsCodes = adagioAdUnitsCodes.length;
        totalAdagioPbjsAdUnitsCodes = adagioPbjsAdUnitsCode.length;

        if (totalPrebidAdUnitsCodes === 0) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ADUNITS, `<kbd>${totalPrebidAdUnitsCodes}</kbd> adUnits(s) found`);
        } else if (totalPrebidAdUnitsCodes > 0 && totalPrebidAdagioAdUnitsCode === 0) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.ADUNITS, `Adagio called for <kbd>${totalPrebidAdagioAdUnitsCode}</kbd> adUnit(s) out of <kbd>${totalPrebidAdUnitsCodes}</kbd> adUnits(s) found`);
        } else if (totalPrebidAdUnitsCodes > 0 && totalPrebidAdagioAdUnitsCode > 0) {
            if (totalPrebidAdUnitsCodes > totalPrebidAdagioAdUnitsCode) {
                appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.ADUNITS, `Adagio called for <kbd>${totalPrebidAdagioAdUnitsCode}</kbd> adUnit(s) out of <kbd>${totalPrebidAdUnitsCodes}</kbd> adUnits(s) found`);
            }
            else {
                appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.ADUNITS, `Adagio called for <kbd>${totalPrebidAdagioAdUnitsCode}</kbd> adUnit(s) out of <kbd>${totalPrebidAdUnitsCodes}</kbd> adUnits(s) found`);
            }
        }
        // Fill the Adunits table with all the requested bids
        appendAdUnitsRow(prebidBidders, prebidBids);
    }
}

function checkDuplicatedAdUnitCode() {
    // In one bidRequest, we shall find only one occurence of each adUnit code detected
    // If not, it will be refused
    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.DUPLICATED, ADAGIOERRORS.PREBIDNOTFOUND);
    }
    else {
        const duplicates = [];
        const adgioBidsRequested = prebidBidsRequested.filter(e => e.bidderCode.toLowerCase().includes('adagio'));
        
        adgioBidsRequested.forEach(bidRequested => {
            const adUnitCodes = new Set();
            bidRequested.bids.forEach(bid => {
                if (adUnitCodes.has(bid.adUnitCode)) {
                    if (!duplicates.includes(bid.adUnitCode)) duplicates.push(bid.adUnitCode);
                } 
                else {
                    adUnitCodes.add(bid.adUnitCode);
                }
            });
        });
        if (duplicates.length !== 0) appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.DUPLICATED, `<code>${duplicates}</code>`);
        else appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.DUPLICATED, `No duplicated found`);
    }
}

async function checkPublisher() {

    let adagioSellersJsonUrl = 'https://adagio.io/sellers.json';
    let adagioSellersJson = null;
    let organizationJson = null;

    // Fill the alert with number of orgIds found
    const tabName = ADAGIOTABSNAME.CHECKER.toLowerCase().replace(' ', '-');
    const alertTextDiv = overlayFrameDoc.getElementById(`${tabName}-alert`);
    alertTextDiv.innerHTML += `<small>Organization(s) detected: </small>`;

    if (organizationIds.length > 0) {
        // Fetch the adagio sellers.json
        try {
            const response = await fetch(adagioSellersJsonUrl);
            adagioSellersJson = await response.json();
            // Fill with org found
            for (const organizationId in organizationIds) {
                organizationJson = adagioSellersJson?.sellers.filter(e => e.seller_id === organizationIds[organizationId]);
                alertTextDiv.innerHTML += `<small><code>${organizationJson[0].name} (${organizationJson[0].seller_id}) - ${organizationJson[0].seller_type}</code>: <code>'${organizationJson[0].domain}'</code></small> `;
            }   
        } catch (error) {
            // Handle JSON failure here
            adagioSellersJson = null;
            console.log(error);
        }
    }
}

function checkFloorPriceModule() {
    // Floor price requiere Prebid as it is a Prebid module
    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.FLOORS, ADAGIOERRORS.PREBIDNOTFOUND);
    }
    // Floor price module allow to share the lower price acceptable for an adUnit with the bidders
    else {
        const prebidFloorPrice = prebidObject.getConfig('floors');
        if (prebidFloorPrice !== undefined) {
            appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.FLOORS, `<code>${JSON.stringify(prebidFloorPrice)}</code>`);
        }
        else {
            appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.FLOORS, `<code>${prebidWrapper[0]}.getConfig('floors')</code>: <code>${prebidFloorPrice}</code>`);
        }
    }
}

function checkCurrencyModule() {
    // Currency requiere Prebid as it is a Prebid module
    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.CURRENCY, ADAGIOERRORS.PREBIDNOTFOUND);
    }
    // Currency module allow to bid regardless of the adServer currency. It's mandatory when the adServer currency isn't USD
    else {
        const prebidCurrency = prebidObject.getConfig('currency');
        if (prebidCurrency !== undefined) {
            appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.CURRENCY, `<code>${JSON.stringify(prebidCurrency)}</code>`);
        }
        else {
            appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.CURRENCY, `<code>${prebidWrapper[0]}.getConfig('currency')</code>: <code>${prebidCurrency}</code>`);
        }
    }
}

function checkSupplyChainObject() {

    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, 'Supply chain object', ADAGIOERRORS.PREBIDNOTFOUND);
        appendConsentsRow(STATUSBADGES.KO, 'Supply chain object', ADAGIOERRORS.PREBIDNOTFOUND);
        return;
    } else if (typeof prebidObject.getEvents !== 'function') {
        appendCheckerRow(STATUSBADGES.KO, 'Supply chain object', `<code>${prebidWrapper[0]}.getEvents()</code> is not a function`);
        appendConsentsRow(STATUSBADGES.KO, 'Supply chain object', `<code>${prebidWrapper[0]}.getEvents()</code> is not a function`);
        return;
    }
    // Find the first Adagio bidRequested event with an SCO
    const adagioBid = prebidEvents
        .filter(e => e.eventType === 'bidRequested') // && e.args.bidderCode.toLowerCase().includes('adagio'))
        .map(e => e.args.bids)
        .flat()
        .find(r => r.schain)
    if (adagioBid !== undefined) {
        appendCheckerRow(STATUSBADGES.OK, 'Supply chain object', `<code>${JSON.stringify(adagioBid.schain)}</code>`);
        // appendConsentsRow(STATUSBADGES.OK, 'Supply chain object', `<code>${JSON.stringify(adagioBid.schain)}</code>`);
    } else {
        appendCheckerRow(STATUSBADGES.CHECK, 'Supply chain object', 'If website is owned and operated, no SCO');
        // appendConsentsRow(STATUSBADGES.CHECK, 'Supply chain object', 'If website is owned and managed, no SCO');
    }
}

function checkConsentMetadata() {

    if (prebidObject === undefined) {
        appendConsentsRow(STATUSBADGES.KO, 'Consents', ADAGIOERRORS.PREBIDNOTFOUND);
        return;
    } else if (typeof prebidObject.getConsentMetadata !== 'function') {
        appendCheckerRow(STATUSBADGES.KO, 'Consents', `<code>${prebidWrapper[0]}.getConsentMetadata()</code> not a function`);
        appendConsentsRow(STATUSBADGES.KO, 'Consents', `<code>${prebidWrapper[0]}.getConsentMetadata()</code> not a function`);
        return;
    }

    // Gets consents metadata from prebid object
    let consentMetadata = prebidObject.getConsentMetadata();

    if (consentMetadata !== undefined) {
        let coppaMetadata = consentMetadata?.coppa;
        let gdprMetadata = consentMetadata?.gdpr;
        let gppMetadata = consentMetadata?.gpp;
        let uspMetadata = consentMetadata?.usp;
        // If has gdpr and a consent string, ok
        if (gdprMetadata != undefined && gdprMetadata?.consentStringSize > 0) {
            appendCheckerRow(STATUSBADGES.OK, 'GDPR metadata', `<code>${JSON.stringify(gdprMetadata)}</code>`);
        }
        else appendCheckerRow(STATUSBADGES.KO, 'GDPR metadata', `<code>${JSON.stringify(gdprMetadata)}</code>`);
    }
    else {
        appendCheckerRow(STATUSBADGES.KO, 'Consents', `<code>${prebidWrapper[0]}.getConsentMetadata()</code>: <code>undefined</code>`);
    }
}

function checkGgprConsentString() {
    // Has been found or not
    let hasCstString = false;
    // Checks if bids have been requested
    if (prebidBidsRequested !== undefined) {
        // Filter on adagio ones
        let prbAdgBidRequested = prebidBidsRequested.filter(e => e.bidderCode === 'adagio');
        if (prbAdgBidRequested !== undefined) {
            // Look for consent string
            let cstString = prbAdgBidRequested[0]?.gdprConsent?.consentString;
            // Checks if not empty
            if (cstString !== undefined) {
                hasCstString = true;
                appendCheckerRow(STATUSBADGES.OK, 'GDPR consent string', `<code>${cstString}</code>`);
            }
        }
    }
    // Last check
    if (!hasCstString) {
        appendCheckerRow(STATUSBADGES.KO, 'GDPR consent string', `<code>undefined</code>`);
    }
}

function checkAdagioCMP() {
    if (typeof window.__tcfapi !== 'function') {
        appendCheckerRow(STATUSBADGES.KO, 'Consent management platform', '<code>window.__tcfapi</code> function is not defined');
        appendConsentsRow(STATUSBADGES.KO, 'Consent management platform', '<code>window.__tcfapi</code> function is not defined');
        return;
    }
    // Gives the Consent Management strings values
    window.__tcfapi('getTCData', 2, (tcdata, success) => {
        
        const cmpAdagioBidders = new Map();
        cmpAdagioBidders.set(617, 'Adagio');
        cmpAdagioBidders.set(58, '33Across');
        cmpAdagioBidders.set(90, 'E-Planning');
        cmpAdagioBidders.set(285, 'Freewheel');
        cmpAdagioBidders.set(253, 'Improve Digital');
        cmpAdagioBidders.set(10, 'Index Exchange');
        cmpAdagioBidders.set(36, 'Nexxen (Unruly)'); 
        cmpAdagioBidders.set(241, 'OneTag');
        cmpAdagioBidders.set(69, 'OpenX');
        cmpAdagioBidders.set(76, 'Pubmatic');
        cmpAdagioBidders.set(52, 'Rubicon');
        cmpAdagioBidders.set(45, 'Smart Adserver');
        cmpAdagioBidders.set(13, 'Sovrn');
        cmpAdagioBidders.set(28, 'TripleLift');
        // cmpAdagioBidders.set(25, 'Yahoo');

        let adagioFound = false;
        let biddersNotFound = "";

        for (let [key, value] of cmpAdagioBidders) {

            const consent = tcdata.vendor.consents[key];
            const legitimate = tcdata.vendor.legitimateInterests[key];

            if (key === 617 && (consent || legitimate)) {
                adagioFound = true;
            }

            // Build the line values per partner
            const bidderName = '<code>' + value + ' (' + key + ')</code>';
            const bidderConsent = consent ? STATUSBADGES.OK : STATUSBADGES.KO;
            const bidderLegitimate = legitimate ? STATUSBADGES.OK : STATUSBADGES.KO;
            appendConsentsRow(bidderName, bidderConsent, bidderLegitimate);

            // Build the log string of partners CMP to add
            if (!consent) biddersNotFound = biddersNotFound + bidderName + "; ";
        };

        if (biddersNotFound !== "") {
            if (!adagioFound) appendCheckerRow(STATUSBADGES.KO, 'Consent management platform', `Missing: ${biddersNotFound}`);
            else appendCheckerRow(STATUSBADGES.CHECK, 'Consent management platform', `Missing: ${biddersNotFound}`);

        } else {
            appendCheckerRow(STATUSBADGES.OK, 'Consent management platform', 'Adagio consent: <code>true</code>');
        }
    });
}

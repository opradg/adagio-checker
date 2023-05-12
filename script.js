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
let pbjsGlobals = undefined;
let prebidObject = undefined;
let prebidWrappers = [];
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
// Active tab (from button html element)
let activeTab = undefined;
// Variables for draggable iframe
let isDragging = false;

/*************************************************************************************************************************************************************************************************************************************
 * Enums
 ************************************************************************************************************************************************************************************************************************************/

const ADAGIOSVG = Object.freeze({
    LOGO:       '<svg viewBox="0 0 101 92" style="height:1.5em;"><path d="M97 88.598H84.91l-33.473-72.96-.817-1.707-6.398 13.836 28.143 60.916h-12.2l-.106-.237-21.82-47.743-6.428 13.9 15.978 34.08H35.59l-9.802-21.056-9.698 20.97H4L43.109 4H57.89L97 88.598Z"></path></svg>',
    MANAGER:    '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"></path></svg>',
    CHECKER:    '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M19 15v4H5v-4h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 18.5c-.82 0-1.5-.67-1.5-1.5s.68-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19 5v4H5V5h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 8.5c-.82 0-1.5-.67-1.5-1.5S6.18 5.5 7 5.5s1.5.68 1.5 1.5S7.83 8.5 7 8.5z"></path></svg>',
    ADUNITS:    '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM7 4V3h10v1H7zm0 14V6h10v12H7zm0 3v-1h10v1H7z"></path><path d="M16 7H8v2h8V7z"></path></svg>',
    CONSENTS:   '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M13.17 4 18 8.83V20H6V4h7.17M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-2 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.99 0-1.93.21-2.78.58C8.48 15.9 8 16.62 8 17.43V18h8v-.57z"></path></svg>',
    PREBID:     '<svg viewBox="0 0 24 24" style="height:1.2em"><g><g><g><path d="M19.973 4.724H.746A.743.743 0 0 1 0 3.978c0-.414.331-.746.746-.746H19.89c.415 0 .746.332.746.746.083.414-.248.746-.663.746z"/></g><g><path d="M27.35 8.868H4.391a.743.743 0 0 1-.745-.746c0-.414.331-.746.745-.746H27.35c.415 0 .746.332.746.746a.743.743 0 0 1-.746.746z"/></g><g><path d="M25.029 21.3H2.072a.743.743 0 0 1-.746-.747c0-.414.332-.745.746-.745h22.957c.414 0 .746.331.746.745 0 .332-.332.746-.746.746z"/></g><g><path d="M17.238 13.012H2.984a.743.743 0 0 1-.746-.746c0-.415.331-.746.746-.746h14.254c.415 0 .746.331.746.746a.743.743 0 0 1-.746.746z"/></g><g><path d="M23.371 17.155H7.045a.743.743 0 0 1-.746-.745c0-.415.331-.746.746-.746H23.37c.415 0 .746.331.746.746 0 .331-.331.745-.746.745z"/></g></g></g></svg>',
    EYEOPENED:  '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M6.30147 15.5771C4.77832 14.2684 3.6904 12.7726 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C14.1843 6 16.1261 7.07185 17.6986 8.42294C19.2218 9.73158 20.3097 11.2274 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18C9.81574 18 7.87402 16.9282 6.30147 15.5771ZM12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C2.00757 13.8624 3.23268 15.5772 4.99812 17.0941C6.75717 18.6054 9.14754 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C21.9925 10.1376 20.7674 8.42276 19.002 6.90595C17.2429 5.39462 14.8525 4 12 4ZM10 12C10 10.8954 10.8955 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8955 14 10 13.1046 10 12ZM12 8C9.7909 8 8.00004 9.79086 8.00004 12C8.00004 14.2091 9.7909 16 12 16C14.2092 16 16 14.2091 16 12C16 9.79086 14.2092 8 12 8Z"></path></svg>',
    EYECLOSED:  '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z"></path></svg>',
    REFRESH:    '<svg viewBox="0 0 24 24" style="height:1.2em;"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>',
    INFO:       '<svg viewBox="0 0 416.979 416.979" style="height:1.2em;"><path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path></svg>'
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
    USERSYNC: 'User sync',
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
    WEBSITE: 'https://adagio.io/',
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
    // Look for pbjs object (pbjs, hubjs, etc...)
    pbjsGlobals = window._pbjsGlobals;
    // To add: getGlobal() => https://github.com/prebid/Prebid.js/pull/9568
    if (pbjsGlobals !== undefined) {
        prebidWrapper = pbjsGlobals.includes('pbjs') ? 'pbjs' : pbjsGlobals[0];
        prebidObject = window[prebidWrapper];
    }
    /*if (window._pbjsGlobals !== undefined) {
        for (let wrapper of window._pbjsGlobals) {
            prebidWrappers.push(overlayFrameDoc[wrapper]);
        }
    }*/
    // In some configurations, the wrapper is inside iframes
    else {
        const iframes = document.getElementsByTagName("iframe");
        for (let iframe of iframes) { 
            try {
                const overlayFrameDoc = iframe.contentWindow;
                if (overlayFrameDoc._pbjsGlobals !== undefined) {
                    for (let wrapper of overlayFrameDoc._pbjsGlobals) {
                        prebidWrappers.push(overlayFrameDoc[wrapper]);
                    }
                }
            } catch (error) {
            }
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
    ul.appendChild(buildPrebidButton('Prebid versions detected', ADAGIOSVG.PREBID, true));
    ul.appendChild(buildOverlayButton('Show adunits overlay', ADAGIOSVG.EYECLOSED, false));
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
    let nbWrappers = 0;
    if (pbjsGlobals !== undefined) {
        nbWrappers = pbjsGlobals.length;
    }

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
    for (let i = 0; i < nbWrappers; i++){
        // Create the radio button for the current wrapper item
        const item = pbjsGlobals[i];
        const wrapperItem = overlayFrameDoc.createElement('div');
        const itemInput = overlayFrameDoc.createElement('input');
        itemInput.setAttribute('type', 'radio');
        itemInput.setAttribute('value', item);
        itemInput.setAttribute('name', 'radio-group'); // added the 'name' attribute
        itemInput.setAttribute('id', `${item.replace(' ', '-')}-wrapper`)
        const itemLabel = overlayFrameDoc.createElement('label');
        itemLabel.setAttribute('for', item);
        itemLabel.innerHTML = item;

        // If current wrapper is the used one at the moment, check the radio
        if (prebidWrapper === pbjsGlobals[i]) {
            itemInput.checked = true;
        }

        itemInput.addEventListener("click", function() {
            if (itemInput.checked) {
                prebidWrapper = itemInput.value;
                prebidObject = window[prebidWrapper];
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
	alertTextDiv.innerHTML = '<small>Adunit(s) found:</small>';
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
        newInput.addEventListener('click', function() {
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
    const closeLink = overlayFrameDoc.createElement('a');
    closeLink.setAttribute('aria-label', 'Close');
    closeLink.classList.add('close');
    closeLink.addEventListener("click", () => {
        dialog.remove();
    });

    const paragraph = overlayFrameDoc.createElement('p');
    paragraph.innerHTML = `<pre><code class="language-json">${JSON.stringify(bid, null, 2)}</code></pre>`;

    article.appendChild(header);
    header.appendChild(closeLink);
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

	overlayFrameDoc.addEventListener('mousemove', function(e) {
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

/*************************************************************************************************************************************************************************************************************************************
 * PBJS functions
 ************************************************************************************************************************************************************************************************************************************/

function check() {
    checkPrebidVersion();
    checkAdagioModule();
    checkAdagioLocalStorage();
    checkAdagioAdUnitParams();
    checkAdagioUserSync();
    checkCurrencyModule();
    checkSupplyChainObject();
    checkAdagioCMP();
    checkConsentMetadata();
}

function checkPrebidVersion() {
    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.PREBID, `<code>window._pbjsGlobals</code>: <code>${pbjsGlobals}</code>`);
    } else {
        // Sometimes, websites deal with multiple Prebids. If there's a pbjs global, use it in priority.
        appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.PREBID, `<code>window._pbjsGlobals</code>: <code>${pbjsGlobals}</code>`);
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
            appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.LOCALSTORAGE, `<code>${prebidWrapper}.bidderSettings.standard.storageAllowed</code>: <code>true</code>`);
        } else if (localStorage.adagio?.storageAllowed) {
            appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.LOCALSTORAGE, `<code>${prebidWrapper}.bidderSettings.adagio.storageAllowed</code>: <code>true</code>`);
        } else if (localStorage.adagio?.storageAllowed === false) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.LOCALSTORAGE, `<code>${prebidWrapper}.bidderSettings.adagio.storageAllowed</code>: <code>false</code>`);
        } else if (deviceAccess === true) {
            appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.LOCALSTORAGE, `Check network for local storage (<code>${prebidWrapper}.getConfig('deviceAccess')</code>: <code>true</code>)`);
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
        prebidBidsRequested = prebidEvents.filter(e => e.eventType === 'bidRequested').map(e => e.args);
        // Gets list of bidders out of bidrequested
        prebidBidders = [...new Set(prebidBidsRequested.map(e => e.bidderCode))].sort();
        // Gets flat list of bids
        prebidBids = prebidBidsRequested.map(e => e.bids).flat();
        // Gets the Adagio bids requested
        prebidAdagioBidsRequested = prebidBids.filter(e => e.bidder.toLowerCase().includes('adagio'));
        // Find the params for Adagio adUnits and update manager URL
        prebidAdagioParams = prebidAdagioBidsRequested.map(e => e.params);
        if (prebidAdagioParams.length !== 0) updateManagerFilters(prebidAdagioParams[0]);

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

function checkAdagioUserSync() {
    // Adagio strongly recommends enabling user syncing through iFrames. 
    // This functionality improves DSP user match rates and increases the bid rate and bid price.
    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.USERSYNC, ADAGIOERRORS.PREBIDNOTFOUND);
    }
    else {
        const prebidUserSync = prebidObject.getConfig('userSync');
        if (prebidUserSync === undefined) {
            appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.USERSYNC, `<code>${prebidWrapper}.getConfig('userSync')</code>: <code>${prebidUserSync}</code>`);
        }
        else {
            const adagioUserSync = prebidObject.getConfig('userSync').userIds.find(e => e.name === 'adagio');
            if (adagioUserSync !== undefined) {
                appendCheckerRow(STATUSBADGES.OK, ADAGIOCHECK.USERSYNC, `<code>${JSON.stringify(adagioUserSync)}</code>`);
            }
            else {
                appendCheckerRow(STATUSBADGES.KO, ADAGIOCHECK.USERSYNC, `<code>${prebidWrapper}.getConfig('userSync').userIds.find(e => e.name === 'adagio')</code>: <code>${adagioUserSync}</code>`);
            }
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
            appendCheckerRow(STATUSBADGES.CHECK, ADAGIOCHECK.CURRENCY, `<code>${prebidWrapper}.getConfig('currency')</code>: <code>${prebidCurrency}</code>`);
        }
    }
}

function checkSupplyChainObject() {

    if (prebidObject === undefined) {
        appendCheckerRow(STATUSBADGES.KO, 'Supply chain object', ADAGIOERRORS.PREBIDNOTFOUND);
        appendConsentsRow(STATUSBADGES.KO, 'Supply chain object', ADAGIOERRORS.PREBIDNOTFOUND);
        return;
    } else if (typeof prebidObject.getEvents !== 'function') {
        appendCheckerRow(STATUSBADGES.KO, 'Supply chain object', `<code>${pbjsGlobals}.getEvents()</code> is not a function`);
        appendConsentsRow(STATUSBADGES.KO, 'Supply chain object', `<code>${pbjsGlobals}.getEvents()</code> is not a function`);
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
        appendCheckerRow(STATUSBADGES.CHECK, 'Supply chain object', 'If website is owned and managed, no SCO');
        // appendConsentsRow(STATUSBADGES.CHECK, 'Supply chain object', 'If website is owned and managed, no SCO');
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

        let adagioFound = false;

        for (let [key, value] of cmpAdagioBidders) {

            const consent = tcdata.vendor.consents[key];
            const legitimate = tcdata.vendor.legitimateInterests[key];

            if (key === 617 && (consent || legitimate)) {
                adagioFound = true;
            }

            const bidderName = '<code>' + value + ' (' + key + ')</code>';
            const bidderConsent = consent ? STATUSBADGES.OK : STATUSBADGES.KO;
            const bidderLegitimate = legitimate ? STATUSBADGES.OK : STATUSBADGES.KO;
            appendConsentsRow(bidderName, bidderConsent, bidderLegitimate);
        };

        if (!adagioFound) {
            appendCheckerRow(STATUSBADGES.KO, 'Consent Management Platform', 'Adagio consent: <code>false</code>');
        } else {
            appendCheckerRow(STATUSBADGES.OK, 'Consent Management Platform', 'Adagio consent: <code>true</code>');
        }
    });
}

function checkConsentMetadata() {

    if (prebidObject === undefined) {
        appendConsentsRow(STATUSBADGES.KO, 'Consent metadata', ADAGIOERRORS.PREBIDNOTFOUND);
        return;
    } else if (typeof prebidObject.getConsentMetadata !== 'function') {
        appendCheckerRow(STATUSBADGES.KO, 'Consent metadata', `<code>${prebidWrapper}.getConsentMetadata()</code> not a function`);
        appendConsentsRow(STATUSBADGES.KO, 'Consent metadata', `<code>${prebidWrapper}.getConsentMetadata()</code> not a function`);
        return;
    }

    let consentMetadata = prebidObject.getConsentMetadata();

    if (consentMetadata !== undefined) {

        let stringBuilder = '';
        for (const consent in consentMetadata) {
            stringBuilder += `<code>${JSON.stringify(consent)}</code>: <code>${JSON.stringify(consentMetadata[consent])}</code><br>`;
        };

        appendCheckerRow(STATUSBADGES.OK, 'Consent metadata', stringBuilder);
        // appendCheckerRow(STATUSBADGES.OK, 'Consent metadata', `<code>${JSON.stringify(consentMetadata)}</code>`);
        // appendConsentsRow(STATUSBADGES.OK, 'Consent metadata', `<code>${JSON.stringify(consentMetadata)}</code>`);
    }
    else {
        appendCheckerRow(STATUSBADGES.KO, 'Consent metadata', `<code>${prebidWrapper}.getConsentMetadata()</code>: <code>undefined</code>`);
    }

    const adagioBid = prebidObject.getEvents()
        .filter(e => e.eventType === 'bidRequested') //&& e.args.bidderCode.toLowerCase().includes('adagio'))
        .map(e => e.args)
        .flat()
        .find(r => r.gdprConsent)

    if (adagioBid !== undefined) {
        appendCheckerRow(STATUSBADGES.OK, 'GDPR consent string', `<code>${JSON.stringify(adagioBid.gdprConsent)}</code>`);
        // appendConsentsRow(STATUSBADGES.OK, 'GDPR consent string', `<code>${JSON.stringify(adagioBid.gdprConsent)}</code>`);
    } else {
        appendCheckerRow(STATUSBADGES.KO, 'GDPR consent string', `GDPR string not found. If consent metadata GDRP true, contact dev`);
        // appendConsentsRow(STATUSBADGES.KO, 'GDPR consent string', 'GDPR string not found. If consent metadata GDRP true, contact dev');
    }
}

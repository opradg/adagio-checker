# Overview
Adagio: https://adagio.io/  
Adagio bidder adapter: https://github.com/prebid/Prebid.js/blob/master/modules/adagioBidAdapter.md   
Maintainer: opronier@adagio.io  

## Description
📝 A simple js code using Prebid.js to check the configuration of a website using the Adagio bidder adapter  
❤️ Inspired from Professor Prebid: https://github.com/prebid/professor-prebid/  

## Features
Checks if followings are detected:  
- Prebid.js
- Adagio bidder adapter
- Localstorage for Adagio
- Consent management platform (CMP) for Adagio & Co
- AdUnit for Adagio

## How to add the bookmarklet?
To avoid copy/pasting the code, create a new favorite page and in the `URL`section, add this code: [bookmarklet.js](https://github.com/opradg/adagio-checker/blob/main/bookmarklet.js).  
On the targeted website, click on the bookmarklet. It will execute the code in the console.   

## How-to video
https://www.loom.com/share/5e4d8a7f3eac4464aaaeb4c3449ea42e

## Example of result
```
✅ Prebid.js (v7.25.0)
✅ Adagio module
✅ Localstorage
✅ Consent Management Platform
   Adagio (617) => Consents: ✅ / Legitimates: ❌
   33Across (58) => Consents: ✅ / Legitimates: ❌
   Freewheel (285) => Consents: ✅ / Legitimates: ✅
   Improve Digital (253) => Consents: ✅ / Legitimates: ✅
   Index Exchange (10) => Consents: ✅ / Legitimates: ❌
   OneTag (241) => Consents: ✅ / Legitimates: ❌
   Pubmatic (76) => Consents: ✅ / Legitimates: ✅
   Rubicon (52) => Consents: ✅ / Legitimates: ✅
   Sovrn (13) => Consents: ✅ / Legitimates: ❌
   Yahoo (25) => Consents: ✅ / Legitimates: ✅
✅ Adagio adUnits => 4
D_Q_StickyAd__ayManagerEnv__6 ({"banner":{"sizes":[[728,90]]}})
{organizationId: '1334', site: 'newsnery-com', placement: 'StickyAd', useAdUnitCodeAsAdUnitElementId: true}
D_Q_MediumRectangle_2__ayManagerEnv__8 ({"banner":{"sizes":[[300,250],[336,280]]}})
{organizationId: '1334', site: 'newsnery-com', placement: 'DesktopMediumRectangle', useAdUnitCodeAsAdUnitElementId: true}
D_Q_MediumRectangle_1__ayManagerEnv__9 ({"banner":{"sizes":[[300,250],[336,280]]}})
{organizationId: '1334', site: 'newsnery-com', placement: 'DesktopMediumRectangle', useAdUnitCodeAsAdUnitElementId: true}
D_Q_Leaderboard_1__ayManagerEnv__a ({"banner":{"sizes":[[728,90]]}})
{organizationId: '1334', site: 'newsnery-com', placement: 'DesktopLeaderboard', useAdUnitCodeAsAdUnitElementId: true}
```

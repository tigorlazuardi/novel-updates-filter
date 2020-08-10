// ==UserScript==
// @name         Novel Updates Filter Result by Country
// @namespace    https://github.com/TigorLazuardi/novel-updates-filter
// @include      https://www.novelupdates.com/genre/*
// @include      https://www.novelupdates.com/novelslisting/*
// @include      https://www.novelupdates.com/series-ranking/*
// @include      https://www.novelupdates.com/stag/*
// @include      https://www.novelupdates.com/series-finder/*
// @include      https://www.novelupdates.com/latest-series/*
// @include      https://www.novelupdates.com/viewlist/*
// @version      1.0.0
// @description  Filters the result by country
// @run-at       document-end
// @inject-in    to content
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT (https://github.com/TigorLazuardi/novel-updates-filter/blob/master/LICENSE)
// @downloadURL  https://raw.githubusercontent.com/TigorLazuardi/novel-updates-filter/master/dist/userscript.js
// @homepageURL  https://github.com/TigorLazuardi/novel-updates-filter
// @supportURL   https://github.com/TigorLazuardi/novel-updates-filter
// ==/UserScript==
// This script is written in typescript and thus ugly to read if read directly like this.
// Please refer to git page (the name space above) for the actual source code
var _a;
var origins = {
    Korea: 'orgkr',
    China: 'orgcn',
    Japan: 'orgjp',
    Indonesia: 'orgid',
    Malaysia: 'orgmy',
    Filipino: 'orgfil',
    Thailand: 'orgth',
    Vietnam: 'orgvn',
};
function setStatus(selector, status) {
    var el = document.querySelectorAll("." + selector);
    el.forEach(function (e) {
        var _a, _b, _c;
        // @ts-ignore
        (_c = (_b = (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.style.display = status;
    });
}
function toggleFilter() {
    var ok = this.checked;
    if (ok) {
        setStatus(this.value, 'none');
    }
    else {
        setStatus(this.value, 'block');
    }
    GM_setValue(this.name, ok);
}
var injectLoc = 
// Series Listing and Series Ranking
document.querySelector('.search_sort') ||
    // Series Finder and Latest Series
    document.querySelector('#rankfilter') ||
    // Rec Lists
    document.querySelector('.ucl_main');
var filterArea = document.createElement('div');
var filterLabel = document.createElement('p');
filterLabel.innerHTML = '<b>Blocklist :</b>';
filterLabel.style.marginBottom = '0';
var selections = document.createElement('div');
selections.style.display = 'flex';
selections.style.flexWrap = 'wrap';
for (var k in origins) {
    var status_1 = GM_getValue(k, false);
    var container = document.createElement('div');
    var checkbox = document.createElement('input');
    var label = document.createElement('label');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.name = k;
    checkbox.value = origins[k];
    checkbox.addEventListener('click', toggleFilter);
    checkbox.checked = status_1;
    if (status_1) {
        setStatus(origins[k], 'none');
    }
    label.setAttribute('for', k);
    label.innerText = k;
    container.appendChild(checkbox);
    container.appendChild(label);
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.marginRight = '10px';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.minWidth = '50px';
    selections.appendChild(container);
}
filterArea.appendChild(filterLabel);
filterArea.appendChild(selections);
// Styling
filterArea.style.marginTop = '25px';
filterArea.style.marginBottom = '25px';
filterArea.style.backgroundColor = '#DAE8EC';
filterArea.style.borderRadius = '10px';
filterArea.style.border = '2px solid #B8CB99';
filterArea.style.paddingLeft = '10px';
filterArea.style.paddingRight = '10px';
(_a = injectLoc === null || injectLoc === void 0 ? void 0 : injectLoc.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(filterArea, injectLoc.nextSibling);

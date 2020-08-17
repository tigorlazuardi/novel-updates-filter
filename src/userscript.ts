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
// @match        https://www.novelupdates.com/
// @version      1.1.0
// @description  Filters the result by country
// @run-at       document-end
// @inject-into  content
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/TigorLazuardi/novel-updates-filter/master/dist/userscript.js
// @homepageURL  https://github.com/TigorLazuardi/novel-updates-filter
// @supportURL   https://github.com/TigorLazuardi/novel-updates-filter
// ==/UserScript==
// This script is written in typescript and thus ugly to read if read directly like this.
// Please refer to git page (the name space above) for the actual source code

declare function GM_getValue<T = any>(key: string, defaultValue: T): T
declare function GM_setValue(key: string, value: any): void

const origins: { [key: string]: string } = {
  Korea: 'orgkr',
  China: 'orgcn',
  Japan: 'orgjp',
  Indonesia: 'orgid',
  Malaysia: 'orgmy',
  Filipino: 'orgfil',
  Thailand: 'orgth',
  Vietnam: 'orgvn',
}

const home = document.querySelectorAll('.l-content table#myTable')[1]

const injectLoc =
  // home
  home ??
  // Series Listing and Series Ranking
  document.querySelector('.search_sort') ??
  // Series Finder and Latest Series
  document.querySelector('#rankfilter') ??
  // Rec Lists
  document.querySelector('.ucl_main')

function setDisplay(selector: string, display: 'none' | 'block') {
  const el = document.querySelectorAll(selector)
  el.forEach((e) =>
    home
      ? display === 'block'
        ? // compability with site. Seems display block destroys the view.
          e.parentElement.parentElement.removeAttribute('style')
        : (e.parentElement.parentElement.style.display = display)
      : (e.parentElement.parentElement.parentElement.style.display = display),
  )
}

function toggleFilter(this: HTMLDivElement) {
  const prev = GM_getValue<boolean>(this.id, false)
  const hide = !prev
  if (hide) {
    home
      ? setDisplay(`.l-content > table#myTable .${origins[this.id]}`, 'none')
      : setDisplay(`.${origins[this.id]}`, 'none')
    this.style.backgroundColor = '#F9F871'
  } else {
    home
      ? setDisplay(`.l-content > table#myTable .${origins[this.id]}`, 'block')
      : setDisplay(`.${origins[this.id]}`, 'block')
    this.style.backgroundColor = 'white'
  }
  GM_setValue(this.id, hide)
}

const filterArea = document.createElement('div')

const filterLabel = document.createElement('p')
// Styling Blocklist text
filterLabel.innerHTML = '<b>Blocklist :</b>'
filterLabel.style.marginBottom = '0'

const selections = document.createElement('div')
// Making sure the chexboxes wrap well on small resolution screens
selections.style.display = 'flex'
selections.style.flexWrap = 'wrap'

for (const k in origins) {
  const status = GM_getValue<boolean>(k, false)
  const item = document.createElement('div')
  const name = document.createElement('p')
  name.style.marginBottom = '0'

  name.innerText = k

  // Making sure checkbox is inline with label
  item.appendChild(name)
  item.style.display = 'flex'
  item.style.alignItems = 'center'
  item.style.justifyContent = 'center'
  item.style.minWidth = '100px'
  item.style.backgroundColor = 'white'
  item.style.padding = '5px'
  item.style.marginBottom = '15px'
  item.style.marginTop = '5px'
  item.style.marginRight = '5px'
  item.style.cursor = 'pointer'
  item.style.borderRadius = '10px'
  item.style.border = '2px solid #7c5262'
  item.id = k
  item.addEventListener('click', toggleFilter)

  if (status) {
    setDisplay(`.${origins[k]}`, 'none')
    item.style.backgroundColor = '#f9f871'
  }

  selections.appendChild(item)
}

filterArea.appendChild(filterLabel)
filterArea.appendChild(selections)

// Styling
filterArea.style.marginTop = '25px'
filterArea.style.marginBottom = '25px'
filterArea.style.backgroundColor = '#DAE8EC'
filterArea.style.borderRadius = '10px'
filterArea.style.border = '2px solid #B8CB99'
filterArea.style.paddingLeft = '10px'
filterArea.style.paddingRight = '10px'

home
  ? injectLoc?.parentNode?.insertBefore(filterArea, injectLoc)
  : injectLoc?.parentNode?.insertBefore(filterArea, injectLoc.nextSibling)

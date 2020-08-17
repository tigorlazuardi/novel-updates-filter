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
// @version      1.0.1
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
  const el = document.querySelectorAll(`.${selector}`)
  el.forEach((e) =>
    home
      ? (e.parentElement.parentElement.style.display = display)
      : (e.parentElement.parentElement.parentElement.style.display = display),
  )
}

function toggleFilter(this: HTMLInputElement) {
  const hide = this.checked
  if (hide) {
    setDisplay(this.value, 'none')
  } else {
    setDisplay(this.value, 'block')
  }
  GM_setValue(this.name, hide)
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
  const items = document.createElement('div')
  const checkbox = document.createElement('input')
  const label = document.createElement('label')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.name = k
  checkbox.value = origins[k]
  checkbox.addEventListener('click', toggleFilter)
  checkbox.checked = status
  checkbox.style.position = 'static'

  if (status) {
    setDisplay(origins[k], 'none')
  }

  label.setAttribute('for', k)
  label.innerText = k

  // Making sure checkbox is inline with label
  items.appendChild(checkbox)
  items.appendChild(label)
  items.style.display = 'flex'
  items.style.flexWrap = 'wrap'
  items.style.marginRight = '10px'
  items.style.alignItems = 'center'
  items.style.justifyContent = 'center'
  items.style.minWidth = '50px'

  selections.appendChild(items)
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

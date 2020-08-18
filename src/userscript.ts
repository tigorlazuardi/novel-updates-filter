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
// @version      1.2.0
// @description  Filters novel update result by country
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

const mobileUgerAgents: { [key: string]: string } = {
  android: 'Android',
  ios: 'iPhone',
}

const desktopHome = document.querySelectorAll('.l-content table#myTable')[1]
const mobileHome = document.querySelectorAll('.tbl_m_release')[0]

let isMobile = false

for (const useragent in mobileUgerAgents) {
  if (window.navigator.userAgent.toLowerCase().indexOf(useragent.toLowerCase()) !== -1) {
    isMobile = true
    break
  }
}

const injectLoc =
  mobileHome ??
  desktopHome ??
  // Series Listing and Series Ranking
  document.querySelector('.search_sort') ??
  // Series Finder and Latest Series
  document.querySelector('#rankfilter') ??
  // Rec Lists
  document.querySelector('.ucl_main')

function setDisplay(selector: string, display: boolean) {
  const el = document.querySelectorAll(selector)
  console.error(selector)
  el.forEach((e) => {
    let parent: HTMLElement
    if (isMobile) {
      parent = e.parentElement.parentElement
    } else {
      desktopHome
        ? (parent = e.parentElement.parentElement)
        : (parent = e.parentElement.parentElement.parentElement)
    }
    display ? parent.removeAttribute('style') : (parent.style.display = 'none')
  })
}

function toggleFilter(this: HTMLDivElement) {
  const prev = GM_getValue<boolean>(this.id, false)
  const show = !prev
  if (isMobile) {
    mobileHome
      ? setDisplay(`.l-submain-h > table.tbl_m_release .${origins[this.id]}`, show)
      : setDisplay(`.${origins[this.id]}`, show)
  } else {
    desktopHome
      ? setDisplay(`.l-content > table#myTable .${origins[this.id]}`, show)
      : setDisplay(`.${origins[this.id]}`, show)
  }
  show ? (this.style.backgroundColor = 'white') : (this.style.backgroundColor = '#F9F871')
  GM_setValue(this.id, show)
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

for (const country in origins) {
  const show = GM_getValue<boolean>(country, true)
  const item = document.createElement('div')
  const name = document.createElement('p')
  name.style.marginBottom = '0'

  name.innerText = country

  // Making sure checkbox is inline with label
  item.appendChild(name)
  item.style.display = 'flex'
  item.style.alignItems = 'center'
  item.style.justifyContent = 'center'
  item.style.minWidth = '80px'
  item.style.backgroundColor = 'white'
  item.style.padding = '5px'
  item.style.marginBottom = '15px'
  item.style.marginTop = '5px'
  item.style.marginRight = '5px'
  item.style.cursor = 'pointer'
  item.style.borderRadius = '10px'
  item.style.border = '2px solid #7c5262'
  item.id = country
  item.addEventListener('click', toggleFilter)

  setDisplay(`.${origins[country]}`, show)
  if (!show) {
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

desktopHome || mobileHome
  ? injectLoc?.parentNode?.insertBefore(filterArea, injectLoc)
  : injectLoc?.parentNode?.insertBefore(filterArea, injectLoc.nextSibling)

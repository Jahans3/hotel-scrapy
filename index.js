// @flow
const request: Function = require('request-promise')
const { tripAdvisor }: { tripAdvisor: string } = require('./src/URLs')
const cheerio: Function = require('cheerio')
const fs: Object = require('fs-extra')

// request: tripAdvisor.london-search
// 1-31 oa000
// 31-61 oa030
// ... oa N+30
const allPropsExist: Function = (base: Object, next: Object): boolean => {
  for (const prop: string in base) {
    if (!next[prop]) return false
  }

  return true
}

const applyPropSetters = (object: Object): Object => {
  let newObject: Object = {}

  for (const prop: string in object) {
    newObject = {
      ...newObject,
      [prop]: undefined,
      set [prop] (val) {
        if (val) return val
      }
    }
  }

  return newObject
}
const recursiveFind: Function = async ({ uri, selectors, i = 0 }: { uri: string, selectors: Object, prop: string, i: number }): * => {
  const $: Function = await request({ uri, transform: cheerio.load })

  let hotel: Object = applyPropSetters(selectors)

  for (const prop in selectors) {
    if (selectors.hasOwnProperty(prop)) {
      hotel = { ...hotel, [prop]: $(selectors[prop]).text() }
    }
  }

  console.log({ uri, i, hotel })

  if (i === 10) return hotel

  return allPropsExist(selectors, hotel) ? hotel : recursiveFind({ uri, selectors, i: ++i })
}

const getHotels: Function = async ({ urls, base, selectors }: { urls: Array<string>, base: string, selectors: Object }): Promise<Array<Object>> => {
  const hotels: Array<Object> = []

  for (let i = 0; i < urls.length; i++) {
    hotels.push(await recursiveFind({ uri: `${base}${urls[i]}`, selectors }))
  }

  return hotels
}

const recursiveRequest: Function = async ({ base, url, filename, itemSelector, selectors }: { base: string, url: string, filename: string, itemSelector: string, selectors: Object } = {}): Promise<void> => {
  try {
    const $: Function = await request({ uri: `${base}${url}`, transform: cheerio.load })
    const urls: Array<string> = $(itemSelector).map((i, item) => $(item).data('url')).get().filter(url => url)
    const phones: Array<string> = await getHotels({ base, urls, selectors })
    const hotelPages: Array<Function> = await Promise.all(urls.map((async nexUrl => await request({ uri: `${base}${url}`, transform: cheerio.load }))))
    const hotels: Array<Object> = hotelPages.map((hotel, i) => ({ name: hotel('#HEADING').text(), phone: phones[i] }))

    await fs.writeFile(filename, JSON.stringify(hotels))

    console.log('-------------------SUCCESS------------------')
    console.log(`Saved hotels as ${filename}`)
    console.log('-------------------SUCCESS------------------')
  } catch (error) {
    console.log('--------------------ERROR-------------------')
    console.log(error)
    console.log('--------------------ERROR-------------------')
  }
}

const selectors = { phone: '.blRow .blEntry.phone .ui_link .is-hidden-mobile', name: '#HEADING', address: '.is-hidden-mobile.blEntry.address.ui_link' }

recursiveRequest({ filename: 'trip-advisor_london.text', base: tripAdvisor.base, url: tripAdvisor.cities.london, itemSelector: '.listing .meta_listing', selectors })

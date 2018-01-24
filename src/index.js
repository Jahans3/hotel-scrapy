// @flow
const request: Function = require('request-promise')
const cheerio: Function = require('cheerio')
const fs: Object = require('fs-extra')
const uniqBy = require('lodash.uniqby')

const allPropsExist: Function = (base: Object, next: Object): boolean => {
  for (const prop: string in base) {
    if (!next[prop]) return false
  }

  return true
}

type RecursiveFind = { uri: string, selectors: Object, prop: string, i: number, hotel: Object }

const recursiveFind: Function = async ({ uri, selectors, i = 0, hotel = {} }: RecursiveFind): * => {
  const $: Function = await request({ uri, transform: cheerio.load })

  for (const prop in selectors) {
    if (selectors.hasOwnProperty(prop)) {
      const value = $(selectors[prop]).text()

      if (value && value !== 'undefined') {
        hotel = { ...hotel, [prop]: value }
      }
    }
  }

  console.log({ i, ...hotel })

  if (i === 10) return hotel

  return allPropsExist(selectors, hotel) ? hotel : recursiveFind({ uri, selectors, hotel, i: ++i })
}

const getHotels: Function = async ({ urls, base, selectors }: { urls: Array<string>, base: string, selectors: Object }): Promise<Array<Object>> => {
  const hotels: Array<Object> = []

  for (let i = 0; i < urls.length; i++) {
    hotels.push(await recursiveFind({ uri: `${base}${urls[i]}`, selectors }))
  }

  return hotels
}

const mergeWithPreviousRecords: Function = async ({ filename, next }: { filename: string, next: Array<Object> }): Promise<*> => {
  try {
    const previous: Array<Object> = JSON.parse(await fs.readFile(filename))

    // next.map((hotel: Object) => {
    //   let existing = previous.find(({ name }) => name === hotel.name)
    //
    //   while (existing) {
    //     const existingIndex = previous.findIndex(({ name }) => name === hotel.name)
    //
    //     for (const prop in existing) {
    //       if (hotel.hasOwnProperty(prop)) {
    //         hotel[prop] = hotel[prop] ? hotel[prop] : existing[prop]
    //       }
    //     }
    //
    //     previous.splice(existingIndex, 1)
    //
    //     existing = previous.find(({ name }) => name === hotel.name)
    //   }
    // })

    return uniqBy([ ...previous, ...next ], 'name')
  } catch (error) {
    console.log('-----------------MERGE-ERROR----------------')
    console.log(error)
    console.log('-----------------MERGE-ERROR----------------')

    return next
  }
}

export const recursiveRequest: Function = async ({ base, url, filename, itemSelector, selectors }: { base: string, url: string, filename: string, itemSelector: string, selectors: Object } = {}): Promise<void> => {
  try {
    const $: Function = await request({ uri: `${base}${url}`, transform: cheerio.load })
    const urls: Array<string> = $(itemSelector).map((i, item) => $(item).data('url')).get().filter(url => url)
    const hotels: Array<string> = await getHotels({ base, urls, selectors })
    const merged: Array<Object> = await mergeWithPreviousRecords({ filename, next: hotels })

    await fs.writeFile(filename + '.json', JSON.stringify(merged, null, 4))

    console.log('-------------------SUCCESS------------------')
    console.log(`Saved hotels as ${filename}`)
    console.log('-------------------SUCCESS------------------')
  } catch (error) {
    console.log('-----------------MERGE-ERROR----------------')
    console.log('--------------------ERROR-------------------')
    console.log(error)
    console.log('--------------------ERROR-------------------')
  }
}

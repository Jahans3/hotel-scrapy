// @flow
const { recursiveRequest } = require('./src')
const { tripAdvisor }: { tripAdvisor: string } = require('./configs/index')

const selectors: { phone: string, name: string, address: string } = {
  phone: '.blRow .blEntry.phone .ui_link .is-hidden-mobile',
  name: '#HEADING',
  address: '.is-hidden-mobile.blEntry.address.ui_link'
}

recursiveRequest({
  filename: tripAdvisor.filename,
  base: tripAdvisor.base,
  url: tripAdvisor.cities.london,
  itemSelector: '.listing .meta_listing',
  selectors
})

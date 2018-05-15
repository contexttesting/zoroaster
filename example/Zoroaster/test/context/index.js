const getCountry = async () => 'Iran'

export default async function context() {
  // an async set-up
  await new Promise(r => setTimeout(r, 50))
  this.getCountry = getCountry

  this._destroy = async () => {
    // an async tear-down
    await new Promise(r => setTimeout(r, 50))
  }
}


/**
 * @typedef {Object} Context
 * @property {getCountry} getCountry Returns country of origin.
 */

const Context = {}

export { Context }

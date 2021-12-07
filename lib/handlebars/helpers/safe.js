/* eslint-disable prefer-arrow-callback */

'use strict'

const Handlebars = require('handlebars')
const { encodeHTML, decodeHTML } = require('entities')

/** @function safe
 *
 * @param {string} inp -- the string to render
 *
 * @return web safe string
 *
 * @example
 * {{safe 'The text "is here" 0 < 1'}}
 */
Handlebars.registerHelper('safe', function safe(inp) {
  // Check params and give useful error message since stack traces aren't very useable in layouts
  if (typeof inp !== 'string') {
    throw new Error('[safe] helper requires first parameter to be a string. Got: ' + inp)
  }
  const outp = decodeHTML(inp)
  return new Handlebars.SafeString(encodeHTML(outp))
})

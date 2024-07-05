'use strict'

const Handlebars = require('handlebars')

/** Dynamically generates the source URL for the logotype based on the provided theme and proxy prefix.
 *
 * @param {string} theme - The theme on the header: 'external', 'intranet', or 'student-web'.
 * @param {string} proxyPrefix - The proxy prefix to prepend to the logotype URL.
 *
 * @returns {Handlebars.SafeString} A Handlebars.SafeString containing the dynamically generated logotype URL.
 *
 * @example
 * {{conditionalLogotypeSrc 'external' '/prefix'}}
 */

function conditionalLogotypeSrc(theme, proxyPrefix) {
  if (typeof proxyPrefix !== 'string') {
    throw new Error('Invalid proxyPrefix: must be a string')
  }
  const logotype = theme === 'external' ? 'logotype-white.svg' : 'logotype-blue.svg'
  return new Handlebars.SafeString(`${proxyPrefix}/assets/logotype/${logotype}`)
}

function registerConditionalLogotypeSrcHelper() {
  Handlebars.registerHelper('conditionalLogotypeSrc', conditionalLogotypeSrc)
}

module.exports = {
  registerConditionalLogotypeSrcHelper,
}

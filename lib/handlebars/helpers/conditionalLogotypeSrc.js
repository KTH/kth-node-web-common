'use strict'

const Handlebars = require('handlebars')

/** @function conditionalLogotypeSrc
 *
 * @param {string} theme -- theme on header: external, intranet or student-web
 * @param {string} proxyPrefix
 *
 * @return dynamically rendered logotype, to match header
 *
 * @example
 * {{conditionalLogotypeSrc 'external' '/prefix'}}
 */

function conditionalLogotypeSrc(theme, proxyPrefix) {
  const logotype = theme === 'external' ? 'logotype-white.svg' : 'logotype-blue.svg'
  return new Handlebars.SafeString(`${proxyPrefix}/assets/logotype/${logotype}`)
}

function registerConditionalLogotypeSrcHelper() {
  Handlebars.registerHelper('conditionalLogotypeSrc', conditionalLogotypeSrc)
}

module.exports = {
  registerConditionalLogotypeSrcHelper,
}

'use strict'

const Handlebars = require('handlebars')
const log = require('kth-node-log')

/** @function i18n
 *
 * @param {string} key -- i18n key
 * @param {string} lang -- render for language
 * @param {string} keyPostfix -- variable to append to key for creating a dynamic key
 *
 * @return translated string or error message if none found
 *
 * @example
 * {{i18n 'edit_label' lang}}
 */
module.exports = function (i18n) {
  Handlebars.registerHelper('i18n', function (key, lang, keyPostfix) {
    // Check params and give useful error message since stack traces aren't very useable in layouts
    if (typeof key !== 'string') {
      throw new Error('[i18n] helper requires first parameter to be a string matching an i18n label. Got: ' + key)
    }
    if (typeof lang !== 'string' || lang.length !== 2) {
      throw new Error(
        '[i18n] helper requires second parameter to be a string matching a language, i.e. sv. Key: ' + key
      )
    }
    if (typeof keyPostfix === 'string') {
      key += keyPostfix
    }

    let outp = i18n.message(key, lang)

    if (outp.startsWith('KEY ' + key + ' FOR LANGUAGE')) {
      // Log that translation is missing
      log.warn('[i18n] ' + outp)
    }

    return new Handlebars.SafeString(outp)
  })
}

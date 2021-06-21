'use strict'

/**
 * Language middleware and helper.
 * Helps maintain the selected language by using the session cookie.
 */
const locale = require('locale')
const cookieName = 'language'
const validLanguages = ['sv', 'en']
const defaultLanguage = validLanguages[0]
const supportedLocales = new locale.Locales(validLanguages, defaultLanguage)

/**
 * Initialize locale and language for the current user session (respects cookie: language).
 */
function _init(req, res, newLang) {
  let lang = newLang || req.cookies[cookieName]

  // Only allow lang to be one of the valid languages
  if (lang && !validLanguages.includes(lang)) lang = defaultLanguage

  var chosenLocale

  if (lang) {
    let locales = new locale.Locales(lang, defaultLanguage)
    chosenLocale = locales.best(supportedLocales)
  } else {
    let locales = new locale.Locales(req.headers['accept-language'], defaultLanguage)
    chosenLocale = locales.best(supportedLocales)
  }

  // If we got an explicit language we set the language cookie
  if (newLang) {
    res.cookie(cookieName, chosenLocale.language, { secure: true, sameSite: 'strict', httpOnly: true })
  } else if (!req.cookies[cookieName]) {
    // Make sure language cookie is set so subsequent requests are guaranteed to use the same language
    res.cookie(cookieName, lang || 'sv', { secure: true, sameSite: 'strict', httpOnly: true })
  }

  res.locals.locale = chosenLocale
  // Backwards compatibility only in case someone accessed the prop directly:
  res.locals.language = chosenLocale.language

  return chosenLocale
}

/**
 * Helper that gets the current language from the session
 */
function _getLanguage(res) {
  return res.locals.locale && res.locals.locale.language
}

/**
 * Middleware that checks for l-flag and stores its value in the session
 */
function _languageHandler(req, res, next) {
  // Set locale if not already done by other middleware
  // You can customise behaviour by adding middleware before this one
  if (!res.locals.locale) {
    _init(req, res, req.query['l'])
  }
  next()
}

/**
 * The language cookie is set if the user forced the language through the URL (?l=sv)
 *
 * @param {any} req
 * @returns language from language-cookie
 */
function _cookieLanguage(req) {
  const languageCookie = req.cookies[cookieName]
  return languageCookie === 'undefined' || languageCookie === undefined ? undefined : languageCookie
}

module.exports = {
  getLanguage: _getLanguage,
  init: _init,
  validLanguages: validLanguages,
  defaultLanguage: defaultLanguage,
  languageHandler: _languageHandler,
  cookieLanguage: _cookieLanguage,
}

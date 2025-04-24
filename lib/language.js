'use strict'

/**
 * Language middleware and helper.
 * Helps maintain the selected language by using the session cookie.
 */
const locale = require('locale')

const cookieName = 'language'
const cookieOptions = { secure: true, sameSite: 'strict', httpOnly: true }
const validLanguages = ['sv', 'en']
const defaultLanguage = 'sv'

const supportedLocales = new locale.Locales(validLanguages, defaultLanguage)

const validLanguage = lang => (validLanguages.includes(lang) ? lang : undefined)

const useAcceptLanguageOrDefault = preferredLanguages => {
  const preferredLocales = new locale.Locales(preferredLanguages, defaultLanguage)
  const bestLocale = preferredLocales.best(supportedLocales)
  return bestLocale.language
}

/**
 * Initialize locale and language for the current user session (respects cookie: language).
 */
function _init(req, res, newLang) {
  const lang =
    validLanguage(newLang) ||
    validLanguage(req.cookies[cookieName]) ||
    useAcceptLanguageOrDefault(req.headers['accept-language'])

  if (req.cookies[cookieName] !== lang) {
    res.cookie(cookieName, lang, cookieOptions)
  }

  const locales = new locale.Locales(lang)
  const bestLocale = locales.best(supportedLocales)
  res.locals.locale = bestLocale
  // Backwards compatibility only in case someone accessed the prop directly:
  res.locals.language = bestLocale.language
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
    _init(req, res, req.query.l)
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
  validLanguages,
  defaultLanguage,
  languageHandler: _languageHandler,
  cookieLanguage: _cookieLanguage,
}

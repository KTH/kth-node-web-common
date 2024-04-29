'use strict'

/**
 * Language middleware and helper.
 * Helps maintain the selected language by using the session cookie.
 */
const locale = require('locale')

const cookieName = 'language'
const cookieOptions = { secure: true, sameSite: 'strict', httpOnly: true }
const validLanguages = ['sv', 'en']
const defaultLanguage = validLanguages[0]
const supportedLocales = new locale.Locales(validLanguages, defaultLanguage)

const validLanguage = lang => {
  if (validLanguages.includes(lang)) {
    return lang
  }
}

/**
 * Initialize locale and language for the current user session (respects cookie: language).
 */
function _init(req, res, newLang) {
  let lang =
    validLanguage(newLang) ||
    validLanguage(req.cookies[cookieName]) ||
    validLanguage(req.headers['accept-language']) ||
    defaultLanguage

  const locales = new locale.Locales(lang, defaultLanguage)
  const chosenLocale = locales.best(supportedLocales)

  // Don't reset the cookie with the same language
  if (req.cookies[cookieName] !== lang) {
    res.cookie(cookieName, chosenLocale.language, cookieOptions)
  }

  res.locals.locale = chosenLocale
  // Backwards compatibility only in case someone accessed the prop directly:
  res.locals.language = chosenLocale.language
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
  init: _init,
  validLanguages,
  defaultLanguage,
  languageHandler: _languageHandler,
  cookieLanguage: _cookieLanguage,
}

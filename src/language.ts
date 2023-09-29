/**
 * Language middleware and helper.
 * Helps maintain the selected language by using the session cookie.
 */
import { Response } from 'express'
import locale from 'locale'

const cookieName = 'language'
export type SupportedLanguage = 'sv' | 'en'
const supportedLanguages: SupportedLanguage[] = ['sv', 'en']
const defaultLanguage = supportedLanguages[0]
const supportedLocales = new locale.Locales(supportedLanguages, defaultLanguage)

/**
 * Initialize locale and language for the current user session (respects cookie: language).
 */
function init(req, res, newLang) {
  let lang = newLang || req.cookies[cookieName]

  // Only allow lang to be one of the valid languages
  if (lang && !supportedLanguages.includes(lang)) lang = defaultLanguage

  let chosenLocale

  if (lang) {
    const locales = new locale.Locales(lang, defaultLanguage)
    chosenLocale = locales.best(supportedLocales)
  } else {
    const locales = new locale.Locales(req.headers['accept-language'], defaultLanguage)
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
function getLanguage(res: Response): SupportedLanguage {
  const lang = res.locals.locale && res.locals.locale.language
  if (supportedLanguages.includes(lang)) return lang
  return defaultLanguage
}

/**
 * Middleware that checks for l-flag and stores its value in the session
 */
function languageHandler(req, res, next) {
  // Set locale if not already done by other middleware
  // You can customise behaviour by adding middleware before this one
  if (!res.locals.locale) {
    init(req, res, req.query.l)
  }
  next()
}

/**
 * The language cookie is set if the user forced the language through the URL (?l=sv)
 *
 * @param {any} req
 * @returns language from language-cookie
 */
function cookieLanguage(req) {
  const languageCookie = req.cookies[cookieName]
  return languageCookie === 'undefined' || languageCookie === undefined ? undefined : languageCookie
}

export default {
  init,
  getLanguage,
  supportedLanguages,
  defaultLanguage,
  languageHandler,
  cookieLanguage,
}

// const locale = require('locale')
const { languageHandler } = require('./language')

describe('languageHandler', () => {
  const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: true }
  // Example from Chrome on macOS with Preferred languages set to 1. English (United Kingdom),
  // 2. English (United States), 3. English, 4. Swedish, 5. Norwegian Bokmål, 6. German, and 7. Latin
  const preferredLanguages = 'en-GB,en-US;q=0.9,en;q=0.8,sv;q=0.7,nb;q=0.6,de;q=0.5,la;q=0.4'
  const cookieName = 'language'

  it('should save requested language in cookie', () => {
    const requestedLanguage = 'sv'
    const req = { query: { l: requestedLanguage }, cookies: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, requestedLanguage, cookieOptions)
    expect(res.locals.locale.language).toEqual(requestedLanguage)
  })

  it('should not save cookie if it is already set', () => {
    const presetLanguage = 'sv'
    const req = { cookies: { [cookieName]: presetLanguage }, query: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).not.toHaveBeenCalled()
    expect(res.locals.locale.language).toEqual(presetLanguage)
  })

  it('should not save invalid language in cookie', () => {
    const invalidLanguage = 'fr'
    const defaultLanguage = 'sv'
    const req = { query: { l: invalidLanguage }, cookies: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, defaultLanguage, cookieOptions)
    expect(res.locals.locale.language).toEqual(defaultLanguage)
  })

  it('should use default language as fallback', () => {
    const defaultLanguage = 'sv'
    const req = { query: {}, cookies: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, defaultLanguage, cookieOptions)
    expect(res.locals.locale.language).toEqual(defaultLanguage)
  })

  it('should use accept-language if present', () => {
    const acceptLanguage = preferredLanguages
    const expectedLanguage = 'en'
    const req = { query: {}, cookies: {}, headers: { 'accept-language': acceptLanguage } }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, expectedLanguage, cookieOptions)
    expect(res.locals.locale.language).toEqual(expectedLanguage)
  })

  it('should use requestedLanguage even if language cookie is present', () => {
    const requestedLanguage = 'en'
    const presetLanguage = 'sv'
    const req = {
      query: { l: requestedLanguage },
      cookies: { [cookieName]: presetLanguage },
      headers: {},
    }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, requestedLanguage, cookieOptions)
    expect(res.locals.locale.language).toEqual(requestedLanguage)
  })

  it('should use language cookie if requestedLanguage is invalid', () => {
    const requestedLanguage = 'fr'
    const acceptLanguage = preferredLanguages
    const expectedLanguage = 'en'
    const req = {
      query: { l: requestedLanguage },
      cookies: {},
      headers: { 'accept-language': acceptLanguage },
    }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, expectedLanguage, cookieOptions)
    expect(res.locals.locale.language).toEqual(expectedLanguage)
  })

  it('should use client language if cookie language is invalid', () => {
    const cookieLanguage = 'fr'
    const acceptLanguage = preferredLanguages
    const expectedLanguage = 'en'
    const req = {
      query: {},
      cookies: { [cookieName]: cookieLanguage },
      headers: { 'accept-language': acceptLanguage },
    }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, expectedLanguage, cookieOptions)
    expect(res.locals.locale.language).toEqual(expectedLanguage)
  })
})

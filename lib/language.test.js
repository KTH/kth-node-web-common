// const locale = require('locale')
const { languageHandler } = require('./language')

describe('languageHandler', () => {
  const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: true }
  const cookieName = 'language'

  it('should save language if requested and valid', () => {
    const requestedLanguage = 'sv'
    const req = { query: { l: requestedLanguage }, cookies: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, requestedLanguage, cookieOptions)
    expect(res.locals.locale.language).toEqual(requestedLanguage)
  })

  it('should not save language in cookie if language has not changed', () => {
    const presetLanguage = 'sv'
    const req = { cookies: { [cookieName]: presetLanguage }, query: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).not.toHaveBeenCalled()
  })

  it('should not save invalid language', () => {
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

  it('should update language if requested ', () => {
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

  it('should use accept-language if requested language and cookie are unset', () => {
    const acceptLanguage = 'en,sv;q=0.9'
    const expectedLanguage = 'en'
    const req = { query: {}, cookies: {}, headers: { 'accept-language': acceptLanguage } }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, expectedLanguage, cookieOptions)
    expect(res.locals.locale.language).toEqual(expectedLanguage)
  })

  it('should use accept-language if requested language is invalid and cookie is unset', () => {
    const requestedLanguage = 'fr'
    const acceptLanguage = 'en,sv;q=0.9'
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

  it('should use accept-language if cookie language is invalid', () => {
    const cookieLanguage = 'fr'
    const acceptLanguage = 'en,sv;q=0.9'
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

// const locale = require('locale')
const { languageHandler } = require('./language')

describe('languageHandler', () => {
  const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: true }
  const cookieName = 'language'

  it('should save requested language in cookie', () => {
    const requestedLanguage = 'sv'
    const req = { query: { l: requestedLanguage }, cookies: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, requestedLanguage, cookieOptions)
  })

  it('should not save cookie if it is already set', () => {
    const presetLanguage = 'sv'
    const req = { cookies: { [cookieName]: presetLanguage }, query: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).not.toHaveBeenCalled()
  })

  it('should not save invalid language in cookie', () => {
    const invalidLanguage = 'fr'
    const defaultLanguage = 'sv'
    const req = { query: { l: invalidLanguage }, cookies: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, defaultLanguage, cookieOptions)
  })

  it('should use default language as fallback', () => {
    const defaultLanguage = 'sv'
    const req = { query: {}, cookies: {}, headers: {} }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, defaultLanguage, cookieOptions)
  })

  it('should use accept-language if present', () => {
    const requestedLanguage = 'en'
    const req = { query: {}, cookies: {}, headers: { 'accept-language': requestedLanguage } }
    const res = { locals: {}, cookie: jest.fn() }
    const next = jest.fn()

    languageHandler(req, res, next)
    expect(res.cookie).toHaveBeenCalledWith(cookieName, requestedLanguage, cookieOptions)
  })
})

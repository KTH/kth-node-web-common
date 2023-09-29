// handlebar mocks
const mockErrorPage = '<html>error</html>'
const mockTemplate = jest.fn(() => mockErrorPage)
jest.mock('handlebars', () => ({ helpers: {}, compile: jest.fn(() => mockTemplate) }))

jest.mock('@kth/log')

const handlebars = require('handlebars')

const errorHandler = require('./error')

const mockI18n = { message: jest.fn(label => label) }
const res = { format: jest.fn(), sendStatus: jest.fn(), send: jest.fn(), status: jest.fn(() => res) }
const req = { query: {} }
const err = {}
const isProd = true
const lang = 'sv'
const mockFormat = (formatHandlers, param2) => {
  formatHandlers['text/html']()
}

describe('Error page', () => {
  describe('text/html', () => {
    beforeEach(() => {
      handlebars.helpers = {}
      res.format = mockFormat
    })
    describe('handlebar template', () => {
      beforeEach(() => {
        handlebars.helpers = {
          prefixStyle: jest.fn(),
          render: jest.fn(),
          extend: jest.fn(),
        }
      })
      it('render template if all required handlebar helpers are registered', () => {
        errorHandler.renderErrorPage(res, req, 444, mockI18n, isProd, lang, err)

        expect(res.send).toBeCalledWith(mockErrorPage)
      })
      it('compile template from string', () => {
        errorHandler.renderErrorPage(res, req, 444, mockI18n, isProd, lang, err)

        expect(handlebars.compile).toBeCalledWith(expect.stringContaining('<title>{{headTitle}}</title>'))
      })
      it('render template with correct statusCode', () => {
        errorHandler.renderErrorPage(res, req, 456, mockI18n, isProd, lang, err)

        expect(mockTemplate).toBeCalledWith(expect.objectContaining({ statusCode: 456 }))
      })
      it('render template with translated 404 headTitle', () => {
        errorHandler.renderErrorPage(res, req, 404, mockI18n, isProd, lang, err)

        expect(mockTemplate).toBeCalledWith(expect.objectContaining({ headTitle: 'error_404_head_title' }))
      })
      it('render template with translated 403 headTitle', () => {
        errorHandler.renderErrorPage(res, req, 403, mockI18n, isProd, lang, err)

        expect(mockTemplate).toBeCalledWith(expect.objectContaining({ headTitle: 'error_403_head_title' }))
      })
      it('render template with translated 500 headTitle for unknown statuscode', () => {
        errorHandler.renderErrorPage(res, req, 666, mockI18n, isProd, lang, err)

        expect(mockTemplate).toBeCalledWith(expect.objectContaining({ headTitle: 'error_500_head_title' }))
      })

      it('hides error stack if "isProd = true"', () => {
        const testError = new Error('This is a test')
        errorHandler.renderErrorPage(res, req, 666, mockI18n, true, lang, testError)

        expect(mockTemplate).toBeCalledWith(expect.objectContaining({ error: {} }))
      })

      it('shows error stack if "isProd = false"', () => {
        const testError = new Error('This is a test')
        errorHandler.renderErrorPage(res, req, 666, mockI18n, false, lang, testError)

        expect(mockTemplate).toBeCalledWith(expect.objectContaining({ error: testError }))
      })
    })
    describe('Fallback', () => {
      it('respons with fallback if no handlebar helpers are registered', () => {
        errorHandler.renderErrorPage(res, req, 404, mockI18n, isProd, lang, err)
        expect(res.sendStatus).toBeCalledWith(404)
      })
      it('uses correct statusCode for fallback', () => {
        const statusCode = 403

        errorHandler.renderErrorPage(res, req, statusCode, mockI18n, isProd, lang, err)
        expect(res.sendStatus).toBeCalledWith(statusCode)
      })

      it('respons with fallback if "extend" helper is missing', () => {
        handlebars.helpers = {
          prefixStyle: jest.fn(),
          render: jest.fn(),
        }
        errorHandler.renderErrorPage(res, req, 404, mockI18n, isProd, lang, err)
        expect(res.sendStatus).toBeCalledWith(404)
      })
      it('respons with fallback if "prefixStyle" helper is missing', () => {
        handlebars.helpers = {
          extend: jest.fn(),
          render: jest.fn(),
        }
        errorHandler.renderErrorPage(res, req, 404, mockI18n, isProd, lang, err)
        expect(res.sendStatus).toBeCalledWith(404)
      })
      it('respons with fallback if "render" helper is missing', () => {
        handlebars.helpers = {
          extend: jest.fn(),
          prefixStyle: jest.fn(),
        }
        errorHandler.renderErrorPage(res, req, 404, mockI18n, isProd, lang, err)
        expect(res.sendStatus).toBeCalledWith(404)
      })
    })
  })
})

const handlebars = require('handlebars')
const log = require('@kth/log')
const { registerBreadcrumbHelper, breadcrumbs, getBreadcrumbsMarkup } = require('./breadcrumbs')

jest.mock('@kth/log')
jest.mock('handlebars')

describe('registerBreadcrumbHelper', () => {
  it('Registers breadcrumbs helper', () => {
    registerBreadcrumbHelper()
    expect(handlebars.registerHelper).toHaveBeenCalledWith('breadcrumbs', breadcrumbs)
  })
})

describe('getBreadcrumbsMarkup', () => {
  it('should return null and log a warning if the input is not a valid path list', () => {
    const invalidPathList = [{}]
    const result = breadcrumbs(invalidPathList, 'en')
    expect(result).toBeNull()
    expect(log.warn).toHaveBeenCalledWith(
      '[breadcrumbs] helper requires first parameter to be a list of path item objects'
    )
  })

  it('should generate breadcrumbs HTML for a valid path list in English', () => {
    const validPathList = [
      { url: '/', label: 'Kth' },
      { url: '/test1', label: 'Test 1' },
      { url: '/test2', label: 'Test 2' },
    ]
    const result = getBreadcrumbsMarkup(validPathList, 'en')
    expect(result).toMatchSnapshot()
  })

  it('should generate breadcrumbs HTML for a valid path list in Swedish', () => {
    const validPathList = [
      { url: '/', label: 'Kth' },
      { url: '/test1', label: 'Test 1' },
      { url: '/test2', label: 'Test 2' },
    ]
    const result = getBreadcrumbsMarkup(validPathList, 'sv')
    expect(result).toMatchSnapshot()
  })
})

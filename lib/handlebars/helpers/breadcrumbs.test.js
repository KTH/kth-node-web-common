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

    // Define the expected output
    const expectedOutput = `
        <nav id="breadcrumbs" aria-label="Breadcrumbs" class="col-12 col-md-9">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Kth</a></li>
            <li class="breadcrumb-item"><a href="/test1">Test 1</a></li>
            <li class="breadcrumb-item"><a href="/test2">Test 2</a></li>
          </ol>
        </nav>
      `
      .trim()
      .replace(/[\s,]+/g, '')

    // Remove white spaces and compare the results
    expect(result.trim().replace(/[\s,]+/g, '')).toBe(expectedOutput)
  })

  it('should generate breadcrumbs HTML for a valid path list in Swedish', () => {
    const validPathList = [
      { url: '/', label: 'Kth' },
      { url: '/test1', label: 'Test 1' },
      { url: '/test2', label: 'Test 2' },
    ]
    const result = getBreadcrumbsMarkup(validPathList, 'sv')

    const expectedOutput = `
        <nav id="breadcrumbs" aria-label="Brödsmulor" class="col-12 col-md-9">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Kth</a></li>
            <li class="breadcrumb-item"><a href="/test1">Test 1</a></li>
            <li class="breadcrumb-item"><a href="/test2">Test 2</a></li>
          </ol>
        </nav>
      `
      .trim()
      .replace(/[\s,]+/g, '')

    // Remove white spaces and compare the results
    expect(result.trim().replace(/[\s,]+/g, '')).toBe(expectedOutput)
  })
})

const Handlebars = require('handlebars')
const { conditionalLogotypeSrc, registerConditionalLogotypeSrcHelper } = require('./conditionalLogotypeSrc')

jest.mock('handlebars')

Handlebars.SafeString = jest.fn().mockImplementation(str => ({ string: str }))

describe('registerConditionalLogotypeSrcHelper', () => {
  it('Registers conditionalLogotypeSrc helper', () => {
    registerConditionalLogotypeSrcHelper()
    expect(Handlebars.registerHelper).toHaveBeenCalledWith('conditionalLogotypeSrc', conditionalLogotypeSrc)
  })
})

describe('conditionalLogotypeSrc', () => {
  it('should throw an error if proxyPrefix is not a string', () => {
    const theme = 'external'
    const invalidProxyPrefix = 123

    expect(() => {
      conditionalLogotypeSrc(theme, invalidProxyPrefix)
    }).toThrow(new Error('Invalid proxyPrefix: must be a string'))
  })

  it('should return logotype-white.svg for external theme', () => {
    const theme = 'external'
    const proxyPrefix = '/prefix'

    const result = conditionalLogotypeSrc(theme, proxyPrefix)
    expect(result.string).toMatchSnapshot()
  })

  it('should return logotype-blue.svg for intranet theme', () => {
    const theme = 'intranet'
    const proxyPrefix = '/prefix'

    const result = conditionalLogotypeSrc(theme, proxyPrefix)
    expect(result.string).toMatchSnapshot()
  })

  it('should return logotype-blue.svg for student-web theme', () => {
    const theme = 'student-web'
    const proxyPrefix = '/prefix'

    const result = conditionalLogotypeSrc(theme, proxyPrefix)
    expect(result.string).toMatchSnapshot()
  })
})

const cortina = require('./cortina')

jest.mock('@kth/log', () => ({ error: jest.fn() }))

jest.mock('@kth/cortina-block', () => jest.fn())
const mockCortinaPackage = require('@kth/cortina-block')

describe('cortina wrapper styleVersion', () => {
  const mockReq = { query: {}, url: '', hostname: '' }
  const mockRes = { locals: {} }
  const mockNext = jest.fn()

  mockCortinaPackage.mockResolvedValue([])

  test('use "view style10" for styleVersion 10', async () => {
    const options = {
      styleVersion: 10,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ version: 'style10' }))
  })
  test('use "view style9" for styleVersion 9', async () => {
    const options = {
      styleVersion: 9,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ version: 'style9' }))
  })
  test('use "view style9" when styleVersion is missing', async () => {
    const options = {
      styleVersion: undefined,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ version: 'style9' }))
  })
})

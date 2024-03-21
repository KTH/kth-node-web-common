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

  test('use redis key with "_style10" for styleVersion 10', async () => {
    const options = {
      styleVersion: 10,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ redisKey: 'CortinaBlock_style10_' }))
  })
  test('use redis key with "_style9" for styleVersion 9', async () => {
    const options = {
      styleVersion: 9,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ redisKey: 'CortinaBlock_style9_' }))
  })
  test('use redis key with "_style9" when styleVersion is missing', async () => {
    const options = {
      styleVersion: undefined,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ redisKey: 'CortinaBlock_style9_' }))
  })
  test('combine style suffix with custom key', async () => {
    const options = {
      redisKey: 'custom_key_',
      styleVersion: 10,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ redisKey: 'custom_key_style10_' }))
  })
})

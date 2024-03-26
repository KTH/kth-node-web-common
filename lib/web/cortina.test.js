const cortina = require('./cortina')

jest.mock('@kth/log', () => ({ error: jest.fn() }))

jest.mock('@kth/cortina-block', () => jest.fn())
const mockCortinaPackage = require('@kth/cortina-block')

describe('cortina wrapper styleVersion', () => {
  const mockReq = { query: {}, url: '', hostname: '' }
  const mockRes = { locals: {} }
  const mockNext = jest.fn()

  mockCortinaPackage.mockResolvedValue([])

  test('use "view style10" when useStyle10 is true', async () => {
    const options = {
      useStyle10: true,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ version: 'style10' }))
  })
  test('use "view style9" when useStyle10 is false', async () => {
    const options = {
      useStyle10: false,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ version: 'style9' }))
  })
  test('use "view style9" when useStyle10 is missing', async () => {
    const options = {
      useStyle10: undefined,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ version: 'style9' }))
  })

  test('use redis key with "_style10" when useStyle10 is true', async () => {
    const options = {
      useStyle10: true,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ redisKey: 'CortinaBlock_style10_' }))
  })
  test('use redis key with "_style9" when useStyle10 is false', async () => {
    const options = {
      useStyle10: false,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ redisKey: 'CortinaBlock_style9_' }))
  })
  test('use redis key with "_style9" when useStyle10 is missing', async () => {
    const options = {
      useStyle10: undefined,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ redisKey: 'CortinaBlock_style9_' }))
  })
  test('combine style suffix with custom key', async () => {
    const options = {
      redisKey: 'custom_key_',
      useStyle10: true,
    }

    const middleware = cortina(options)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockCortinaPackage).toBeCalledWith(expect.objectContaining({ redisKey: 'custom_key_style10_' }))
  })
})

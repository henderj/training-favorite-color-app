import { server } from '../../src/server'
import { FastifyInstance } from 'fastify'

describe('foo route unit tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await server({})
  })
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /foo', () => {
    test('valid response', async () => {
      const res = await app.inject({
        url: '/foo'
      })
      expect(res.statusCode).toEqual(200)
      expect(res.json()).toEqual({
        bar: 'Hello World'
      })
    })
  })
})

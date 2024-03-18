import { server } from '../../src/server'
import { FastifyInstance } from 'fastify'

describe('health route unit tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await server({})
  })
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /health', () => {
    test('test health check response', async () => {
      const res = await app.inject({
        url: '/health'
      })
      expect(res.statusCode).toEqual(200)
      expect(res.json().status).toEqual('pass')
    })
  })

  describe('GET /health/details', () => {
    test('test detailed health check response', async () => {
      const res = await app.inject({
        url: '/health/details'
      })
      expect(res.statusCode).toEqual(200)
      expect(res.json().status).toEqual('pass')
    })
  })
})

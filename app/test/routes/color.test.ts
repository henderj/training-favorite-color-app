import { server } from '../../src/server'
import { FastifyInstance } from 'fastify'

describe('color route unit tests', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await server({})
  })
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /color/{byu_id}', () => {
    test('valid response', async () => {
      await app.inject({
        url: '/color/123456789',
        method: 'PUT',
        payload: {
          color: 'blue'
        }
      })
      const res = await app.inject({
        url: '/color/123456789'
      })
      expect(res.statusCode).toEqual(200)
      expect(res.json()).toEqual({ color: 'blue' })
    })
  })

  describe('PUT /color/{byu_id}', () => {
    test('valid response', async () => {
      const res = await app.inject({
        url: '/color/123456789',
        method: 'PUT',
        payload: {
          color: 'blue'
        }
      })
      expect(res.statusCode).toEqual(200)
    })
  })

  describe('DELETE /color/{byu_id}', () => {
    test('valid response', async () => {
      const res = await app.inject({
        url: '/color/123456789',
        method: 'DELETE'
      })
      expect(res.statusCode).toEqual(200)
    })
  })

  describe('GET /color', () => {
    test('valid response', async () => {
      const res = await app.inject({
        url: '/color'
      })
      expect(res.statusCode).toEqual(200)
      // expect the response to be an array of colors
      expect(res.json()).toBeInstanceOf(Array)
    })
  })
})

import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { ColorObject, ColorSchema } from '../../models/Color'

/*
GET /color             Get all colors
GET /color/{byu_id}     Get favorite color for {byu_id}
PUT /color/{byu_id}     Create/Update favorite color
{ "color": string }
DELETE /color/{byu_id}  Delete favorite color
*/

const colors = new Map<string, ColorObject>()

const color: FastifyPluginAsync = async (fastifyApp, opts): Promise<void> => {
  const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

  fastify.get(
    '/:byu_id',
    {
      schema: {
        response: {
          200: ColorSchema
        }
      }
    },
    async (request: FastifyRequest<{ Params: { byu_id: string } }>, reply) => {
      const byuId = request.params.byu_id
      const color = colors.get(byuId)
      if (color != null) {
        await reply.send(color)
      } else {
        await reply.status(404).send()
      }
    }
  )

  fastify.put(
    '/:byu_id',
    {
      schema: {
        body: ColorSchema
      }
    },
    async (
      request: FastifyRequest<{
        Params: { byu_id: string }
        Body: ColorObject
      }>,
      reply
    ) => {
      const byuId = request.params.byu_id
      const color = request.body
      colors.set(byuId, color)
      await reply.send()
    }
  )

  fastify.delete(
    '/:byu_id',
    async (request: FastifyRequest<{ Params: { byu_id: string } }>, reply) => {
      const byuId = request.params.byu_id
      colors.delete(byuId)
      await reply.send()
    }
  )

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Array(
            Type.Object({ id: Type.String(), color: Type.String() })
          )
        }
      }
    },
    async (request, reply) => {
      const allColors = Array.from(colors).map(([id, color]) => ({
        id,
        color: color.color
      }))

      await reply.send(allColors)
    }
  )
}

export default color

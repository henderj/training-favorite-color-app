import { FastifyPluginAsync } from 'fastify'
import { FooBarSchema, FooBar } from '../../models/FooBar'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const foo: FastifyPluginAsync = async (fastifyApp, opts): Promise<void> => {
  // this adds type inference for these routes
  const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

  // because this file is in the /foo directory, this endpoint will actually be at `/foo`
  fastify.get('/', {
    schema: {
      response: {
        200: FooBarSchema
      }
    }
  }, async (request, reply) => {
    const foobar: FooBar = {
      bar: 'Hello World'
    }
    await reply.send(foobar)
  })
}

export default foo

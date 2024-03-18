import Fastify, { FastifyInstance, FastifyBaseLogger } from 'fastify'
import AutoLoad from '@fastify/autoload'
import { join } from 'path'
import { ErrorInternalServerError, ErrorInvalidRequest, ErrorNotFound } from './models/error'

export interface ServerOptions {
  logger?: FastifyBaseLogger
  // here's where you define any other shared classes to pass to your routes
}

// function that builds and configures the fastify server
export async function server (options: ServerOptions): Promise<FastifyInstance> {
  const fastify = await Fastify({
    logger: options.logger
  })
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  await fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: {}
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  await fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: {
      // here's where you can pass in controllers, services or other shared classes to your routes
    }
  })

  // Handle errors and return formatted responses
  await fastify.setNotFoundHandler(async function (request, reply) {
    await reply.code(404).send(ErrorNotFound())
  })
  await fastify.setErrorHandler(async function (error, request, reply) {
    if (error.statusCode === 400) {
      fastify.log.warn({ err: error }, 'Invalid request error')
      await reply.code(400).send(ErrorInvalidRequest(error.message))
    } else if (error.statusCode === 404) {
      await reply.code(404).send(ErrorNotFound())
    } else {
      fastify.log.error({ err: error }, 'Internal Server error')
      await reply.code(error.statusCode ?? 500).send(ErrorInternalServerError(error.statusCode, error.message))
    }
  })

  return fastify
}

import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import Swagger, {} from '@fastify/swagger'
import SwaggerUi from '@fastify/swagger-ui'
import { ServerOptions } from '../server'

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify: FastifyInstance, opts: ServerOptions) {
  // Add the @fastify/swagger plugin (https://github.com/fastify/fastify-swagger) to generate the openapi specification
  await fastify.register(Swagger, {
    openapi: {
      info: {
        title: 'training-fav-color-app',
        description: 'training-fav-color-app',
        version: '1.0.0'
        // TODO fill out any other relevant information about the Openapi spec file
      }
    }
    // swagger: {...} // if you need a swagger v2 generated use this option
  })

  // Add the @fastify/swagger-ui plugin (https://github.com/fastify/fastify-swagger-ui) to serve and display the openapi specification
  await fastify.register(SwaggerUi, {
    routePrefix: '/spec',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: true
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  })
})

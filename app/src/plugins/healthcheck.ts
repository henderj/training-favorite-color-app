import fp from 'fastify-plugin'
import { HealthCheck, Status, noopExecutorFactory, healthCheckFastify } from '@byu-oit/healthcheck'
import { FastifyRequest, FastifyInstance } from 'fastify'
import { ServerOptions } from '../server'

// Uses the @byu-oit/healthcheck plugin https://github.com/byu-oit/healthcheck to automatically provide health checks
module.exports = fp(async function (fastify: FastifyInstance, opts: ServerOptions) {
  const version = '1' // public version of the service
  const releaseId = '1.0.0' // release number of the service

  // is_alive health check
  const healthCheck = new HealthCheck<[FastifyRequest?]>({ info: { version, releaseId } })
    .add('noop', 'alive', noopExecutorFactory(Status.Text.PASS))
  await fastify.register(healthCheckFastify, {
    logLevel: 'error',
    path: '/health',
    healthCheck
  })

  // detailed health check
  const detailedHealthCheck = new HealthCheck<[FastifyRequest?]>({ info: { version, releaseId } })
    .add('noop', 'alive', noopExecutorFactory(Status.Text.PASS))
  // you can add extra checks to your health check by defining them here, for instance can your server connect to the db? to external API? etc.
  // .add('db', 'connections', ...
  await fastify.register(healthCheckFastify, {
    logLevel: 'error',
    path: '/health/details',
    healthCheck: detailedHealthCheck
  })
})

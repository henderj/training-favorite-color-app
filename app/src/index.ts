import { server } from './server'
import defaultLogger from '@byu-oit/logger'
import { FastifyBaseLogger } from 'fastify'
export const logger: FastifyBaseLogger = defaultLogger()

async function run (): Promise<void> {
  // Set up the app, shared classes, and any external connections necessary, like connecting to a Database
  const app = await server({
    logger
  })

  await app.listen({
    host: '0.0.0.0',
    port: 8080
  })
}

run()
  .then(r => {})
  .catch(err => logger.error({ err }, 'Error starting app'))

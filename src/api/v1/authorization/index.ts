import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { requiresAuth } from '../../middlewares'

import login from './routes/login'
import logout from './routes/logout'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.post('/login', { ...requiresAuth(fastify), handler: login })
  fastify.post('/logout', { ...requiresAuth(fastify), handler: logout })
}

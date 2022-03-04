import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import login from './routes/login'
import logout from './routes/logout'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.post('/login', login)
  fastify.get('/logout', logout)
}

import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import addUser from './routes/addUser'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.post('/add-user', addUser)
}

import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import employeesCreate from './routes/employees.create'
import employeesDelete from './routes/employees.delete'
import employeesGet from './routes/employees.get'
import employeesUpdate from './routes/employees.update'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.get('/get', employeesGet)
  fastify.post('/create', employeesCreate)
  fastify.post('/delete', employeesDelete)
  fastify.post('/update', employeesUpdate)
}

import { FastifyReply, FastifyRequest } from 'fastify'

export default async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  await res.send({ hello: 'world' })
}

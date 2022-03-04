import { FastifyReply, FastifyRequest } from 'fastify'

export default async (req: FastifyRequest<{ Params: { username: string } }>, res: FastifyReply): Promise<void> => {

}

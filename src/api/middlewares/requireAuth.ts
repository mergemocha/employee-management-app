import { FastifyReply, FastifyRequest } from 'fastify'

export default async (req: FastifyRequest, res: FastifyReply, done: (err?: any) => void): Promise<void> => {
  const hasHeader = !!req.headers.authorization

  // TODO: Validate token authenticity

  if (!hasHeader /* || !tokenIsValid(req.headers.authorization) */) {
    done(new Error('Authorization header not present'))
  }
}

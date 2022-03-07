import { FastifyReply, FastifyRequest } from 'fastify'
import { getSession, terminateSession } from '../../../../security/session'

export default async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const session = await getSession(req.headers.authorization as string)

  if (!session) {
    await res.status(500).send({ message: 'Error during logout' })
    logger.error('Session not found')
  } else {
    await terminateSession(session)
    await res.status(200).send({ message: 'Logout successful' })
    logger.info(`Session ${session.id} terminated`)
  }
}

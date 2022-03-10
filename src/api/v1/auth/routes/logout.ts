import { FastifyReply, FastifyRequest } from 'fastify'
import { getSession, terminateSession } from '../../../../security/session'

export default async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const session = await getSession(req.headers.authorization as string)

  if (!session) {
    logger.warn(`Session for token ${req.headers.authorization} not terminated; session could not be found.`)
    await res.status(410).send({ message: 'Unknown session' })
  } else {
    await terminateSession(session)
    logger.info(`Session for token ${req.headers.authorization} terminated.`)
    await res.status(200).send({ message: 'OK' })
  }
}

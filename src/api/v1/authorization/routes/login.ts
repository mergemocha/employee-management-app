import { FastifyReply, FastifyRequest } from 'fastify'
import * as authStrategies from '../../../../security/authentication-strategies'

export default async (req: FastifyRequest<{ Body: { username?: string, password?: string } }>, res: FastifyReply): Promise<void> => {
  const { username, password } = req.body
  const { authorization } = req.headers
  const hasUsernameAndPW = !!username && !!password
  const hasHeader = !!authorization

  if (hasHeader && hasUsernameAndPW) {
    await res.status(400).send({ message: 'Both username+password and token authentication supplied; can only authenticate with one strategy at a time' })
  } else {
    if (hasUsernameAndPW) {
      await authStrategies.withCredentials(username, password, res)
    } else if (hasHeader) {
      await authStrategies.withHeader(authorization, res)
    } else {
      await res.status(400).send({ message: 'No authentication strategy supplied' })
    }
  }
}

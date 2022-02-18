import { FastifyReply, FastifyRequest } from 'fastify'
import { getAvailablePermissions } from '../../../../security/permissions'

export default async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  await res.send(getAvailablePermissions())
}

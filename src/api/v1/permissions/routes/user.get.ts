import { FastifyReply, FastifyRequest } from 'fastify'
import { getPermissions } from '../../../../security/permissions'

export default async (req: FastifyRequest<{ Params: { user: string } }>, res: FastifyReply): Promise<void> => {
  if (!req.params.user) {
    await res.status(400).send({ message: 'User not specified' })
  } else {
    const user = await prisma.user.findFirst({ where: { id: req.params.user } })

    if (!user) {
      await res.status(404).send({ message: 'User not found' })
    } else {
      await res.send({ permissions: getPermissions(user) })
    }
  }
}

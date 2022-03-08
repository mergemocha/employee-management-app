import { FastifyReply, FastifyRequest } from 'fastify'
import { getAvailablePermissions, isSuperuser, Permission } from '../../../../security/permissions'

export default async (req: FastifyRequest<{ Params: { user: string }, Body: { permissions: Permission[] } }>, res: FastifyReply): Promise<void> => {
  if (!req.params.user) {
    await res.status(400).send({ message: 'User not specified' })
  } else {
    const user = await prisma.user.findFirst({ where: { id: req.params.user } })

    const hasBadPerm = (perm: any): boolean => !getAvailablePermissions().includes(perm)

    if (!user) {
      await res.status(404).send({ message: 'User not found' })
    } else if (isSuperuser(user)) {
      await res.status(403).send({ message: 'Permissions for superuser cannot be modified' })
    } else if (!req.body.permissions) {
      await res.status(400).send({ message: 'No permission changes declared' })
    } else if (req.body.permissions.some(hasBadPerm)) {
      await res.status(400).send({ message: `Unknown permission(s) ${req.body.permissions.filter(hasBadPerm).join(', ')}` })
    } else {
      logger.info(`Updating permissions for user ${user.id}. Old ${JSON.stringify(user.permissions)}, new ${JSON.stringify(req.body.permissions)}`)

      await prisma.user.update({
        where: {
          id: req.params.user
        },
        data: {
          permissions: req.body.permissions
        }
      })
      await res.status(200).send({ message: 'OK' })
    }
  }
}

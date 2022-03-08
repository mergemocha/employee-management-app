import { FastifyReply, FastifyRequest } from 'fastify'
import { hashPassword } from '../../../../security/passwords'
import { initSession } from '../../../../security/session'

export default async (req: FastifyRequest<{ Body: { username?: string, password?: string } }>, res: FastifyReply): Promise<void> => {
  const { username, password } = req.body

  if (!username || !password) {
    await res.status(400).send({ message: 'User or password not specified' })
  } else {
    const user = await prisma.user.findFirst({ where: { username } })

    if (user) {
      await res.status(400).send({ message: 'Username already exists' })
    } else {
      const hashedPassword = await hashPassword(password)

      const newUser = await prisma.user.create({
        data: {
          isSuperuser: false,
          username,
          password: hashedPassword
        }
      })

      const { token } = await initSession(newUser)

      await res.status(200).send({ message: 'OK', token })
    }
  }
}

import { FastifyReply, FastifyRequest } from 'fastify'
import { checkPassword } from '../../../../security/passwords'

export default async (req: FastifyRequest<{ Body: { username: string, password: string } }>, res: FastifyReply): Promise<void> => {
  if (!req.body.username) {
    await res.status(400).send({ message: 'User not specified' })
  } else {
    const user = await prisma.user.findFirst({ where: { username: req.body.username } })

    if (!user) {
      await res.status(401).send({ message: 'Invalid username or password' })
    } else {
      if (!req.body.password) {
        await res.status(400).send({ message: 'Password not specified' })
      } else {
        const hash = user.password
        const isCorrectPassword = await checkPassword(req.body.password, hash)

        if (isCorrectPassword) {
          await res.status(200).send({ message: 'Login succesful' })
        } else {
          await res.status(401).send({ message: 'Invalid username or password' })
        }
      }
    }
  }
}

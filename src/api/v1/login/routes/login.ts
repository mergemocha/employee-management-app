import { FastifyReply, FastifyRequest } from 'fastify'
import { checkPassword } from '../../../../security/passwords'

export default async (req: FastifyRequest<{ Body: { username: string, password: string } }>, res: FastifyReply): Promise<void> => {
  if (!req.body.username) {
    await res.status(400).send({ message: 'User not specified' })
  } else {
    const user = await prisma.user.findFirst({ where: { username: req.body.username } })

    if (!user) {
      await res.status(404).send({ message: 'Invalid username' })
    } else {
      const hash = user.password
      const isCorrectPassword = await checkPassword(req.body.password, hash)

      if (isCorrectPassword) {
        await res.status(200).send({ message: 'Login succesful' })
      } else {
        await res.status(404).send({ message: 'Invalid password' })
      }
    }
  }
}

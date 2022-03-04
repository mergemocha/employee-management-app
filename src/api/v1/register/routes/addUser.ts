import { FastifyReply, FastifyRequest } from 'fastify'
import { hashPassword } from '../../../../security/passwords'

export default async (req: FastifyRequest<{ Body: { username: string, password: string } }>, res: FastifyReply): Promise<void> => {
  if (!req.body.username) {
    await res.status(400).send({ message: 'User not specified' })
  } else {
    const user = await prisma.user.findFirst({ where: { username: req.body.username } })

    if (user) {
      await res.status(400).send({ message: 'Username already exists' })
    } else {
      if (!req.body.password) {
        await res.status(400).send({ message: 'Password not specified' })
      } else {
        try {
          const hashedPassword = await hashPassword(req.body.password)

          const newUser = await prisma.user.create({
            data: {
              isSuperuser: false,
              username: req.body.username,
              password: hashedPassword
            }
          })

          if (newUser) {
            await res.status(200).send({ message: 'User created succesfully' })
          }
        } catch (error) {
          await res.status(500).send({ message: 'User creation unsuccessful' })
          logger.error(`Error during user creation ${(error as Error).stack}`)
        }
      }
    }
  }
}

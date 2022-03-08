import { FastifyReply } from 'fastify'
import { checkPassword } from './passwords'
import { initSession, validateSession } from './session'

export async function withCredentials (username: string, password: string, res: FastifyReply): Promise<void> {
  const user = await prisma.user.findFirst({ where: { username } })

  if (!user) {
    await res.status(401).send({ message: 'Invalid username or password' })
  } else {
    const isCorrectPassword = await checkPassword(password, user.password)

    if (isCorrectPassword) {
      const { token } = await initSession(user)
      await res.status(200).send({ message: 'OK', token })
    } else {
      await res.status(401).send({ message: 'Invalid username or password' })
    }
  }
}

export async function withHeader (token: string, res: FastifyReply): Promise<void> {
  const { isValid, newSession } = await validateSession(token, true)

  if (!isValid) {
    await res.status(401).send({ message: 'Unauthorized' })
  } else {
    await res.status(200).send({ message: 'OK', token: newSession })
  }
}

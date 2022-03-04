import { Session, User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { convertToSeconds } from '../utils/relative-time'

export async function initSession (user: User): Promise<Session> {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string)
  const expires = convertToSeconds(process.env.TOKEN_LIFETIME as string)

  const session = await prisma.session.create({
    data: {
      token,
      expires: Date.now() + expires,
      userId: user.id
    }
  })

  return session
}

export async function validateSession (token: string): Promise<boolean> {
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string } & jwt.JwtPayload

    const user = await prisma.user.findFirst({ where: { id } })

    if (!user) {
      throw new Error(`User ${id} encoded in token not found`)
    }

    const sessions = await prisma.session.findMany({ where: { userId: user.id } })
    const session = sessions.find(session => session.token === token)

    if (!session) {
      throw new Error(`User ${id} submitted token that does not belong to them`)
    }

    const { expires } = session
    const now = Date.now()

    if (expires <= now) {
      await terminateSession(session)
      throw new Error(`User ${id} submitted expired token; token expired at ${expires}, current time is ${now}`)
    }

    return true
  } catch (err) {
    logger.error(`Could not verify token ${token}: ${(err as Error).stack}`)
    return false
  }
}

export async function terminateSession (session: Session): Promise<void> {
  await prisma.session.delete({ where: { id: session.id } })
}

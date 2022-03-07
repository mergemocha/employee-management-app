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

export async function validateSession (token: string, refresh?: boolean): Promise<{ isValid: boolean, newSession?: Session }> {
  try {
    // Check that JWT is valid
    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string } & jwt.JwtPayload

    // Check that user encoded in token exists (to prevent JWT spoofing)
    const user = await prisma.user.findFirst({ where: { id } })

    if (!user) {
      throw new Error(`User ${id} encoded in token not found`)
    }

    // Check that user encoded in token actually owns this session
    const sessions = await prisma.session.findMany({ where: { userId: user.id } })
    const session = sessions.find(session => session.token === token)

    if (!session) {
      throw new Error(`User ${id} submitted token that does not belong to them`)
    }

    // Check that session isn't expired
    const { expires } = session
    const now = Date.now()

    if (expires <= now) {
      await terminateSession(session)
      throw new Error(`User ${id} submitted expired token; token expired at ${expires}, current time is ${now}`)
    }

    let newSession

    // If relevant, refresh session so user is not forced to logout if they keep logging in often enough
    if (refresh) {
      newSession = await initSession(user)
      await terminateSession(session) // Terminate old session to prevent dangling sessions
    }

    return { isValid: true, newSession }
  } catch (err) {
    logger.error(`Could not verify token ${token}: ${(err as Error).stack}`)
    return { isValid: false }
  }
}

export async function terminateSession (session: Session): Promise<void> {
  await prisma.session.delete({ where: { id: session.id } })
}

export async function getSession (token: string): Promise<Session | null> {
  return await prisma.session.findFirst({ where: { token: token } })
}

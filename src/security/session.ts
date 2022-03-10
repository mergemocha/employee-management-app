import { Session, User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { DateTime } from 'luxon'
import { convertToSeconds } from '../utils/relative-time'

/**
 * Initialises a {@link Session} for a {@link User}.
 *
 * @param user - The {@link User} to initialise the session for
 * @returns The newly initialised {@link Session}
 */
export async function initSession (user: User): Promise<Session> {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string)
  const expires = convertToSeconds(process.env.TOKEN_LIFETIME as string)

  const session = await prisma.session.create({
    data: {
      token,
      expires: Date.now() + (expires * 1000),
      userId: user.id
    }
  })

  const now = DateTime.now()
  const expiration = DateTime.fromMillis(session.expires)
  const diff = expiration.diff(now)

  logger.info(`Initialised session ${session.id} for user ${session.userId} to expire at ${expiration.toLocal()} (${diff.toHuman()}).`)

  return session
}

/**
 * Validates that a {@link Session#token}:
 * - Is a valid JWT
 * - Is an existing session
 * - Belongs to the user encoded within it
 * - Is not expired
 *
 * By supplying the refresh parameter, the session can be refreshed (i.e. a new token generated and the old one discarded)
 * so the user does not ever have to re-login if they just keep logging in more often than the token lifetime.
 *
 * @param token - Token to validate
 * @param refresh - Whether to refresh the session
 * @returns Whether the session was valid, and if refresh is enabled, the new session to give to the user instead
 */
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
      throw new Error(`User ${id} submitted expired token; token expired at ${DateTime.fromMillis(expires).toLocal()}, current time is ${DateTime.fromMillis(now)}`)
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

/**
 * Invalidates a {@link Session}.
 *
 * @param session - The {@link Session} to terminate
 */
export async function terminateSession (session: Session): Promise<void> {
  await prisma.session.delete({ where: { id: session.id } })
}

/**
 * Returns the {@link Session} linked to a {@link Session#token}.
 *
 * @param token - Token to fetch session for
 * @returns The {@link Session} associated with this token
 */
export async function getSession (token: string): Promise<Session | null> {
  return await prisma.session.findFirst({ where: { token } })
}

/**
 * Returns the {@link User} a {@link Session} belongs to based on its {@link Session#token}.
 *
 * @param token - Token to fetch user for
 * @returns The {@link User} associated with the session of this token
 */
export async function getUserBySession (token: string): Promise<User | null> {
  const session = await getSession(token)
  if (!session) {
    logger.warn(`Session corresponding to token ${token} not found. Session has possibly expired.`)
    return null
  } else {
    return await prisma.user.findFirst({ where: { id: session.userId } })
  }
}

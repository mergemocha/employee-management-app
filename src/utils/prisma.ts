import crypto from 'crypto'
import { Prisma, PrismaClient, User } from '@prisma/client'
import { hashPassword } from '../security/passwords'

/**
 * Formats generic Prisma logging messages.
 *
 * @param event - {@link Prisma.LogEvent}
 * @returns Formatted string
 */
function fmtPrismaGeneric (event: Prisma.LogEvent): string {
  return `[prisma => ${event.target}] ${event.message}`
}

/**
 * Initialises the global {@link PrismaClient}.
 *
 * @returns A {@link PrismaClient} instance
 */
export function init (): PrismaClient {
  const prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' }
    ]
  })

  // Route Prisma logging through Pino
  prisma.$on('error', e => logger.error(fmtPrismaGeneric(e)))
  prisma.$on('info', e => logger.info(fmtPrismaGeneric(e)))
  prisma.$on('warn', e => logger.warn(fmtPrismaGeneric(e)))
  prisma.$on('query', e => {
    logger.debug(`[prisma => ${e.target}] Query: ${e.query} (params: ${e.params}, duration: ${e.duration}ms)`)
  })

  return prisma
}

/**
 * Checks whether the superuser already exists, and if not, creates one.
 */
export async function checkAndCreateSuperuser (): Promise<void> {
  const superuser = await prisma.user.findFirst({ where: { isSuperuser: true } })

  if (!superuser) {
    const username = 'superuser'
    const password = crypto.randomBytes(32).toString('hex')

    logger.info(`Creating superuser account with the following credentials: username=${username}, password=${password}`)
    logger.info('--- WRITE THESE CREDENTIALS DOWN. IF YOU LOSE THEM, YOU WILL HAVE TO START OVER. ---')

    await prisma.user.create({
      data: {
        username: 'superuser',
        password: await hashPassword(password),
        isSuperuser: true
      }
    })
  }
}

/**
 * Returns the superuser for the application.
 *
 * @returns The {@link User} that is the superuser for this application
 */
export async function getSuperuser (): Promise<User> {
  // Superuser is guaranteed to exist after first boot
  return await prisma.user.findFirst({ where: { isSuperuser: true } }) as User
}

/**
 * Creates a single employee for testing purposes.
 */
export async function checkAndCreateEmployees (): Promise<void> {
  const empl = await prisma.employee.findMany()

  if (empl.length === 0) {
    for (let i = 0; i < 10; i++) {
      const employee = await prisma.employee.create({
        data: {
          firstName: 'John',
          lastName: 'Appleseed',
          title: 'Senior Software Engineer',
          department: 'Engineering',
          salary: 100000,
          secLevel: 5,
          permanent: true,
          projects: ['Hubbard', 'Mastodon']
        }
      })

      logger.info(`Created test employee ${JSON.stringify(employee)}`)
    }
  }
}

import { Prisma, PrismaClient } from '@prisma/client'

function fmtPrismaGeneric (event: Prisma.LogEvent): string {
  return `[prisma => ${event.target}] ${event.message}`
}

export default (): PrismaClient => {
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

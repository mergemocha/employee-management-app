import dotenv from 'dotenv-safe'
import pino from 'pino'

export default (): void => {
  dotenv.config({ allowEmptyValues: true })

  global.logger = pino({
    level: process.env.LOG_LEVEL,
    transport: {
      target: process.env.NODE_ENV !== 'production' ? 'pino-pretty' : ''
    }
  })
}

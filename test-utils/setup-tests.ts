import dotenv from 'dotenv'
import pino from 'pino'

export default (): void => {
  dotenv.config({ path: 'test.env' })

  global.logger = pino({
    level: process.env.LOG_LEVEL,
    transport: {
      target: process.env.NODE_ENV !== 'production' ? 'pino-pretty' : ''
    }
  })
}

import pino from 'pino'

declare global {
  // eslint-disable-next-line no-var
  var logger: pino.Logger<pino.LoggerOptions>
}

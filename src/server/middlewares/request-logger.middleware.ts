import morgan from 'morgan';
import { pinoLogger } from '../../config/logger';

export const requestLoggerMiddleware = morgan('tiny', {
  stream: {
    write: (msg) => pinoLogger.info(msg.trim())
  }
});

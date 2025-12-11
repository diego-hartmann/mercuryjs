import dotenv from 'dotenv';
import { app } from './app';
import { pinoLogger } from '../config/logger';

dotenv.config();

export function startExpressHttpServer(port: number, _log: string): void {
  app.listen(port, () => {
    pinoLogger.info(_log);
  });
}

import { pinoLogger } from './config/logger';
import { startExpressHttpServer } from './server/server';

pinoLogger.info('🔥 Igniting application');

const port = Number(process.env.PORT) || 3000;

startExpressHttpServer(port, `💻 Server running - listening on port ${port}`);

pinoLogger.info('🚀 Application successfully launched 🚀');

import pino from 'pino';

export const pinoLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

export function logger(method: string, url: string, status: number, durationMs?: number): void {
  const msg = `${method} ${url} ${status}${durationMs ? ` - ${durationMs}ms` : ''}`;

  if (status >= 500) {
    pinoLogger.error(msg);
  } else if (status >= 400) {
    pinoLogger.warn(msg);
  } else {
    pinoLogger.info(msg);
  }
}

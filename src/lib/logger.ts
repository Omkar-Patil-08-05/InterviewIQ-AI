/**
 * Centralized structured logger for production observability.
 * Emits JSON formatted logs compatible with Datadog, AWS CloudWatch, and ELK.
 */
export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'INFO', timestamp: new Date().toISOString(), message, ...meta }))
  },
  error: (message: string, error?: any, meta?: Record<string, any>) => {
    const errorDetails = error instanceof Error 
      ? { errorMessage: error.message, stack: error.stack }
      : { errorRaw: error }
      
    console.error(JSON.stringify({ level: 'ERROR', timestamp: new Date().toISOString(), message, ...errorDetails, ...meta }))
  },
  warn: (message: string, meta?: Record<string, any>) => {
    console.warn(JSON.stringify({ level: 'WARN', timestamp: new Date().toISOString(), message, ...meta }))
  }
}

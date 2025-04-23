/**
 * packages
 */
import Common from '@core/common';

/** =======================
 *  Set timezone globally
 *  ======================= */
process.env.TZ = Common.env<string>('APP_TIMEZONE', 'UTC');

/** =======================
 *  Define env check helper
 *  ======================= */
const isDev = (): boolean => {
    const env = Common.env<string>('APP_ENV', 'production')?.toLowerCase();
    return ['development', 'develop', 'dev'].includes(env);
};

/** =======================
 *  Logging Override
 *  ======================= */
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args: any[]) => {
    if (isDev()) {
        originalError(...args);
    }
};

console.warn = (...args: any[]) => {
    if (isDev()) {
        originalWarn(...args);
    }
};

/** =======================
 *  Process Event Handlers
 *  ======================= */
process.on('unhandledRejection', (reason, promise) => {
    if (isDev()) {
        Common.logger('error', 'SCOPE', `Unhandled Rejection: ${reason}`)
    }
});

process.on('uncaughtException', (error: Error) => {
    if (isDev()) {
        Common.logger('error', 'SCOPE', `Unhandled Exception: ${error}`)
    }
    process.exit(1);
});

process.on('warning', (warning) => {
    if (isDev()) {
        Common.logger('warn', 'SCOPE', `Process Warning: ${warning}`)
    }
});

process.on('multipleResolves', (type, promise, reason) => {
    if (isDev()) {
        Common.logger('error', 'SCOPE', `Multiple Resolves: \nType: ${type}\nReason: ${reason}`)
    }
});

process.on('rejectionHandled', (promise) => {
    if (isDev()) {
        Common.logger('error', 'SCOPE', `Rejection Handled Late: ${promise}`)
    }
});

process.on('SIGINT', () => {
    Common.logger('log', 'SCOPE', `Process terminated (SIGINT)`)
    process.exit(0);
});

process.on('SIGTERM', () => {
    Common.logger('log', 'SCOPE', `Process terminated (SIGTERM)`)
    process.exit(0);
});

process.on('beforeExit', (code) => {
    Common.logger('log', 'SCOPE', `Process before exit with code: ${code}`)
});

process.on('exit', (code) => {
    Common.logger('log', 'SCOPE', `Process exited with code: ${code}`)
});

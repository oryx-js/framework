export type RunSeederType<T> = {
    entity: new () => T;
    data: Partial<T>[];
};

export type LoggerLevels = 'log' | 'warn' | 'error' | 'info';

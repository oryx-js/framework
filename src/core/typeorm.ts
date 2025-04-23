/**
 * packages
 */
import { DataSource, DataSourceOptions } from 'typeorm';
import Common from '@core/common';
import DBConfig from '@app/config/database';
import { TypeOrmDialect } from '@type/core.typeorm';

class Database {
    private static _instance: DataSource;
    private static dbType: TypeOrmDialect;

    public static get instance(): DataSource {
        if (!this._instance) {
            throw new Error(
                '[DATABASE] Instance not initialized. Call Database.init() first.',
            );
        }
        return this._instance;
    }

    public static get config(): DataSourceOptions {
        this.dbType = Common.env<TypeOrmDialect>('DB_TYPE', 'mysql');

        if (!DBConfig[this.dbType]) {
            Common.logger('error', 'DATABASE', `Unsupported DB_TYPE: '${this.dbType}'`)
            process.exit(1);
        }

        return {
            type: this.dbType as any,
            ...DBConfig.common,
            ...DBConfig[this.dbType],
        };
    }

    public static async init(): Promise<void> {
        if (this._instance?.isInitialized) {
            Common.logger('log', 'DATABASE', `Already initialized`)
            return;
        }

        const config = this.config;
        this._instance = new DataSource(config);

        try {
            await this._instance.initialize();
            Common.logger('log', 'DATABASE', `Database connected successfully`)
            Common.logger('log', 'DATABASE', `Database type is: ${this.dbType}`)
        } catch (err) {
            Common.logger('error', 'DATABASE', `Failed to connect: ${err}`)
            throw err;
        }
    }
}

export default Database;

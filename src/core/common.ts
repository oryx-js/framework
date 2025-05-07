/**
 * packages
 */
import 'reflect-metadata';
import 'dotenv/config';
import { createHash, randomBytes } from 'crypto';
import { Response } from 'express';
import { LoggerLevels, RunSeederType } from '@type/core.common';
import path from 'path';

class Common {
    static env<T>(key: string, defaultValue: any = null): T {
        const value = process.env[key];
        return (value !== undefined ? (value as unknown as T) : defaultValue!)!;
    }

    static logger(level: LoggerLevels, label: string, message: any) {
        const timestamp = new Date().toISOString();
        const emoji =
            {
                log: '📘',
                info: 'ℹ️',
                warn: '⚠️',
                error: '❌',
            }[level] || '📘';

        const tag = `[${timestamp}] ${emoji} [${label}]`;
        if (typeof message === 'string') {
            console[level]?.(`${tag} ${message}`);
        } else {
            console[level]?.(tag, message);
        }
    }

    static baseUrl(segment: string = ''): string {
        const baseUrl = this.env<string>(
            'APP_URL',
            'http://localhost:3000',
        ).replace(/\/+$/, '');
        return `${baseUrl}${segment ? `/${segment.replace(/^\/+/, '')}` : ''}`;
    }

    static extractUrl(fullUrl: string, get: Exclude<keyof URL, 'toJSON'>) {
        try {
            return new URL(fullUrl)[get];
        } catch {
            return fullUrl;
        }
    }

    static async handler<T>(
        callback: () => Promise<T>,
        shouldThrow?: (err: any) => T | Promise<T>,
    ): Promise<T> {
        try {
            return await callback();
        } catch (err: any) {
            if (typeof shouldThrow === 'function')
                return await shouldThrow(err);

            throw err;
        }
    }

    static rawJson(
        status: boolean = true,
        code: number = 200,
        message: string = '',
        result: object | any[] | null = {},
        custom: Partial<Record<string, any>> = {},
    ) {
        return { status, code, message, result, ...custom };
    }

    static resJson(
        res: Response,
        arg1:
            | boolean
            | {
                  status: boolean;
                  code: number;
                  message: string;
                  result: object | null;
                  custom?: object;
              },
        arg2?: number,
        arg3?: string,
        arg4?: object | any[] | null,
        arg5?: Partial<Record<string, any>>,
    ): Response {
        const response =
            typeof arg1 === 'object'
                ? { ...arg1, ...arg1.custom }
                : {
                      status: arg1,
                      code: arg2!,
                      message: arg3!,
                      result: arg4!,
                      ...arg5,
                  };

        return res.status(response.code).json(response);
    }

    static resView(
        res: Response,
        viewName: string,
        locals: object = {},
        status: number = 200,
    ): Response {
        const data = {
            ...locals,
            Common,
        };

        return res
            .status(status)
            .render(
                path.join(__dirname, `../../public/views/${viewName}`),
                data,
            ) as unknown as Response;
    }

    static resRedirect(
        res: Response,
        url: string,
        statusCode: number = 302,
    ): Response {
        return res.redirect(statusCode, url) as unknown as Response;
    }

    static async executeSeed<T>({ entity, data }: RunSeederType<T>) {
        const Database = (await import('@core/typeorm')).default;
        const repository = Database.instance.getRepository(entity);
        const entityName = entity.name.replace(/(Entity|entity)$/i, '');

        if (!data.length) {
            this.logger(
                'warn',
                'SEEDER',
                `No data provided for ${entityName}, seeding skipped`,
            );
            return;
        }

        const allColumns = Object.keys(data[0]);

        await repository
            .createQueryBuilder()
            .insert()
            .into(entity)
            .values(data)
            .orUpdate(allColumns, allColumns)
            .execute();

        this.logger(
            'log',
            'SEEDER',
            `Seeder for '${entityName}' executed successfully. Records created/updated.`,
        );
    }

    static md5(input: string): string {
        return createHash('md5').update(input).digest('hex');
    }

    static randomAlphaNumeric(length: number): string {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const bytes = randomBytes(length);

        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[bytes[i] % chars.length];
        }

        return result;
    }
}

export default Common;

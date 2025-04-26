/**
 * packages
 */
import { Request, Response } from 'express';
import crypto from 'crypto';
import Common from '@core/common';
import { CookieOptions } from '@type/core.cookie';

export default class Cookie {
    private static req: Request;
    private static res: Response;
    private static readonly cookieName = Common.env<string>(
        'COOKIE_NAME',
        'warf_token',
    );
    private static readonly secret = Common.env<string>(
        'COOKIE_SECRET',
        'default_cookie_secret',
    );

    static init(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    static all<T = Record<string, any>>(): T | null {
        if (!this.req) return null;
        return this.#readCookie() as T;
    }

    static get<T = any>(keys: string | string[]): T | undefined {
        if (!this.req) return undefined;
        const full = this.#readCookie();

        if (Array.isArray(keys)) {
            return keys.reduce((result: Record<string, any>, key) => {
                if (full?.[key] !== undefined) {
                    result[key] = full[key];
                }
                return result;
            }, {}) as T;
        }

        return full?.[keys];
    }

    static set(
        key: string | Record<string, any>,
        value?: any,
        options: Partial<CookieOptions> = {},
    ): boolean {
        if (!this.res) return false;

        const current = this.#readCookie() || {};

        if (typeof key === 'string' && value !== undefined) {
            current[key] = value;
        } else if (typeof key === 'object') {
            Object.assign(current, key);
        }

        return this.#writeCookie(current, options);
    }

    static remove(
        keys: string | string[],
        options: Partial<CookieOptions> = {},
    ): boolean {
        if (!this.res) return false;

        const current = this.#readCookie() || {};

        if (Array.isArray(keys)) {
            keys.forEach((key) => delete current[key]);
        } else {
            delete current[keys];
        }

        return this.#writeCookie(current, options);
    }

    static clear(): boolean {
        if (!this.res) return false;
        this.res.clearCookie(this.cookieName);
        return true;
    }

    static #readCookie(): Record<string, any> | null {
        try {
            const enc = this.req.cookies?.[this.cookieName];
            if (!enc) return null;
            const dec = this.#decrypt(enc);
            return JSON.parse(dec);
        } catch {
            return null;
        }
    }

    static #writeCookie(
        data: object,
        options: Partial<CookieOptions> = {},
    ): boolean {
        try {
            const enc = this.#encrypt(JSON.stringify(data));

            const config: CookieOptions = {
                path: Common.env('COOKIE_PATH', '/'),
                maxAge: parseInt(Common.env('COOKIE_EXPIRE', '86400000')),
                secure: Common.env('COOKIE_SECURE', 'false') === 'true',
                httpOnly: Common.env('COOKIE_HTTP_ONLY', 'true') === 'true',
                ...options,
            };

            this.res.cookie(this.cookieName, enc, config);
            return true;
        } catch {
            return false;
        }
    }

    static #encrypt(text: string): string {
        const iv = crypto.randomBytes(16);
        const key = crypto.createHash('sha256').update(this.secret).digest();
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final(),
        ]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    static #decrypt(encrypted: string): string {
        const [ivHex, encHex] = encrypted.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encHex, 'hex');
        const key = crypto.createHash('sha256').update(this.secret).digest();
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = Buffer.concat([
            decipher.update(encryptedText),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
}

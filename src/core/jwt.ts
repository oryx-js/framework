/**
 * packages
 */
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import Common from '@core/common';

class JWT {
    private static secretKey: string =
        Common.env<string>('JWT_SECRET_KEY') ||
        (() => {
            throw new Error('JWT_SECRET_KEY is not defined');
        })();

    private static expireIn: number = Common.env<number>(
        'JWT_EXPIRE_IN',
        86400,
    );

    static sign<T extends JwtPayload>(
        payload: T,
        options: SignOptions = {},
    ): string {
        return jwt.sign(payload, this.secretKey, {
            expiresIn: this.expireIn,
            ...options,
        });
    }

    static verify<T = any>(token: string): T | null {
        try {
            return jwt.verify(token, this.secretKey) as T;
        } catch (err: any) {
            Common.logger('warn', 'JWT', 'Token verification failed');
            return null;
        }
    }

    static encode<T extends object>(payload: T): string {
        return jwt.sign(payload, this.secretKey, {
            algorithm: 'HS256',
            noTimestamp: true,
        });
    }

    static decode<T = any>(token: string): T | null {
        try {
            return jwt.decode(token) as T;
        } catch (err: any) {
            Common.logger('warn', 'JWT', 'Token decoding failed');
            return null;
        }
    }
}

export default JWT;

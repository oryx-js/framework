/**
 * packages
 */
import { isArray } from 'lodash';

export default class CoreObject {
    /**
     * Remove specified properties from an object by key
     */
    static exceptByKey<T extends object>(
        obj: T,
        keys: string[] | string,
    ): Partial<T> {
        const clone = { ...obj };
        if (isArray(keys)) {
            for (const key of keys) {
                delete clone[key as keyof T];
            }
        } else {
            delete clone[keys as keyof T];
        }
        return clone;
    }

    /**
     * Keep only the specified keys in an object
     */
    static filterByKey<T extends object>(obj: T, keys: string[]): Partial<T> {
        return keys.reduce((result, key) => {
            if (key in obj) result[key as keyof T] = obj[key as keyof T];
            return result;
        }, {} as Partial<T>);
    }

    /**
     * Rename object keys using a mapping { oldKey: newKey }
     */
    static renameKeys<T extends object>(
        obj: T,
        keyMap: Record<string, string>,
    ): Record<string, any> {
        return Object.entries(obj).reduce(
            (acc, [key, val]) => {
                const newKey = keyMap[key] || key;
                acc[newKey] = val;
                return acc;
            },
            {} as Record<string, any>,
        );
    }

    /**
     * Alias for filterByKey - keep only the specified keys
     */
    static onlyKeys<T extends object>(obj: T, keys: string[]): Partial<T> {
        return this.filterByKey(obj, keys);
    }

    /**
     * Apply a transformation function to all values in the object
     */
    static mapValues<T extends object, R = any>(
        obj: T,
        fn: (value: any, key: string, obj: T) => R,
    ): Record<string, R> {
        return Object.entries(obj).reduce(
            (acc, [key, val]) => {
                acc[key] = fn(val, key, obj);
                return acc;
            },
            {} as Record<string, R>,
        );
    }

    /**
     * Remove keys with null, undefined, or empty string values
     */
    static removeEmpty<T extends object>(obj: T): Partial<T> {
        return Object.entries(obj).reduce((acc, [key, val]) => {
            if (val !== null && val !== undefined && val !== '') {
                acc[key as keyof T] = val as T[keyof T];
            }
            return acc;
        }, {} as Partial<T>);
    }

    /**
     * Convert an object into a query string (?key=value&...)
     */
    static toQueryString(obj: Record<string, any>): string {
        return Object.entries(obj)
            .map(
                ([key, val]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(val)}`,
            )
            .join('&');
    }

    /**
     * Check if an object contains all required keys
     * @returns true if all keys exist and not undefined/null, false otherwise
     */
    static requireKeys<T extends object>(obj: T, keys: string[] | string): boolean {
        if (!obj || typeof obj !== 'object') return false;
        const required = isArray(keys) ? keys : [keys];
        for (const key of required) {
            if (!(key in obj) || obj[key as keyof T] === undefined || obj[key as keyof T] === null) {
                return false;
            }
        }
        return true;
    }
}

/**
 * packages
 */
import Database from '@core/typeorm';
import {
    Repository,
    FindOptionsWhere,
    DeepPartial,
    Like,
    ObjectLiteral,
} from 'typeorm';
import { isObject, isString, isNumber } from 'lodash';
import { PaginateParams, PaginateResult } from '@type/core.paginate';
import Paginate from '@core/paginate';

export default function CoreRepository<T extends ObjectLiteral>(
    entityClass: new () => T,
) {
    return class {
        static entity: Repository<T> =
            Database.instance.getRepository(entityClass);

        /** Pagination with optional search/filter */
        static async pagination(
            params: PaginateParams<T>,
        ): Promise<PaginateResult<T>> {
            return Paginate.make(this.entity, params);
        }

        /** Get all records with optional relations */
        static async all(relations: string[] = []): Promise<T[]> {
            return this.entity.find({ relations });
        }

        /** Flexible search by key-value or object */
        static async by(
            index: string | number | Record<string, any>,
            value?: string | number | null,
            relations: string[] = [],
        ): Promise<T[]> {
            if (isObject(index)) {
                const where = Object.fromEntries(
                    Object.entries(index).map(([key, val]) => [
                        key,
                        isString(val) || isNumber(val) ? Like(`%${val}%`) : val,
                    ]),
                );
                return this.entity.find({
                    where: where as FindOptionsWhere<T>,
                    relations,
                });
            }

            if (
                typeof index === 'string' &&
                (isString(value) || isNumber(value))
            ) {
                const where = {
                    [index]: Like(`%${value}%`),
                } as FindOptionsWhere<T>;
                return this.entity.find({ where, relations });
            }

            return [];
        }

        /** Create and store new record */
        static async store(data: DeepPartial<T>): Promise<T> {
            const created = this.entity.create(data);
            return this.entity.save(created);
        }

        /** Update existing record based on ID or criteria */
        static async update(
            data: DeepPartial<T>,
            criteria: number | FindOptionsWhere<T>,
        ): Promise<T | null> {
            const where: FindOptionsWhere<T> =
                typeof criteria === 'number'
                    ? ({ ['id']: criteria } as unknown as FindOptionsWhere<T>)
                    : criteria;

            const existing = await this.entity.findOne({ where });
            if (!existing) return null;

            const merged = this.entity.merge(existing, data);
            return this.entity.save(merged);
        }

        /** Delete record by ID or criteria */
        static async delete(
            criteria: number | FindOptionsWhere<T>,
        ): Promise<boolean> {
            const where: FindOptionsWhere<T> =
                typeof criteria === 'number'
                    ? ({ ['id']: criteria } as unknown as FindOptionsWhere<T>)
                    : criteria;

            const result = await this.entity.delete(where);
            return result.affected !== 0;
        }

        /** Find one record by ID or condition */
        static async findOne(
            criteria: number | FindOptionsWhere<T>,
            relations: string[] = [],
        ): Promise<T | null> {
            const where: FindOptionsWhere<T> =
                typeof criteria === 'number'
                    ? ({ ['id']: criteria } as unknown as FindOptionsWhere<T>)
                    : criteria;

            return this.entity.findOne({ where, relations });
        }

        /** Check if record exists */
        static async exists(criteria: FindOptionsWhere<T>): Promise<boolean> {
            const count = await this.entity.count({ where: criteria });
            return count > 0;
        }
    };
}

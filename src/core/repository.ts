/**
 * async
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

        static async pagination(
            params: PaginateParams<T>,
        ): Promise<PaginateResult<T>> {
            return await Paginate.make(this.entity, params);
        }

        static async all(relations: string[] = []): Promise<T[]> {
            return this.entity.find({ relations });
        }

        static async by(
            index: string | number | Record<string, any>,
            value?: string | number | null,
            relations: string[] = [],
        ): Promise<T[]> {
            if (isObject(index)) {
                const whereList: Record<string, any> = Object.fromEntries(
                    Object.entries(index).map(([key, val]) => [
                        key,
                        isString(val) || isNumber(val) ? Like(`%${val}%`) : val,
                    ]),
                );
                return this.entity.find({ where: whereList as any, relations });
            }

            if (
                typeof index === 'string' &&
                (isString(value) || isNumber(value))
            ) {
                return this.entity.find({
                    where: { [index]: Like(`%${value}%`) } as any,
                    relations,
                });
            }

            return [];
        }

        static async store(data: DeepPartial<T>): Promise<T> {
            const created = this.entity.create(data);
            return this.entity.save(created);
        }

        static async update(
            data: DeepPartial<T>,
            criteria: number | FindOptionsWhere<T>,
        ): Promise<T | null> {
            const where: FindOptionsWhere<T> =
                typeof criteria === 'number'
                    ? ({ id: criteria } as any)
                    : criteria;

            const existing = await this.entity.findOne({ where });
            if (!existing) return null;

            const merged = this.entity.merge(existing, data);
            return this.entity.save(merged);
        }

        static async delete(
            criteria: number | FindOptionsWhere<T>,
        ): Promise<boolean> {
            const where: FindOptionsWhere<T> =
                typeof criteria === 'number'
                    ? ({ id: criteria } as any)
                    : criteria;

            const result = await this.entity.delete(where);
            return result.affected !== 0;
        }
    };
}

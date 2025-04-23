import { ObjectLiteral } from 'typeorm';

export interface PaginateParams<T extends ObjectLiteral> {
    page?: number;
    limit?: number;
    filter?: Partial<T>;
    with?: string;
}

export interface PaginateResult<T> {
    limit: number;
    page: number;
    total: number;
    max_page: number;
    data: T[];
    filter: string[] | string | null | any;
}

import { Request, Response, NextFunction } from 'express';

export type RouteMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

export type RouteMethod =
    | 'get'
    | 'post'
    | 'put'
    | 'patch'
    | 'delete'
    | 'options'
    | 'head'
    | 'all';

export type HttpContext = {
    req: Request;
    res: Response;
    next: NextFunction;
};

export type RouteHandler = ((params: HttpContext) => any) | [any, string];

export interface RouteDefinition {
    methods: RouteMethod[];
    path: string;
    handler: RouteHandler;
    middlewares?: RouteMiddleware[];
}

import { Request as ExpressRequest } from 'express';

export interface Request<T> extends ExpressRequest {
    body: T;
}

export interface Node {
    node: string;
}
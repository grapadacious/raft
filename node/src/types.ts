import {
    Request as ExpressRequest,
    Response as ExpressResponse
} from 'express';

export interface Request<T> extends ExpressRequest {
    body: T;
}

export interface ClientBody {
    command: number;
}

export interface ClientResult {
    stateMachine: number[];
}

export interface LogEntry {
    command: number;
    term: number;
}

export interface IndexedLogEntry extends LogEntry {
    index: number;
}

export interface Announce {
    node: string;
}

export interface Append {
    term: number;
    leader: string;
    prevLogIndex: number;
    prevLogTerm: number;
    entries: IndexedLogEntry[];
    leaderCommit: number;
}

export interface AppendResult {
    term: number;
    success: boolean;
}
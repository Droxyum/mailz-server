import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

export interface BodyRequest<T extends unknown> extends Request {
    body: T;
}

export const prisma = new PrismaClient();

export type ContextType = 'USER' | 'BACKEND';
export interface Context {
    type: ContextType;
    userId: string;
}

import { PrismaClient } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

export type ContextType = 'USER' | 'BACKEND';
export interface Context {
    type: ContextType;
    userId: string;
}

export interface AuthedRequest extends ExpressRequest {
    context: Context;
}

export const prisma = new PrismaClient();

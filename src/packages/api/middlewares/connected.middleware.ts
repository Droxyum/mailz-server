import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { AuthedRequest } from '../models';
import { authService } from '../services/auth.service';

export const connected = (
    req: AuthedRequest,
    res: Response,
    next: NextFunction,
) => {
    const authorizationHeader =
        req.header('Authorization') || req.header('authorization') || '';

    const token = authorizationHeader.replace(/bearer/i, '').trim();
    const context = authService.decodeToken(token || '');

    if (!context) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
            error: ReasonPhrases.UNAUTHORIZED,
        });
    }

    req.context = context;

    next();
};

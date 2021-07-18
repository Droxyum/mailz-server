import joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateBody = (schema: joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { value, error } = schema.validate(req?.body || {});
        if (error) {
            return res
                .status(400)
                .send({ errors: (error?.details || []).map((e) => e.message) });
        }
        return next();
    };
};

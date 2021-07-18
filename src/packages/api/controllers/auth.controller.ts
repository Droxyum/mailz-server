import { Router, Response } from 'express';
import joi from 'joi';
import { validateBody } from '../middlewares/validateBody.middleware';
import { BodyRequest } from '../models';
import { authService } from '../services/auth.service';

export const authController = () => {
    return Router()
        .post(
            '/register',
            validateBody(
                joi.object({
                    email: joi.string().email().required(),
                    password: joi.string().min(8).required(),
                }),
            ),
            async (
                req: BodyRequest<{ email: string; password: string }>,
                res: Response,
            ) => {
                try {
                    const user = await authService.register(req.body);
                    res.send({ user });
                } catch (e) {
                    res.status(500).send({ error: [e.message] });
                }
            },
        )
        .post(
            '/login',
            validateBody(
                joi.object({
                    email: joi.string().email().required(),
                    password: joi.string().min(8).required(),
                }),
            ),
            async (
                req: BodyRequest<{ email: string; password: string }>,
                res: Response,
            ) => {
                try {
                    const token = await authService.login(req.body);
                    res.send({ token });
                } catch (e) {
                    console.log(e);
                    res.status(500).send({ error: [e.message] });
                }
            },
        );
};

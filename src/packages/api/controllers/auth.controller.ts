import { Response, Router } from 'express';
import joi from 'joi';
import { validateBody } from '../middlewares/validateBody.middleware';
import { authService } from '../services/auth.service';

const registerLoginValidationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
});

export const authController = () => {
    return Router()
        .post(
            '/register',
            validateBody(registerLoginValidationSchema),
            register,
        )
        .post('/login', validateBody(registerLoginValidationSchema), login);
};

// TODO: Fix any
const register = async (req: any, res: Response) => {
    try {
        const user = await authService.register(req?.body);
        res.send({ user });
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: [e.message] });
    }
};

// TODO: Fix any
const login = async (req: any, res: Response) => {
    try {
        const token = await authService.login(req?.body);
        res.send({ token });
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: [e.message] });
    }
};

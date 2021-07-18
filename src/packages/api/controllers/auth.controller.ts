import { Router } from 'express';

export const authController = () => {
    return Router().post('/register', (req, res) => {
        res.send();
    });
};

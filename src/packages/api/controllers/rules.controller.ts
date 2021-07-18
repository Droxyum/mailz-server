import { Router } from 'express';

export const rulesController = () => {
    return Router().post('/', (req, res) => res.send(req.body || {}));
};

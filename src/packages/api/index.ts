import express from 'express';
import cors from 'cors';
import * as bp from 'body-parser';
import helmet from 'helmet';
import { rulesController } from './controllers/rules.controllers';

export const createApi = () => {
    const listenPort = Number(process.env.HTTP_PORT) || 80;

    const server = express();
    server.use(cors()).use(bp.json()).use(helmet());
    server.listen(listenPort, () =>
        console.log(`-> API listen on port ${listenPort}`),
    );

    server.use('/rules', rulesController());

    return server;
};

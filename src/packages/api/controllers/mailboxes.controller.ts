import { Router, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import joi from 'joi';
import { connected } from '../middlewares/connected.middleware';
import { validateBody } from '../middlewares/validateBody.middleware';
import { AuthedRequest } from '../models';
import { maillboxesService } from '../services/mailboxes.service';
import { createConnection } from '@packages/mail';

const createMailboxValidationSchema = joi.object({
    name: joi.string().required(),
    host: joi.string().required(),
    port: joi.number().required(),
    secure: joi.boolean().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
});

export const mailboxesController = () => {
    return Router()
        .post(
            '/',
            connected,
            validateBody(createMailboxValidationSchema),
            createMailbox,
        )
        .get('/', connected, getMailboxes)
        .get('/:mailboxId/test', connected, testMailboxConnection);
};

const createMailbox = async (req: AuthedRequest, res: Response) => {
    try {
        const mailbox = await maillboxesService.createMailbox(
            req.body,
            req.context,
        );
        res.send({
            id: mailbox.id,
            name: mailbox.name,
        });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
};

const getMailboxes = async (req: AuthedRequest, res: Response) => {
    try {
        const mailboxes = await maillboxesService
            .getMailboxes(req.context)
            .then((boxes) =>
                (boxes || []).map(({ id, name }) => ({ id, name })),
            );

        res.send(mailboxes);
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
};

const testMailboxConnection = async (req: AuthedRequest, res: Response) => {
    try {
        const mailboxId = req?.params?.mailboxId;
        if (isNaN(Number(mailboxId))) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send({ error: 'Invalid mailbox id' });
        }

        const mailbox = await maillboxesService.getMailbox(
            Number(mailboxId),
            req.context,
        );

        const decryptedMailbox = maillboxesService.decryptCredientials(
            mailbox,
            req.context,
        );

        await createConnection({
            user: decryptedMailbox.email,
            password: decryptedMailbox.password,
            host: decryptedMailbox.host,
            port: decryptedMailbox.port,
            secure: decryptedMailbox.secure,
        }).connect();

        res.send({
            ok: true,
        });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
};

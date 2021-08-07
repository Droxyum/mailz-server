import { Mailbox } from '@prisma/client';
import { Context, prisma } from '../models';
import { securityService } from './security.service';

const createMailbox = (
    data: {
        name: string;
        host: string;
        port: number;
        secure: boolean;
        email: string;
        password: string;
    },
    context: Context,
) => {
    const iv = securityService.generateNewIv();
    return prisma.mailbox.create({
        data: {
            user: {
                connect: {
                    id: context.userId,
                },
            },
            name: data.name,
            host: securityService.encrypt(iv, data.host, context),
            port: data.port,
            secure: data.secure,
            email: securityService.encrypt(iv, data.email, context),
            password: securityService.encrypt(iv, data.password, context),
            iv,
        },
    });
};

const getMailboxes = (context: Context) => {
    return prisma.mailbox.findMany({
        where: {
            user: { id: context.userId },
        },
    });
};

const getMailbox = (id: number, context: Context) => {
    return prisma.mailbox.findFirst({
        where: {
            id,
            user: { id: context.userId },
        },
    });
};

const decryptCredientials = (
    { iv, ...mailbox }: Mailbox,
    context: Context,
): Omit<Mailbox, 'iv'> => {
    return {
        ...mailbox,
        host: securityService.decrypt(iv, mailbox.host, context),
        email: securityService.decrypt(iv, mailbox.email, context),
        password: securityService.decrypt(iv, mailbox.password, context),
    };
};

export const maillboxesService = {
    createMailbox,
    getMailboxes,
    getMailbox,
    decryptCredientials,
};

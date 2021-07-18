import imap from 'imap-simple';

interface MailBoxCredentials {
    user: string;
    password: string;
    host: string;
    port: number;
    secure: boolean;
}

class MailBox {
    private connection: imap.ImapSimple;

    constructor(private credentials: MailBoxCredentials) {}

    connect() {
        return imap
            .connect({
                imap: {
                    user: this.credentials.user,
                    password: this.credentials.password,
                    host: this.credentials.host,
                    port: this.credentials.port,
                    tls: this.credentials.secure,
                    authTimeout: 3000,
                },
            })
            .then((conn) => (this.connection = conn))
            .catch((e) => {
                console.log(e);
                throw new Error('Cannot connect to mailbox');
            });
    }

    open(folder: 'INBOX') {
        return this.connection.openBox(folder).then(() => this);
    }

    async listUnseen() {
        const searchCriteria = ['UNSEEN'];

        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false,
        };

        const mails = await this.connection.search(
            searchCriteria,
            fetchOptions,
        );
        return mails.map((m) => this.parseMail(m));
    }

    async list() {
        const searchCriteria = ['ALL'];

        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false,
        };

        const mails = await this.connection.search(
            searchCriteria,
            fetchOptions,
        );
        return mails.map((m) => this.parseMail(m));
    }

    flag(
        id: number,
        f: 'Seen' | 'Answered' | 'Flagged' | 'Deleted' | 'Draft' | 'Recent',
    ) {
        return this.connection.addFlags(id, '\\' + f);
    }

    // TODO: typing output
    private parseMail(input: imap.Message) {
        const content =
            (input?.parts || []).find((p) => p.which === 'TEXT')?.body || '';

        const headers = (input?.parts || []).find((p) => p.which === 'HEADER')
            ?.body;

        return {
            id: input?.attributes?.uid || null,
            content: content || '',
            subject: headers?.subject?.[0] || null,
            from: headers?.from?.[0] || null,
            to: headers?.to || [],
            date: input?.attributes?.date
                ? new Date(input?.attributes?.date)
                : null,
            flags: input.attributes?.flags || [],
        };
    }
}

export const createConnection = (data: MailBoxCredentials) => {
    return new MailBox(data);
};

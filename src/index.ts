import { createApi } from '@packages/api';
import { createConnection } from '@packages/mail';
import fs from 'fs';

const _ = createApi();

const file = fs.existsSync('email.json')
    ? fs.readFileSync('email.json', 'utf-8')
    : '{}';
const email = JSON.parse(file);

console.log(email);

const mailbox = createConnection({
    host: email?.imap?.host,
    port: email?.imap?.port,
    secure: email?.imap?.secure,
    user: email?.user,
    password: email?.pass,
});

mailbox
    .connect()
    .then(() => mailbox.open('INBOX'))
    .then(() => mailbox.list())
    .then((mails) => {
        mailbox.flag(mails[0].id, 'Seen');
    })
    .then(() => mailbox.list())
    .then((m) => {
        console.log(m);
    });

import crypto from 'crypto';
import { Context } from '../models';

const algorithm = 'aes-256-ctr';

const generateNewIv = () => crypto.randomBytes(16).toString('hex');

const encrypt = (iv: string, content: string, context: Context) => {
    const cipher = crypto.createCipheriv(
        algorithm,
        process.env.ENCRYPT_KEY,
        Buffer.from(iv, 'hex'),
    );
    const encrypted = Buffer.concat([cipher.update(content), cipher.final()]);
    return encrypted.toString('hex');
};

const decrypt = (iv: string, content: string, context: Context) => {
    const decipher = crypto.createDecipheriv(
        algorithm,
        process.env.ENCRYPT_KEY,
        Buffer.from(iv, 'hex'),
    );

    const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(content, 'hex')),
        decipher.final(),
    ]);

    return decrpyted.toString();
};

export const securityService = { generateNewIv, encrypt, decrypt };

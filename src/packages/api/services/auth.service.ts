import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Context, ContextType, prisma } from '../models';

interface JwtTokenExtracted extends JwtPayload {
    type: ContextType;
    userId: string;
}

const encodeToken = (context: Context) =>
    jwt.sign(context, process.env.JWT_SECRET);
const decodeToken = (token: string): Context => {
    try {
        const data = <JwtTokenExtracted>(
            jwt.verify(token, process.env.JWT_SECRET)
        );

        return {
            type: data?.type,
            userId: data?.userId,
        };
    } catch (e) {
        return null;
    }
};

const encodePassword = (plainPassword: string) =>
    bcrypt.hashSync(plainPassword, 5);

const isSamePassword = (plainPassword: string, hash: string) =>
    bcrypt.compareSync(plainPassword, hash);

const register = async (data: { email: string; password: string }) => {
    const emailExist = await prisma.user.count({
        where: { email: data.email },
    });

    if (emailExist) {
        throw new Error('Email already exist');
    }

    const encryptedPassword = encodePassword(data.password);
    const { password, ...user } = await prisma.user.create({
        data: {
            email: data.email,
            password: encryptedPassword,
        },
    });
    return user;
};

const login = async (data: { email: string; password: string }) => {
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (!isSamePassword(data.password, user?.password || '')) {
        throw new Error('Bad credentails');
    }

    try {
        const token = encodeToken({
            type: 'USER',
            userId: user.id.toString(),
        });
        return token;
    } catch (e) {
        throw new Error('Bad credentails');
    }
};

export const authService = {
    encodePassword,
    isSamePassword,
    register,
    login,
};

import {hash, compare} from 'bcrypt';

export async function hashPassword(password: string, saltRounds = 15): Promise<string> {
    return await hash(password, saltRounds);
}

export async function verifyPassword(candidatePassword: string, hash: string): Promise<boolean> {
    return await compare(candidatePassword, hash)
}
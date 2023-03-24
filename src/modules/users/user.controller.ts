import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, EmailLoginInput } from "./user.schema"; // PhoneLoginInput,
import { createUser, findUserByEmail } from "./user.service"; // findUserByPhoneNumber createUser,
import { verifyPassword } from "../../utils/password-utils";
import {User} from "@prisma/client"

export async function createUserHandler(
    request: FastifyRequest<{
        Body: CreateUserInput;
    }>,
    reply: FastifyReply
) {

   const body = {...request.body, role: "CLIENT"}

    try {
        const user = await createUser(body);
        console.log(user)
        return reply.code(201).send({ok: "user created"});
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function emailLogin( request:FastifyRequest<{ Body: EmailLoginInput }>, reply: FastifyReply) {

    const {email, password } = request.body
    const user: User | null = await findUserByEmail(email);

    if (user) {
        const correctPassword = await verifyPassword(password, user.password)
        if (correctPassword) {
            const { password, ...rest } = user;
            // generate access token
            return { accessToken: request.jwt.sign(rest) };
        }
    }

    return reply.code(401).send({
        message: "Invalid email or password",
    });
}


// async function phonelLogin( request:FastifyRequest<{ Body: PhoneLoginInput }>, reply: FastifyReply) {
//
//     const {phoneNumber, confirmationCode } = request.body
//     const user:User | null = await findUserByPhoneNumber(phoneNumber);
//
//     if (user) {
//         if (user.confirmations.some(confirmation => confirmation.code === confirmationCode)) {
//             const { password, ...rest } = user;
//             // generate access token
//             return { accessToken: request.jwt.sign(rest) };
//         }
//     }
//
//     return reply.code(401).send({
//         message: "Invalid email or password",
//     });
// }




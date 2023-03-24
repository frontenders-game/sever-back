import { hashPassword } from "../../utils/password-utils";
import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

export async function createUser(userInput: CreateUserInput) {
    const {password, ...rest} = userInput;
    const hashedPassword = await hashPassword(password);

    return prisma.user.create({
        data: {...rest, password: hashedPassword},
    });
}
//
// export async function findUserByPhoneNumber(phoneNumber: string, confirmationCode: string) {
//     return prisma.user.findFirst({
//         where: {
//             phoneNumber,
//             confirmation: {
//                 code: confirmationCode
//             }
//         },
//     });
// }

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}
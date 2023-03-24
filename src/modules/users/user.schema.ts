import { Type, Static } from "@sinclair/typebox"
// import { FastifySchema } from "fastify"
// import {User} from "@prisma/client"

export function userEmail() {
    return Type.String({format: "email",  transform: ['trim', 'toLowerCase'] })
}

export function userPhoneNumber() {
    return Type.String({minLength: 10, maxLength: 15})
}

export function userPassword() {
    return Type.String({minLength: 8})
}

enum EGender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export const registerUserSchema =  Type.Object(
        {
            firstName: Type.String({minLength: 1, maxLength: 30}),
            lastName: Type.String({minLength: 1, maxLength: 30}),
            email: Type.Optional(userEmail()),
            password: userPassword(),
            gender: Type.Enum(EGender, {description: "Provide Gender", transform: ["toUpperCase"]}),
            region: Type.String(),
            town: Type.String(),
            phoneNumber: userPhoneNumber(),
            dateOfBirth: Type.String(), // Type.Date(),
            cardNumber: Type.Optional(Type.Integer({minimum: 100000, maximum: 999999}))
        },
        {$id: "registerUserSchema", additionalProperties: false}
    )


export type CreateUserInput = Static<typeof registerUserSchema>


export const emailLoginSchema = Type.Strict(
    Type.Object(
        {
            email: userEmail(),
            password: userPassword()
        },
        {additionalProperties: false}
    )
)

export type EmailLoginInput = Static<typeof emailLoginSchema>
export const phoneLoginSchema = Type.Strict(
    Type.Object(
        {
            phoneNumber: userEmail(),
            confirmationCode: Type.Integer({minimum: 100000, maximum: 999999})
        },
        {additionalProperties: false}
    )
)



export type PhoneLoginInput = Static<typeof phoneLoginSchema>

// export const loginSchema = Type.Union([phoneLoginSchema, emailLoginSchema])
//
// export type LoginInput = Static<typeof loginSchema>
//

// export const userCore = {
//     firstName: Type.String({minLength: 1, maxLength: 30}),
//     lastName: Type.String({minLength: 1, maxLength: 30}),
//     email: Type.String({minLength: 1, maxLength: 100, format: 'email'}),
//     gender: Type.Enum(GenderEnum),
//     region: Type.String(),
//     town: Type.String(),
//     password: Type.String({minLength: 6}),
//     logo: Type.Union([
//         Type.String({minLength: 1, format: 'uri-reference'}),
//         Type.Null()
//     ]),
//     status: Type.Union([
//         Type.String({minLength: 1, maxLength: 50}),
//         Type.Null()
//     ]),
//     biography: Type.Union([
//         Type.String({minLength: 1, maxLength: 160}),
//         Type.Null()
//     ]),
//     website: Type.Union([
//         Type.String({
//             minLength: 1,
//             maxLength: 255,
//             format: 'uri'
//         }),
//         Type.Null()
//     ]),
//     isConfirmed: Type.Boolean({default: false}),
//     temporaryToken: Type.String(),
//     temporaryExpirationToken: Type.String({format: 'date-time'}),
//     createdAt: Type.String({format: "date-time"}),
//     updatedAt: Type.String({format: "date-time"}),
// }



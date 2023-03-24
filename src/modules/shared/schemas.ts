import { Static, Type } from "@sinclair/typebox";


export const uuidType = Type.String({format: 'uuid'})

export const uuidParamsType = Type.Object({ id: uuidType})
export type UuidParamsRequest = Static<typeof uuidParamsType>

export const slugType = Type.String({minLength: 1, maxLength: 255})
export const nameType = Type.String({minLength: 1, maxLength: 255})

export const responseMessage = Type.Optional(Type.String())

export const basicCategory = {
    name: nameType,
    description: Type.Optional(Type.String()),
}



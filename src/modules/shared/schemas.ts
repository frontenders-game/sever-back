import { Static, TSchema, Type } from "@sinclair/typebox";
import { MultipartFile } from "@fastify/multipart";


export const uuidType = Type.String({format: 'uuid'})
export const slugType = Type.String({minLength: 1, maxLength: 255})
export const nameType = Type.String({minLength: 1, maxLength: 255})

export const idSchema = Type.Object({ id: uuidType})

export const uuidParamsType = Type.Object({ id: uuidType})
export type UuidParams = Static<typeof uuidParamsType>
export const slugParamsType = Type.Object({ slug: slugType})
export type SlugParams = Static<typeof slugParamsType>

export const uuidOrSlugParamsType = Type.Union([
    uuidParamsType,
    slugParamsType
])
export type UuidOrSlugParams = Static<typeof uuidOrSlugParamsType>

export const responseMessage = Type.Optional(Type.String())

export const dateTimeType = Type.String({format: 'date-time'})
export const sortPriceType = Type.Union(
    [Type.Literal('asc'), Type.Literal('desc')])
export const TypeNullable = <T extends TSchema>(schema: T) => Type.Union([schema, Type.Null()])

export interface IImage {
    file: MultipartFile
}

export const uploadImageSchema = Type.Strict(
    Type.Object(
        {
            file: Type.Unknown()
        },
        {additionalProperties: false}
    )
)


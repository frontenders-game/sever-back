import { Static, Type } from "@sinclair/typebox";
import {  uuidType } from "../../shared/schemas";

export const productPromoIdSchema = Type.Object(
    {
        id:  uuidType
    },
    {$id: "productPromoIdSchema", additionalProperties: false}
)

export type ProductPromoId = Static<typeof productPromoIdSchema>

export const createProductPromoSchema = Type.Object({
        discountedPriceRegular: Type.Number( ),
        discountedPriceWithCard: Type.Number( ),
        discountPercent: Type.Number({minimum: 1, maximum: 99}),
        isActive: Type.Boolean(),
        expiresAt: Type.Optional(Type.String({format: 'date-time'}))
    },
    {$id: "createProductPromoSchema", additionalProperties: false}
)

export type CreateProductPromoInput = Static<typeof createProductPromoSchema>

export const responseProductPromoSchema = Type.Intersect([
    productPromoIdSchema,
    createProductPromoSchema
])

export type ProductPromoResponse = Static<typeof responseProductPromoSchema>
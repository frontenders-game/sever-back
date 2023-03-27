import { Static, Type } from "@sinclair/typebox";
import { dateTimeType, uuidType } from "../../shared/schemas";

export const productPromoIdSchema = Type.Object(
    {
        id: uuidType
    },
    {$id: "productPromoIdSchema", additionalProperties: false}
)

export type ProductPromoId = Static<typeof productPromoIdSchema>

export const createProductPromoSchema = Type.Object({
        discountedPriceRegular: Type.Number(),
        discountedPriceWithCard: Type.Number(),
        discountPercent: Type.Number({minimum: 1, maximum: 99}),
        isActive: Type.Boolean({default: true}),
        expiresAt: Type.Union([dateTimeType, Type.Null()])
    },
    {$id: "createProductPromoSchema", additionalProperties: false}
)

export type CreateProductPromoInput = Static<typeof createProductPromoSchema>

export const updateProductPromoSchema = Type.Intersect(
    [ productPromoIdSchema, createProductPromoSchema],
    {$id: "updateProductPromoSchema", additionalProperties: false}
)

export type UpdateProductPromoInput = Static<typeof updateProductPromoSchema>

// export const responseProductPromoSchema = Type.Intersect(
//     [ productPromoIdSchema, createProductPromoSchema],
//     {$id: "responseProductPromoSchema", additionalProperties: false}
// )

export const responseProductPromoSchema = Type.Object(
    {
        id: uuidType,
        discountedPriceRegular: Type.Number(),
        discountedPriceWithCard: Type.Number(),
        discountPercent: Type.Number({minimum: 1, maximum: 99}),
        isActive: Type.Boolean({default: true})
    },
    {$id: "responseProductPromoSchema", additionalProperties: false}
)

export type ProductPromoResponse = Static<typeof responseProductPromoSchema>
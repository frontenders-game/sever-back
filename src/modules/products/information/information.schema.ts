import { Static, Type } from "@sinclair/typebox";
import {  uuidType } from "../../shared/schemas";

export const productInformationIdSchema = Type.Object(
    {
        id:  uuidType
    },
    {$id: "productInformationIdSchema", additionalProperties: false}
)

export type ProductInformationId = Static<typeof productInformationIdSchema>

export const createProductInformationSchema = Type.Object({
        value: Type.String(),
        name: Type.String(),
        unitsOfMeasurement: Type.Optional(Type.String()),
        order: Type.Integer({minimum: 1 }),
        isNutrient: Type.Boolean(),
        nutrientName: Type.Optional(Type.String())
    },
    {$id: "createProductInformationSchema", additionalProperties: false}
)

export type CreateProductInformationInput = Static<typeof createProductInformationSchema>

export const responseProductInformationSchema = Type.Intersect([
    productInformationIdSchema,
    createProductInformationSchema
])

export type InformationResponse = Static<typeof responseProductInformationSchema>
import { Type } from "@sinclair/typebox";
import { idSchema } from "../../shared/schemas";


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


export const responseProductInformationSchema = Type.Intersect([
    idSchema,
    createProductInformationSchema
],
    {$id: "responseProductInformationSchema", additionalProperties: false})


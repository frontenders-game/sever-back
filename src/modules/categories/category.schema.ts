import { Static, Type } from "@sinclair/typebox"
import {
    idSchema,
    nameType,
    responseMessage,
    slugParamsType,
    slugType,
    uuidOrSlugParamsType,
    uuidParamsType,
    uuidType,
    sortPriceType
} from "../shared/schemas";
import { responseProductSchema } from "../products/product.schema";
import { routeSchema } from "../../types";

export const getCategoryQuery = Type.Object({
        productOffset: Type.Optional(Type.Integer({default: 0})),
        productLimit: Type.Optional(Type.Integer({default: 40})),
        minPrice: Type.Optional(Type.Number()),
        maxPrice: Type.Optional(Type.Number()),
        sortPrice: Type.Optional(sortPriceType),
        subcategoryId: Type.Optional(uuidType),
    },
    {$id: "getCategoryQuery", additionalProperties: false}
)

export type GetCategoryQuery = Static<typeof getCategoryQuery>

export const getCategoryWhereCondition = uuidOrSlugParamsType

export type GetCategoryWhereCondition = Static<typeof getCategoryWhereCondition>

const basicCategory = {
    name: nameType,
    // imageId: Type.Optional(uuidType),
    description: Type.Optional(Type.String()),
}

export const createCategorySchema = Type.Object(
    {
        ...basicCategory
    },
    {$id: "createCategorySchema", additionalProperties: false}
)

export type CreateCategoryInput = Static<typeof createCategorySchema>

export const createSubcategorySchema = Type.Intersect(
    [
        createCategorySchema,
        Type.Object({parentCategoryId: Type.Optional(uuidType)})
    ],
    {$id: "createSubcategorySchema", additionalProperties: false}
)

export type CreateSubcategoryInput = Static<typeof createSubcategorySchema>

export const updateCategorySchema = Type.Intersect([createCategorySchema, idSchema])
export type UpdateCategoryInput = Static<typeof updateCategorySchema>

// export const updateSubcategorySchema = Type.Intersect([createSubcategorySchema, idSchema])
// export type UpdateSubcategoryInput = Static<typeof updateSubcategorySchema>
export const responseCategorySchema =
    Type.Object(
        {
            ...basicCategory,
            id: uuidType,
            parentCategoryId: Type.Optional(uuidType),
            order: Type.Integer({minimum: 1}),
            slug: slugType,
            filter: Type.Optional(Type.Ref(getCategoryQuery)),
            subcategoriesCount: Type.Optional(Type.Integer({default: 0, minimum: 0})),
            subcategories: Type.Optional(Type.Array(Type.Intersect([idSchema, createCategorySchema, Type.Object({slug: slugType})]))),
            // productsCount: Type.Integer({default: 0, minimum: 0}),
            products: Type.Optional(Type.Array(Type.Ref(Type.Omit(responseProductSchema, ['categoryId'])))),

        },
        {$id: "responseCategorySchema", additionalProperties: false}
    )


export const routeGetCategoryByIdSchema = routeSchema({
    tags: ['categories'],
    params: uuidParamsType,
    querystring: getCategoryQuery,
    response: {
        200: {
            message: responseMessage,
            data: responseCategorySchema
        }
    },
})


export const routeGetCategoryBySlugSchema = routeSchema({
    tags: ['categories'],
    params: slugParamsType,
    querystring: getCategoryQuery,
    response: {
        200: {
            message: responseMessage,
            data: responseCategorySchema
        }
    },
})

export const routeGetAllCategoriesSchema = routeSchema({
    tags: ['categories'],
    response: {
        200: {
            message: responseMessage,
            data: Type.Array(responseCategorySchema)
        }
    },
})
export const routeCreateCategorySchema = routeSchema({
    tags: ['categories'],
    body: createCategorySchema,
    response: {
        201: {
            message: responseMessage,
            data: responseCategorySchema
        }
    }
})
export const routeUpdateCategorySchema = routeSchema({
    tags: ['categories'],
    params: uuidParamsType,
    body: updateCategorySchema,
    response: {
        200: {
            message: responseMessage,
            data: responseCategorySchema
        },
        304: {
            message: responseMessage
        }
    }
})
export const routeDeleteCategorySchema = routeSchema({
    tags: ['categories'],
    params: uuidParamsType,
    response: {
        200: {
            message: responseMessage
        }
    }
})
//
//
// export const routeGetSubcategoryByIdSchema = routeSchema({
//     tags: ['subcategories'],
//     params: uuidParamsType,
//     querystring: getCategoryQuery,
//     response: {
//         200: {
//             message: responseMessage,
//             data: responseCategorySchema
//         }
//     },
// })
//
//
// export const routeGetSubcategoryBySlugSchema = routeSchema({
//     tags: ['subcategories'],
//     params: slugParamsType,
//     querystring: getCategoryQuery,
//     response: {
//         200: {
//             message: responseMessage,
//             data: responseCategorySchema
//         }
//     },
// })
//
//
// export const routeCreateSubcategorySchema = routeSchema({
//     tags: ['subcategories'],
//     body: createSubcategorySchema,
//     response: {
//         201: {
//             message: responseMessage,
//             data: responseCategorySchema
//         }
//     }
// })
//
// export const routeUpdateSubcategorySchema = routeSchema({
//     tags: ['subcategories'],
//     params: uuidParamsType,
//     body: updateSubcategorySchema,
//     response: {
//         200: {
//             message: responseMessage,
//             data: responseCategorySchema
//         },
//         304: {
//             message: responseMessage
//         }
//     }
// })
// export const routeDeleteSubcategorySchema = routeSchema({
//     tags: ['subcategories'],
//     params: uuidParamsType,
//     response: {
//         200: {
//             message: responseMessage
//         }
//     }
// })
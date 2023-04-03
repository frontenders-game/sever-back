import { Static, Type } from "@sinclair/typebox";
import {
    dateTimeType,
    idSchema,
    nameType,
    responseMessage,
    slugParamsType,
    slugType, sortPriceType,
    uuidOrSlugParamsType,
    uuidParamsType,
    uuidType
} from "../shared/schemas";
import { createProductInformationSchema, responseProductInformationSchema } from "./information/information.schema";
import { responseProductReviewSchema } from "./reviews/review.schema";
import { responseProductImageSchema } from "./images/image.schema";
import { routeSchema } from "../../types";

export const getProductWhereCondition = uuidOrSlugParamsType
export type GetProductWhereCondition = Static<typeof getProductWhereCondition>


const basicProduct = {
    name: nameType,
    isNew: Type.Boolean({default: false}),
    unitsOfMeasurement: Type.String({default: 'шт'}),
    step: Type.Number({default: 1}),
    priceRegular: Type.Number({minimum: 1}),
    priceWithCard: Type.Optional(Type.Number({minimum: 1})),
    discountPercent: Type.Any(), // todo fix type
    discountedPrice: Type.Any(),  // todo fix type
    discountIsActive: Type.Boolean({default: false}),
    discountExpiresAt: Type.Optional(dateTimeType),
    ingredients: Type.Optional(Type.String()),
    stockCount: Type.Integer({default: 0}),
}

export const createProductSchema = Type.Object({
        ...basicProduct,
        subcategoryId: uuidType,
        information: Type.Optional(Type.Array(Type.Ref(createProductInformationSchema)))
    },
    {$id: "createProductSchema", additionalProperties: false}
)

export type CreateProductInput = Static<typeof createProductSchema>

export const updateProductSchema = Type.Intersect([createProductSchema, idSchema])
export type UpdateProductInput = Static<typeof updateProductSchema>

export const responseProductSchema = Type.Object({
        id: uuidType,
        categoryId: Type.Optional(uuidType),
        category: Type.Object({
            id: Type.Optional(uuidType),
            slug: Type.Optional(slugType)}
        ),
        subcategoryId: Type.Optional(uuidType),
        ...basicProduct,
        slug: slugType,
        images: Type.Optional(Type.Array(Type.Ref(responseProductImageSchema))),
        averageRating: Type.Integer({default: 0, minimum: 0}),
        reviewsCount: Type.Integer({default: 0, minimum: 0}),
        reviews: Type.Optional(Type.Array(Type.Ref(responseProductReviewSchema))),
        information: Type.Optional(Type.Array(Type.Ref(responseProductInformationSchema)))
    },
    {$id: "responseProductSchema", additionalProperties: false}
)
export type ResponseProduct = Static<typeof responseProductSchema>

//
// export const getProductsWhereCondition = uuidOrSlugParamsType
// export type GetProductsWhereCondition = Static<typeof getProductsWhereCondition>



export const filterProductsQuery = Type.Object({
        categoryId: Type.Optional(uuidType),
        subcategoryId: Type.Optional(uuidType),
        offset: Type.Optional(Type.Integer({default: 0})),
        limit: Type.Optional(Type.Integer({default: 40})),
        searchText: Type.Optional(Type.String({minLength: 3})),
        isNew: Type.Optional(Type.Boolean()),
        withDiscount: Type.Optional(Type.Boolean()),
        inStock: Type.Optional(Type.Boolean()),
        minPrice: Type.Optional(Type.Number()),
        maxPrice: Type.Optional(Type.Number()),
        sortPrice: sortPriceType
    },
    {$id: "filterProductsQuery", additionalProperties: false}
)

export type FilterProductsQuery = Static<typeof filterProductsQuery>

export const processProductsSchema = Type.Object({
    products: Type.Optional(Type.Array(responseProductSchema)),
    productsResultCount: Type.Optional(Type.Integer({default: 0, minimum: 0})),
    productsResultMinPrice: Type.Optional(Type.Number()),
    productsResultMaxPrice: Type.Optional(Type.Number()),
    productsTotalCount: Type.Optional(Type.Number()),
    productsTotalMinPrice: Type.Optional(Type.Number()),
    productsTotalMaxPrice: Type.Optional(Type.Number()),
})
export type ProcessProducts  = Static<typeof processProductsSchema>

export const responseAllProductsSchema =
    Type.Intersect([
        Type.Object({filter: Type.Optional(Type.Ref(filterProductsQuery))}),
        processProductsSchema
    ],
        {$id: "responseAllProductsSchema", additionalProperties: false}
    )


export const routeGetAllProductSchema = routeSchema({
    tags: ['products'],
    querystring: filterProductsQuery,
    response: {
        200: {
            message: responseMessage,
            data: responseAllProductsSchema
        }
    },
})


export const routeGetProductByIdSchema = routeSchema({
    tags: ['products'],
    params: uuidParamsType,
    response: {
        200: {
            message: responseMessage,
            data: responseProductSchema
        }
    },
})
export const routeGetProductBySlugSchema = routeSchema({
    tags: ['products'],
    params: slugParamsType,
    response: {
        200: {
            message: responseMessage,
            data: responseProductSchema
        }
    },
})


export const routeCreateProductSchema = routeSchema({
    tags: ['products'],
    body: createProductSchema,
    response: {
        201: {
            message: responseMessage,
            data: responseProductSchema
        }
    }
})
export const routeUpdateProductSchema = routeSchema({
    tags: ['products'],
    params: uuidParamsType,
    body: updateProductSchema,
    response: {
        200: {
            message: responseMessage,
            data: responseProductSchema
        },
        304: {
            message: responseMessage
        }
    }
})
export const routeDeleteProductSchema = routeSchema({
    tags: ['products'],
    params: uuidParamsType,
    response: {
        200: {
            message: responseMessage
        }
    }
})

export {
    createProductInformationSchema,
    responseProductReviewSchema,
    responseProductImageSchema,
    responseProductInformationSchema
}
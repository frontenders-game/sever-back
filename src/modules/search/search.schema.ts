import { Static, Type } from "@sinclair/typebox";
import {
    nameType,
    slugType,
    uuidType,
    responseMessage
} from "../shared/schemas";
import { routeSchema } from "../../types";


export const searchSchema = Type.Object({
        id: uuidType,
        name: nameType,
        slug: slugType
})

export const responseSearchSchema = Type.Object({
    categories: Type.Optional(Type.Array(searchSchema)),
    subcategories: Type.Optional(Type.Array(searchSchema)),
    products: Type.Optional(Type.Array(searchSchema)),
})


export const searchQuerySchema = Type.Object({
    searchText: Type.String({minLength: 3})
})

export type SearchQuery = Static<typeof searchQuerySchema>


export const routeSearchSchema = routeSchema({
    tags: ['search'],
    querystring: searchQuerySchema,
    response: {
        200: {
            message: responseMessage,
            data: responseSearchSchema
        }
    },
})

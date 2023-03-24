import {
    createProductInformationSchema,
    createProductPromoSchema,
    createProductSchema,
    productIdSchema,
    responseProductImageSchema,
    responseProductReviewSchema,
    responseProductSchema
} from "../../modules/products/product.schema";
import {
    categoryIdSchema,
    createCategorySchema,
    responseCategorySchema,
} from "../../modules/categories/category.schema";
import {
    createSubcategorySchema,
    responseSubcategorySchema,
    subcategoryIdSchema
} from "../../modules/subcategories/subcategory.schema";
import { FastifyInstance } from "fastify";
import { registerUserSchema } from "../../modules/users/user.schema";

export default function addSchemas(server: FastifyInstance) {
    [
        createProductPromoSchema,
        createProductInformationSchema,
        responseProductReviewSchema,
        responseProductImageSchema,
        productIdSchema,
        createProductSchema,
        responseProductSchema,
        registerUserSchema,
        categoryIdSchema,
        createCategorySchema,
        responseCategorySchema,
        subcategoryIdSchema,
        createSubcategorySchema,
        responseSubcategorySchema
    ].forEach(schema => server.addSchema(schema))
}

import { FastifyReply, FastifyRequest } from "fastify";
import {
    CreateCategoryInput,
    ResponseCategory,
    UpdateCategoryInput,
    FilterCategoryProductsQuery
} from "./category.schema";
import {
    createCategoryService,
    deleteCategoryService,
    getAllCategoriesService,
    getCategoryService,
    updateCategoryService
} from "./category.service";
import { UuidOrSlugParams, UuidParams } from "../shared/schemas";
import { processProducts } from "../products/product.service";

async function processCategory(category: ResponseCategory, filterData: FilterCategoryProductsQuery) {
    category.filter = filterData
    category.subcategoriesCount = category.subcategories ? category.subcategories.length : 0
    if (!category.parentCategoryId) {
        if (category.products) {
            const productsData = await processProducts(category.products)
            category.productsCount = productsData.productsCount
            category.products = productsData.products
            category.productsMinPrice = productsData.productsMinPrice
            category.productsMaxPrice = productsData.productsMaxPrice
        } else {
            category.productsCount = 0
            category.productsMinPrice = undefined  // todo fix typing to null
            category.productsMaxPrice = undefined // todo fix typing to null
        }
    }
    return category
}


export async function getCategoryHandler(
    request: FastifyRequest<{ Querystring: FilterCategoryProductsQuery, Params: UuidOrSlugParams }>,
    reply: FastifyReply
) {
    const category = await getCategoryService(request.params, request.query)
    if (!category) return reply.code(404).send({error: `Category with id ${JSON.stringify(request.params)} not found.`});

    reply.code(200).send(
        {
            message: "Success",
            //  todo fix typing
            data: await processCategory(category as any, request.query)
        })
}

export async function getAllCategoriesHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const result = await getAllCategoriesService();
    return reply.code(200).send({message: "Success", data: result});
}


export async function createCategoryHandler(
    request: FastifyRequest<{
        Body: CreateCategoryInput;
    }>,
    reply: FastifyReply
) {
    const result = await createCategoryService(request.body);
    const categoryType = Boolean(result.parentCategoryId) ? 'Subcategory' : 'Category'
    return reply.code(201).send({message: `${categoryType} created`, data: result});
}


export async function updateCategoryHandler(
    request: FastifyRequest<{ Params: UuidParams, Body: UpdateCategoryInput }>,
    reply: FastifyReply
) {
    const result = await updateCategoryService(request.params.id, request.body);
    return reply.code(200).send({message: "Category updated", data: result});
}

export async function deleteCategoryHandler(
    request: FastifyRequest<{ Params: UuidParams }>,
    reply: FastifyReply
) {
    const id = request.params.id
    const result = await deleteCategoryService(id)
    return reply.code(200).send({message: `Success. Category with id ${id} deleted`, data: result});
}
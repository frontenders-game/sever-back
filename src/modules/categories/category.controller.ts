import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCategoryInput, GetCategoryQuery, UpdateCategoryInput } from "./category.schema";
import {
    createCategoryService,
    deleteCategoryService,
    getAllCategoriesService,
    getCategoryService,
    updateCategoryService
} from "./category.service";
import { UuidOrSlugParams, UuidParams } from "../shared/schemas";

export async function getCategoryHandler(
    request: FastifyRequest<{ Querystring: GetCategoryQuery, Params: UuidOrSlugParams }>,
    reply: FastifyReply
) {
    const category = await getCategoryService(request.params, request.query)
    if (!category) return reply.code(404).send({error: `Category with id ${JSON.stringify(request.params)} not found.`});
    return category
        ? reply.code(200).send({message: "Success", data: category})
        : reply.code(404).send({error: `Category with id ${JSON.stringify(request.params)} not found.`});
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
    return reply.code(201).send({message: "Category created", data: result});
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
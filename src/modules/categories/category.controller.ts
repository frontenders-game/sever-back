import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";
import {
    createCategoryService,
    deleteCategoryService,
    getAllCategoriesService,
    getCategoryService,
    updateCategoryService
} from "./category.service";
import { UuidParamsRequest } from "../shared/schemas";

export async function getCategoryHandler(
    request: FastifyRequest<{ Params: UuidParamsRequest }>,
    reply: FastifyReply
) {
    const id = request.params.id
    const category = await getCategoryService(id)
    console.log(category)
    return category
        ? reply.code(200).send({message: "Success", data: category})
        : reply.code(404).send({error: `Category with id ${id} not found.`});
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
    return reply.code(201).send({message: "category created", data: result});
}


export async function updateCategoryHandler(
    request: FastifyRequest<{ Params: UuidParamsRequest, Body: UpdateCategoryInput }>,
    reply: FastifyReply
) {
    const result = await updateCategoryService(request.params.id, request.body);
    return reply.code(200).send({message: "category updated", data: result});
}

export async function deleteCategoryHandler(
    request: FastifyRequest<{ Params: UuidParamsRequest }>,
    reply: FastifyReply
) {
    const id = request.params.id
    const result = await deleteCategoryService(id)
    return reply.code(200).send({message: `Success. Category with id ${id} deleted`, data: result});
}
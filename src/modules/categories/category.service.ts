import prisma from "../../utils/prisma";
import {
    CreateSubcategoryInput,
    GetCategoryQuery,
    GetCategoryWhereCondition,
    UpdateCategoryInput
} from "./category.schema";
import { slugifyString } from "../../utils/misc";
import { Category } from "@prisma/client";


export async function getCategoryService(whereFilter: GetCategoryWhereCondition,
                                         filterOptions: GetCategoryQuery) {
    const {sortPrice, subcategoryId, productOffset, productLimit, minPrice, maxPrice} = filterOptions
    return prisma.category.findUnique({
            where: {
                ...whereFilter
            },
            include: {
                subcategories: {
                    where: subcategoryId? {
                        id: subcategoryId
                    }: undefined,
                    select: {
                        products: true,
                        id: true,
                        name: true,
                        slug: true,
                        image: true,
                    }
                },
                products: {
                    where: {
                        priceWithCard: {
                            gte: minPrice,
                            lte: maxPrice
                        }
                    },
                    skip: productOffset,
                    take: productLimit,
                    include: {
                        images: true,
                        reviews: true,
                        information: true
                    },
                    orderBy: sortPrice ? {
                        priceWithCard: sortPrice
                    }: undefined
                }
            }
        }
    )
}


export async function getAllCategoriesService(): Promise<Category[]> {
    // @todo filter categories that contain products
    return prisma.category.findMany({
        where: {
            parentCategoryId: null
        },
        orderBy: {
            order: 'asc'
        },
    })
}

export async function createCategoryService(categoryInput: CreateSubcategoryInput) {
    return prisma.category.create({
        data: {
            ...categoryInput,
            slug: slugifyString(categoryInput.name),
        }
    })
}

export async function updateCategoryService(categoryId: string, categoryUpdate: UpdateCategoryInput) {
    return prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            ...categoryUpdate,
            slug: slugifyString(categoryUpdate.name),
        },
    })
}

export async function deleteCategoryService(categoryId: string) {
    return prisma.category.delete({
        where: {
            id: categoryId,
        },
    })
}
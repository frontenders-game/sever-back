import prisma from "../../utils/prisma";
import { Category } from "@prisma/client";
import { FilterProductQuery } from "../products/product.schema";
import {
    CreateSubcategoryInput,
    GetCategoryWhereCondition,
    UpdateCategoryInput
} from "./category.schema";
import { slugifyString } from "../../utils/misc";


export async function getCategoryService(whereFilter: GetCategoryWhereCondition,
                                         filterOptions: FilterProductQuery) {
    const {productsSortPrice, subcategoryId, productsOffset, productsLimit,
        productsFilterNew, productsFilterWithDiscount, productsMaxPrice, productsMinPrice} = filterOptions
    return prisma.category.findUnique({
            where: {
                ...whereFilter
            },
            include: {
                subcategories: {
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
                            gte: productsMinPrice,
                            lte: productsMaxPrice
                        },
                        subcategoryId: subcategoryId ? subcategoryId: undefined,
                        isNew: productsFilterNew ? productsFilterNew: undefined,
                        discountIsActive: productsFilterWithDiscount ? productsFilterWithDiscount: undefined
                    },
                    skip: productsOffset,
                    take: productsLimit,
                    include: {
                        images: true,
                        reviews: true,
                        information: true
                    },
                    orderBy: productsSortPrice ? {
                        priceWithCard: productsSortPrice
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
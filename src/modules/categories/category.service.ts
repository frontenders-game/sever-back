import prisma from "../../utils/prisma";
import { Category } from "@prisma/client";
import {
    CreateSubcategoryInput,
    FilterCategoryProductsQuery,
    GetCategoryWhereCondition,
    UpdateCategoryInput
} from "./category.schema";
import { slugifyString } from "../../utils/misc";


export async function getCategoryService(whereFilter: GetCategoryWhereCondition,
                                         filterOptions: FilterCategoryProductsQuery) {
    const {
        productsOffset,
        productsLimit,
        productsFilterNew,
        productsFilterWithDiscount,
        productsFilterInStock,
        productsSortPrice,
        productsMaxPrice,
        productsMinPrice,
        subcategoryId
    } = filterOptions
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
                        subcategoryId: subcategoryId ? subcategoryId : undefined,
                        isNew: productsFilterNew ? true : undefined,
                        discountIsActive: productsFilterWithDiscount ? true : undefined,
                        stockCount: productsFilterInStock ? {gt: 0} : undefined
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
                    } : undefined
                }
            }
        }
    )
}

export async function getCategoryStats(categoryId: string, filterOptions: FilterCategoryProductsQuery) {
    const {
        productsFilterNew,
        productsFilterWithDiscount,
        productsFilterInStock,
        productsMaxPrice,
        productsMinPrice,
        subcategoryId
    } = filterOptions
    return prisma.product.aggregate({
        where: {
            categoryId: categoryId,
            priceWithCard: {
                gte: productsMinPrice,
                lte: productsMaxPrice
            },
            subcategoryId: subcategoryId ? subcategoryId : undefined,
            isNew: productsFilterNew ? true : undefined,
            discountIsActive: productsFilterWithDiscount ? true : undefined,
            stockCount: productsFilterInStock ? {gt: 0} : undefined
        },
        _count: {
            id: true
        },
        _min: {
            priceWithCard: true,
            discountedPrice: true
        },
        _max: {
            priceRegular: true
        }
    })
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
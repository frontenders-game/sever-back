import prisma from "../../utils/prisma";
import { CreateSubcategoryInput, UpdateSubcategoryInput } from "./subcategory.schema";
import { slugifyString } from "../../utils/misc";

export async function getSubcategoryService(subcategoryId: string) {
    return prisma.subcategory.findUnique({
        where: {
            id: subcategoryId,
        }, include: {
            products: true
        }
    })
}


export async function getAllSubCategoriesByCategoryId(categoryId: string) {
    return prisma.subcategory.findMany({
        where: {
            categoryId: categoryId,
        },
        include: {
            products: {
                where: {
                    stockCount: {
                        gt: 0
                    }
                },
                include: {
                    promo: true,
                    images: true
                },
                select: {
                    name: true,
                    priceRegular: true,
                    priceWithCard: true,
                    averageRating: true,
                }
            }
        }
    })
}


export async function createSubcategoryService(subcategoryInput: CreateSubcategoryInput) {
    const result = await prisma.subcategory.create({
        data: {
            ...subcategoryInput,
            slug: slugifyString(subcategoryInput.name)
        }
    })

    await prisma.category.update({
        where: {
            id: result.categoryId
        },
        data: {
            subcategoriesCount: {
                increment: 1
            }
        }
    })
    return result
}

export async function updateSubcategoryService(subcategoryId: string, subcategoryUpdate: UpdateSubcategoryInput) {
    return prisma.subcategory.update({
        where: {
            id: subcategoryUpdate.id,
        },
        data: {
            ...subcategoryUpdate,
            slug: slugifyString(subcategoryUpdate.name)
        },
    })
}

export async function deleteSubcategoryService(subcategoryId: string) {
    const result = await prisma.subcategory.delete({
        where: {
            id: subcategoryId,
        },
    })
    await prisma.category.update({
        where: {
            id: result.categoryId
        },
        data: {
            subcategoriesCount: {
                decrement: 1
            }
        }
    })
    return result
}
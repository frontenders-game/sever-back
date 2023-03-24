import prisma from "../../utils/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";
import { slugifyString } from "../../utils/misc";

export async function getCategoryService(categoryId: string) {
    return prisma.category.findUnique({
        where: {
            id: categoryId,
        },
        include: {
            subcategories: true,
            //     {
            //     select: {
            //         id: true,
            //         name: true,
            //         slug: true,
            //         description: true,
            //         productsCount: true
            //     }
            // },
            products: true
                // {
            //     where: {
            //         stockCount: {
            //             gt: 0,
            //         },
            //         categoryId: categoryId
            //     },
            //     include: {
            //         promo: true,
            //         images: true
            //     },
                // select: {
                //     promo: {},
                //     name: true,
                //     priceRegular: true,
                //     priceWithCard: true,
                //     averageRating: true,
                // }
            }
        // }
    })
}


export async function getAllCategoriesService() {
    // @todo filter categories that contain products
    return prisma.category.findMany()
}

// export async function getSubCategoriesCountByCategoryId(categoryId: string) {
//     return prisma.subcategory.count({
//         where: {
//             categoryId: categoryId,
//         },
//     })
// }

export async function createCategoryService(categoryInput: CreateCategoryInput) {
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
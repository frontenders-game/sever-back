import prisma from "../../utils/prisma";


export async function searchProductsService(searchText: string) {
    return await prisma.product.findMany({
        where: {
            name: {
                contains: searchText,
                mode: 'insensitive',
            }
        },
        include: {
            category: true
        },
    })
}

export async function searchCategoriesService(searchText: string) {
    return await prisma.category.findMany({
        where: {
            AND: [
                {
                    name: {
                        contains: searchText,
                        mode: 'insensitive',
                    }
                },
                {
                    parentCategoryId: null
                }]
        }
    })
}

export async function searchSubcategoriesService(searchText: string) {
    return await prisma.category.findMany({
        where: {
            AND: [
                {
                    name: {
                        contains: searchText,
                        mode: 'insensitive',
                    }
                },
                {
                    parentCategoryId: {
                        not: null
                    }
                }]
        },
        include: {
            parentCategory: true
        }
    })
}


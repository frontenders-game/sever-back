import fs from "fs";
import path from "path";
import { Category, ProductImage, Product } from "@prisma/client"; //
import { CreateCategoryInput } from "../src/modules/categories/category.schema";
import { CreateProductInput } from "../src/modules/products/product.schema";
import { createCategoryService } from "../src/modules/categories/category.service";
import { createProductService } from "../src/modules/products/product.service";
import ImageResizer from "../src/utils/image-utils";
import { createProductImageService } from "../src/modules/products/images/image.service";

const readDir = (dir: string) => fs.readdirSync(dir, {withFileTypes: true})


// type ReadJsonOutput = CreateProductInput | CreateSubcategoryInput | CreateCategoryInput
const readJson = (jsonPath: string) => {
    const file = fs.readFileSync(jsonPath, 'utf8')
    return JSON.parse(file)
}
const readCategory = (categoryDir: string): CreateCategoryInput => readJson(`${categoryDir}/category.json`)
const readSubcategory = (subcategoryDir: string): CreateCategoryInput => readJson(`${subcategoryDir}/subcategory.json`)


async function addImageToProduct(productPath: string, productId: string): Promise<ProductImage> {
    const imageData: Buffer = fs.readFileSync(productPath)
    const imageResizer = new ImageResizer(imageData, productId, 1)
    const imagePaths = await imageResizer.saveAll()
    // todo get max order
    return await createProductImageService({
        productId: productId,
        order: 1,
        ...imagePaths
    })
}

async function seedifyCategoriesAndProducts(dataDir: string) {
    const categories = readDir(dataDir);
    // iter categories
    for (const categoryFolder of categories) {
        const categoryDir = path.join(dataDir, categoryFolder.name)
        const category = readCategory(categoryDir)
        console.log('Working on Category: ', category.name, 'id ', categoryFolder.name)
        const addedCategory: Category = await createCategoryService(
            {name: category.name, description: `Категория: ${category.name}`})
        const subcategories = readDir(categoryDir)
        // iter subcategories
        for (const subcategoryFolder of subcategories) {
            if (subcategoryFolder.isDirectory()) {  // avoid category.json
                const subcategoryDir = path.join(categoryDir, subcategoryFolder.name)
                const productsJsonDir = path.join(subcategoryDir, 'products/json')
                const productsImageDir = path.join(subcategoryDir, 'products/images')
                if (!fs.existsSync(productsJsonDir)) continue  // no products
                const subcategory: CreateCategoryInput = readSubcategory(subcategoryDir)
                console.log('Working on Subcategory: ', subcategory.name, 'id ', subcategoryFolder.name)
                const addedSubcategory: Category =
                    await createCategoryService({
                        name: subcategory.name,
                        description: `Подкатегория: ${subcategory.name}`,
                        parentCategoryId: addedCategory.id
                    })
                console.log(addedSubcategory.id)
                const productJsons = readDir(productsJsonDir)
                for (const productJsonFile of productJsons) {
                    if (!productJsonFile.name.endsWith('json')) continue
                    const product: CreateProductInput =
                        readJson(path.join(productsJsonDir, productJsonFile.name))
                    const addedProduct: Product =
                        await createProductService({...product, subcategoryId: addedSubcategory.id})
                    console.log('added product:', addedProduct.id, product.name)
                    const productImagePath = path.join(productsImageDir, productJsonFile.name.replace('.json', ''), '1.jpg')
                    const addedProductImage = await addImageToProduct(productImagePath, addedProduct.id)
                    console.log(`added image: ${addedProductImage.id} for product ${addedProduct.id}`)
                }
            }
        }
    }
}

seedifyCategoriesAndProducts(path.join(__dirname, 'data'))
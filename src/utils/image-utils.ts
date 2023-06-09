import Jimp from "jimp";
import { Static, Type } from "@sinclair/typebox";


export const imageSchema = Type.Object(
    {
        full: Type.String({format: "uri"}),
        small: Type.String({format: "uri"}),
        thumb: Type.String({format: "uri"})
    },
    {$id: "createCategorySchema", additionalProperties: false}
)

export type ImageType = Static<typeof imageSchema>


export default class ImageResizer {

    constructor(private readonly imageBuffer: Buffer,
                private readonly productId: string,
                private readonly imageOrder: number,
                private readonly saveEntity: string = `products`,
                private readonly saveFolder: string = `${String(process.env.PUBLIC_DIR)}/`) {
    }

    private async resizeAndWrite(width: number,
                                 height: number,
                                 fileName: string,
                                 fileExtension: string = 'jpg',
                                 quality: number = 95
    ): Promise<string> {
        const savePath = `${this.saveFolder}${this.saveEntity}/images/${this.productId}/${this.imageOrder}/${fileName}.${fileExtension}`

        const image = await Jimp.read(this.imageBuffer);
        const w = image.bitmap.width
        const h = image.bitmap.height
        // Save and overwrite the image
        if ((h !== height && w !== width) || (h !== Jimp.AUTO && w !== Jimp.AUTO)) {
            (h > w)
                ? await image.resize(Jimp.AUTO, height, Jimp.RESIZE_BEZIER)  // horizontal
                : await image.resize(width, Jimp.AUTO, Jimp.RESIZE_BEZIER)   // vertical
        }
        if (quality > 0) await image.quality(quality)
        await image.writeAsync(savePath);
        return `${process.env.SERVER_URL}/${savePath}`
    }

    public async saveFull(): Promise<string> {
        return await this.resizeAndWrite(800, 800, '800x800', 'jpg', 0) // no quality change
    }

    public async saveSmall(): Promise<string> {
        return await this.resizeAndWrite(300, 300, '300x300', 'jpg')
    }

    public async saveThumb(): Promise<string> {
        return await this.resizeAndWrite(80, 80, '80x80', 'jpg', 100)
    }

    public async saveAll(): Promise<ImageType> {
        return {
            full: await this.saveFull(),
            small: await this.saveSmall(),
            thumb: await this.saveThumb()
        }

    }

    public async saveWithoutResizing(fileName: string): Promise<string> {
        return await this.resizeAndWrite(Jimp.AUTO, Jimp.AUTO, fileName, 'jpg')
    }

}



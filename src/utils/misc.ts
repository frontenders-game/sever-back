import slugify from "slugify";

export const slugifyString = function (inputString: string): string {
    return slugify(inputString, {
        replacement: '-',
        lower: true,
        locale: 'ru'
    })
}
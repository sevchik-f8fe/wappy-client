/**
 * Хуки для обработки данных на странице элемента
 * 
 * Хуки и их функции:
 * 
 * 1. useTenor - для гифок с Tenor
 *    @function getTenorVariants - извлекает все доступные форматы:
 *      - GIF: gif, mediumgif, nanogif, tinygif
 *      - MP4: mp4, loopedmp4, nanomp4, tinymp4
 *      - WebM: webm, nanowebm, tinywebm
 *      - WebP: webp
 * 
 * 2. useSVG - для SVG изображений
 *    @function getSVGVariants - возвращает варианты:
 *      - Если есть dark/light: возвращает оба варианта + wordmark
 *      - Иначе: только основной route
 * 
 * 3. usePhoto - для фотографий с WHVN
 *    @function getFormat - определяет формат файла из расширения
 *    @function getPhotoVariants - возвращает массив с одним элементом
 *      (содержит URL, размер, ширину, высоту)
 * 
 * Все функции фильтруют null/undefined значения
 */

export const useTenor = () => {
    const getTenorVariants = (data) => {
        if (!data?.media || !Array.isArray(data.media) || data.media.length === 0) {
            return [];
        }
        return [
            { format: 'gif', url: data?.media[0]?.gif?.url, size: data?.media[0]?.gif?.size, duration: data?.media[0]?.gif?.duration },
            { format: 'gif', url: data?.media[0]?.mediumgif?.url, size: data?.media[0]?.mediumgif?.size, duration: data?.media[0]?.mediumgif?.duration },
            { format: 'gif', url: data?.media[0]?.nanogif?.url, size: data?.media[0]?.nanogif?.size, duration: data?.media[0]?.nanogif?.duration },
            { format: 'gif', url: data?.media[0]?.tinygif?.url, size: data?.media[0]?.tinygif?.size, duration: data?.media[0]?.tinygif?.duration },
            { format: 'mp4', url: data?.media[0]?.mp4?.url, size: data?.media[0]?.mp4?.size, duration: data?.media[0]?.mp4?.duration },
            { format: 'mp4 (loop)', url: data?.media[0]?.loopedmp4?.url, size: data?.media[0]?.loopedmp4?.size, duration: data?.media[0]?.loopedmp4?.duration },
            { format: 'mp4', url: data?.media[0]?.nanomp4?.url, size: data?.media[0]?.nanomp4?.size, duration: data?.media[0]?.nanomp4?.duration },
            { format: 'mp4', url: data?.media[0]?.tinymp4?.url, size: data?.media[0]?.tinymp4?.size, duration: data?.media[0]?.tinymp4?.duration },
            { format: 'webm', url: data?.media[0]?.webm?.url, size: data?.media[0]?.webm?.size, duration: data?.media[0]?.webm?.duration },
            { format: 'webm', url: data?.media[0]?.nanowebm?.url, size: data?.media[0]?.nanowebm?.size, duration: data?.media[0]?.nanowebm?.duration },
            { format: 'webm', url: data?.media[0]?.tinywebm?.url, size: data?.media[0]?.tinywebm?.size, duration: data?.media[0]?.tinywebm?.duration },
            { format: 'webp', url: data?.media[0]?.webp?.url, size: data?.media[0]?.webp?.size, duration: data?.media[0]?.webp?.duration },
        ].filter(variant => variant.url);
    };

    return {
        getTenorVariants
    }
};

export const useSVG = () => {
    const getSVGVariants = (data) => {
        return data?.route?.dark ? [
            { format: 'svg (dark)', url: data?.route?.dark },
            { format: 'svg (light)', url: data?.route?.light },
            { format: 'svg (dark wordmark)', url: data?.wordmark?.dark },
            { format: 'svg (light wordmark)', url: data?.wordmark?.light },
        ].filter(variant => variant.url) : [{ format: 'svg', url: data?.route }].filter(variant => variant.url)
    }

    return {
        getSVGVariants
    }
};

export const usePhoto = () => {
    const getFormat = (str) => {
        return str?.split('.')[str?.split('.')?.length - 1]
    }
    const getPhotoVariants = (data) => {
        return [
            { format: getFormat(data?.path), url: data?.path, size: data?.file_size, height: data?.dimension_y, width: data?.dimension_x },
        ].filter(variant => variant.url)
    }

    return {
        getPhotoVariants
    }
};
import { useTenor, useSVG, usePhoto } from '../../../pages/ItemPage/itemHooks';

describe('itemHooks', () => {
    describe('useTenor', () => {
        test('getTenorVariants returns correct format', () => {
            const { getTenorVariants } = useTenor();

            const mockData = {
                media: [{
                    gif: { url: 'gif-url', size: 1000, duration: 5 },
                    mediumgif: { url: 'medium-url', size: 500, duration: 5 },
                    mp4: { url: 'mp4-url', size: 800, duration: 5 }
                }]
            };

            const variants = getTenorVariants(mockData);

            expect(variants).toHaveLength(3);
            expect(variants[0]).toEqual({
                format: 'gif',
                url: 'gif-url',
                size: 1000,
                duration: 5
            });
        });

        test('handles missing media gracefully', () => {
            const { getTenorVariants } = useTenor();

            const variants = getTenorVariants({});

            expect(variants).toEqual([]);
        });

        test('filters out variants with missing URLs', () => {
            const { getTenorVariants } = useTenor();

            const mockData = {
                media: [{
                    gif: { url: '', size: 1000 },
                    mediumgif: { url: 'valid-url', size: 500 }
                }]
            };

            const variants = getTenorVariants(mockData);

            expect(variants).toHaveLength(1);
            expect(variants[0].url).toBe('valid-url');
        });
    });

    describe('useSVG', () => {
        test('getSVGVariants handles dark/light themes', () => {
            const { getSVGVariants } = useSVG();

            const mockData = {
                route: { dark: 'dark-url', light: 'light-url' },
                wordmark: { dark: 'word-dark', light: 'word-light' }
            };

            const variants = getSVGVariants(mockData);

            expect(variants).toHaveLength(4);
            expect(variants[0]).toEqual({
                format: 'svg (dark)',
                url: 'dark-url'
            });
        });

        test('getSVGVariants handles single route', () => {
            const { getSVGVariants } = useSVG();

            const mockData = {
                route: 'simple-url'
            };

            const variants = getSVGVariants(mockData);

            expect(variants).toHaveLength(1);
            expect(variants[0]).toEqual({
                format: 'svg',
                url: 'simple-url'
            });
        });
    });

    describe('usePhoto', () => {
        test('getPhotoVariants extracts correct data', () => {
            const { getPhotoVariants } = usePhoto();

            const mockData = {
                path: 'image.jpg',
                file_size: 2048000,
                dimension_x: 1920,
                dimension_y: 1080
            };

            const variants = getPhotoVariants(mockData);

            expect(variants[0]).toEqual({
                format: 'jpg',
                url: 'image.jpg',
                size: 2048000,
                height: 1080,
                width: 1920
            });
        });
    });
});
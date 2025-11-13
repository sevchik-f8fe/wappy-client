import { combineAndShuffleArrays, getUrl, handleDownload } from '../../dashboard';
import { jest } from '@jest/globals';

jest.mock('../../__mocks__/axiosConfig', () => ({
    post: jest.fn(() => Promise.resolve({ data: {} }))
}));

describe('dashboard utilities', () => {
    describe('combineAndShuffleArrays', () => {
        test('combines and shuffles arrays without duplicates', () => {
            const photos = [{ id: '1', title: 'photo1' }];
            const tenor = [{ id: '2', title: 'tenor1' }];
            const svg = [{ id: '3', title: 'svg1' }];

            const result = combineAndShuffleArrays(photos, tenor, svg);

            expect(result).toHaveLength(3);
            expect(result.map(item => item.data.id)).toEqual(expect.arrayContaining(['1', '2', '3']));
        });

        test('removes duplicate items', () => {
            const photos = [{ id: '1', title: 'photo1' }];
            const tenor = [{ id: '1', title: 'duplicate' }];

            const result = combineAndShuffleArrays(photos, tenor, []);
            expect(result).toHaveLength(1);
        });
    });

    describe('getUrl', () => {
        test('returns correct URL for tenor source', () => {
            const mockData = {
                media: [{
                    gif: { url: 'gif-url' },
                    tinygif: { url: 'tinygif-url' }
                }]
            };

            expect(getUrl('tenor', mockData)).toBe('gif-url');
            expect(getUrl('tenor', mockData, 'thumb')).toBe('tinygif-url');
        });
    });
});
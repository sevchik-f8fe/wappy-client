import { itemReducer, setData } from '../../../pages/ItemPage/ItemSlice';

describe('itemSlice', () => {
    const initialState = {
        variants: null,
        original_url: null,
        title: null,
        data: null,
    };

    it('should return initial state when empty action', () => {
        const result = itemReducer(undefined, { type: '' });
        expect(result).toEqual(initialState);
    });

    it('should update specific field with setData action', () => {
        const testData = {
            field: 'title',
            value: 'Test Title'
        };

        const result = itemReducer(initialState, setData(testData));
        expect(result.title).toBe('Test Title');
    });

    it('should update multiple fields independently with setData', () => {
        const firstUpdate = {
            field: 'variants',
            value: ['variant1', 'variant2']
        };

        const secondUpdate = {
            field: 'original_url',
            value: 'https://example.com'
        };

        let state = itemReducer(initialState, setData(firstUpdate));
        state = itemReducer(state, setData(secondUpdate));

        expect(state.variants).toEqual(['variant1', 'variant2']);
        expect(state.original_url).toBe('https://example.com');
        expect(state.title).toBeNull();
        expect(state.data).toBeNull();
    });

    it('should handle null values with setData', () => {
        const testData = {
            field: 'data',
            value: null
        };

        const result = itemReducer(initialState, setData(testData));
        expect(result.data).toBeNull();
    });

    it('should preserve other fields when updating one field', () => {
        const modifiedState = {
            variants: ['test'],
            original_url: 'https://test.com',
            title: 'Original Title',
            data: { existing: true }
        };

        const update = {
            field: 'title',
            value: 'New Title'
        };

        const result = itemReducer(modifiedState, setData(update));

        expect(result.title).toBe('New Title');
        expect(result.variants).toEqual(['test']);
        expect(result.original_url).toBe('https://test.com');
        expect(result.data).toEqual({ existing: true });
    });
});
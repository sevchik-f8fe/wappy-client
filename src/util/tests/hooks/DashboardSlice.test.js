import { dashboardReducer, setQuery, setData, setPage } from '../../../pages/DashboardPage/DashboardSlice';

describe('DashboardSlice', () => {
    const initialState = {
        data: [],
        isImg: true,
        isSVG: true,
        isGif: true,
        tenorNext: null,
        query: '',
        page: 1,
        loading: false,
        hasMore: true,
    };

    test('should handle setQuery', () => {
        const action = setQuery({
            query: 'test',
            isImg: false,
            isSVG: false,
            isGif: false
        });
        const state = dashboardReducer(initialState, action);
        expect(state.query).toBe('test');
        expect(state.isImg).toBe(false);
    });

    test('should handle setData with unique items', () => {
        const mockData = [
            { source: 'tenor', data: { id: '1' } },
            { source: 'tenor', data: { id: '1' } },
            { source: 'whvn', data: { id: '2' } }
        ];

        const action = setData({ data: mockData });
        const state = dashboardReducer(initialState, action);
        expect(state.data).toHaveLength(2);
    });

    test('should handle setPage', () => {
        const action = setPage({ page: 5 });
        const state = dashboardReducer(initialState, action);
        expect(state.page).toBe(5);
    });

    test('should maintain immutability', () => {
        const action = setQuery({ query: 'test', isImg: false });
        const state = dashboardReducer(initialState, action);

        expect(state).not.toBe(initialState);
        expect(initialState.query).toBe('');
    });

    test('should reset page when query changes', () => {
        const stateWithPage = { ...initialState, page: 5 };
        const action = setQuery({ query: 'new search', isImg: true });

        const state = dashboardReducer(stateWithPage, action);

        expect(state.page).toBe(1);
        expect(state.query).toBe('new search');
    });
});
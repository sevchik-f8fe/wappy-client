import { globalReducer, setGlobalData } from '../../globalSlice';

describe('GlobalSlice', () => {
    const initialState = {
        user: null,
        token: null,
        dialog: false,
    };

    test('should handle setGlobalData for user', () => {
        const mockUser = { email: 'test@test.com', name: 'Test User' };
        const action = setGlobalData({ field: 'user', value: mockUser });
        const state = globalReducer(initialState, action);
        expect(state.user).toEqual(mockUser);
    });

    test('should handle setGlobalData for token', () => {
        const action = setGlobalData({ field: 'token', value: 'jwt-token' });
        const state = globalReducer(initialState, action);
        expect(state.token).toBe('jwt-token');
    });

    test('should handle multiple field updates in sequence', () => {
        let state = globalReducer(initialState, setGlobalData({ field: 'user', value: { name: 'John' } }));
        state = globalReducer(state, setGlobalData({ field: 'token', value: 'token123' }));
        state = globalReducer(state, setGlobalData({ field: 'dialog', value: true }));

        expect(state.user).toEqual({ name: 'John' });
        expect(state.token).toBe('token123');
        expect(state.dialog).toBe(true);
    });
});
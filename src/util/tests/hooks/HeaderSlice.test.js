import { headerReducer, setHeaderData } from '../../../components/HeaderSlice';

describe('HeaderSlice', () => {
    const initialState = {
        delDialog: false,
        outDialog: false
    };

    test('should return initial state', () => {
        expect(headerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('should handle setHeaderData for delDialog', () => {
        const action = setHeaderData({ field: 'delDialog', data: true });
        const state = headerReducer(initialState, action);

        expect(state.delDialog).toBe(true);
        expect(state.outDialog).toBe(false); // Should remain unchanged
    });

    test('should handle setHeaderData for outDialog', () => {
        const action = setHeaderData({ field: 'outDialog', data: true });
        const state = headerReducer(initialState, action);

        expect(state.outDialog).toBe(true);
        expect(state.delDialog).toBe(false); // Should remain unchanged
    });

    test('should handle multiple dialog state changes', () => {
        let state = headerReducer(initialState, setHeaderData({ field: 'delDialog', data: true }));
        state = headerReducer(state, setHeaderData({ field: 'outDialog', data: true }));

        expect(state.delDialog).toBe(true);
        expect(state.outDialog).toBe(true);
    });

    test('should handle closing dialogs', () => {
        const stateWithOpenDialogs = {
            delDialog: true,
            outDialog: true
        };

        let state = headerReducer(stateWithOpenDialogs, setHeaderData({ field: 'delDialog', data: false }));
        state = headerReducer(state, setHeaderData({ field: 'outDialog', data: false }));

        expect(state.delDialog).toBe(false);
        expect(state.outDialog).toBe(false);
    });

    test('should maintain immutability', () => {
        const action = setHeaderData({ field: 'delDialog', data: true });
        const state = headerReducer(initialState, action);

        expect(state).not.toBe(initialState);
        expect(initialState.delDialog).toBe(false); // Original state unchanged
    });

    test('should handle unknown field gracefully', () => {
        const action = setHeaderData({ field: 'unknownField', data: 'test' });
        const state = headerReducer(initialState, action);

        // Should not crash and return valid state
        expect(state).toBeDefined();
        expect(state).toEqual(initialState); // Unknown fields should be ignored
    });
});
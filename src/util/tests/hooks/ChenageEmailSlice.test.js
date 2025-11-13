import { chnageEmailReducer, setAuthField, setAuthError, setSimpleField } from '../../../pages/ChangeEmailPage/ChenageEmailSlice';

describe('ChenageEmailSlice', () => {
    const initialState = {
        email: { value: '', error: false },
        code: '',
        timer: 120,
        step: 0
    };

    test('should return initial state', () => {
        expect(chnageEmailReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('should handle setAuthField for email', () => {
        const action = setAuthField({ field: 'email', value: 'new@example.com' });
        const state = chnageEmailReducer(initialState, action);

        expect(state.email.value).toBe('new@example.com');
        expect(state.email.error).toBe(false);
    });

    test('should handle setAuthError for email', () => {
        const action = setAuthError({ field: 'email', error: true });
        const state = chnageEmailReducer(initialState, action);

        expect(state.email.error).toBe(true);
        expect(state.email.value).toBe('');
    });

    test('should handle setSimpleField for code', () => {
        const action = setSimpleField({ field: 'code', value: '123456' });
        const state = chnageEmailReducer(initialState, action);

        expect(state.code).toBe('123456');
    });

    test('should handle setSimpleField for timer', () => {
        const action = setSimpleField({ field: 'timer', value: 60 });
        const state = chnageEmailReducer(initialState, action);

        expect(state.timer).toBe(60);
    });

    test('should handle setSimpleField for step', () => {
        const action = setSimpleField({ field: 'step', value: 2 });
        const state = chnageEmailReducer(initialState, action);

        expect(state.step).toBe(2);
    });

    test('should maintain immutability', () => {
        const action = setAuthField({ field: 'email', value: 'test@example.com' });
        const state = chnageEmailReducer(initialState, action);

        expect(state).not.toBe(initialState);
        expect(initialState.email.value).toBe('');
    });

    test('should handle unknown field in setAuthField gracefully', () => {
        const action = setAuthField({ field: 'unknownField', value: 'test' });
        const state = chnageEmailReducer(initialState, action);

        expect(state).toBeDefined();
        expect(state).toEqual(initialState);
    });
});
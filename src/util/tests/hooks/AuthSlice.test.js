import { authReducer, setAuthField, setAuthError, setSimpleField } from '../../../pages/SignUpPage/AuthSlice';

describe('AuthSlice', () => {
    const initialState = {
        email: { value: '', error: false },
        password: { value: '', error: false },
        passwordRep: { value: '', error: false },
        code: '',
        timer: 120,
        step: 0,
        confOk: false,
        persOk: false,
        loading: false,
    };

    test('should return initial state for unknown action', () => {
        const state = authReducer(undefined, { type: 'unknown' });
        expect(state).toEqual(initialState);
    });

    test('should handle setAuthField for existing fields', () => {
        const action = setAuthField({ field: 'email', value: 'test@test.com' });
        const state = authReducer(initialState, action);
        expect(state.email.value).toBe('test@test.com');
        expect(state.email.error).toBe(false);
    });

    test('should handle setAuthError for existing fields', () => {
        const action = setAuthError({ field: 'email', error: true });
        const state = authReducer(initialState, action);
        expect(state.email.error).toBe(true);
        expect(state.email.value).toBe('');
    });

    test('should handle setSimpleField', () => {
        const action = setSimpleField({ field: 'step', value: 1 });
        const state = authReducer(initialState, action);
        expect(state.step).toBe(1);
    });

    test('should handle unknown field in setAuthField gracefully', () => {
        const action = setAuthField({ field: 'unknownField', value: 'test' });
        const state = authReducer(initialState, action);

        expect(state).toBeDefined();
        expect(state).toEqual(initialState);
    });
});
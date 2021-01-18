import * as ACTION_TYPES from '../actions/action_types';

export const initialState = {
    profile: null,
    errors: {},
};

export const AuthReducer = (state=initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SIGNUP_SUCCESS:
            return {
                ...state,
                errors: {},
            }
        case ACTION_TYPES.LOGIN_SUCCESS:
            return {
                profile: action.payload,
                errors: {},
            }
        case ACTION_TYPES.AUTH_FAILURE:
            return {
                profile: null,
                errors: action.payload,
            }
        case ACTION_TYPES.LOGOUT:
            return {
                profile: null,
                errors: {},
            }
        default:
            return state
    }
}

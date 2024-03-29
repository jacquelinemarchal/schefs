import * as ACTION_TYPES from './action_types';

/* AUTH ACTIONS */

export const signupSuccess = () => ({
    type: ACTION_TYPES.SIGNUP_SUCCESS,
});

export const loginSuccess = (profile) => ({
    type: ACTION_TYPES.LOGIN_SUCCESS,
    payload: profile,
});

export const authFailure = (errors) => ({
    type: ACTION_TYPES.AUTH_FAILURE,
    payload: errors,
});

export const logout = () => ({
    type: ACTION_TYPES.LOGOUT
});

export const updateProfile = (profile) => ({
    type: ACTION_TYPES.UPDATE_PROFILE,
    payload: profile
});

/* CARD ACTIONS */

export const openCard = () => ({
    type: ACTION_TYPES.OPEN_CARD,
});

export const closeCard = () => ({
    type: ACTION_TYPES.CLOSE_CARD,
});

export const toggleCard = () => ({
    type: ACTION_TYPES.TOGGLE_CARD,
});

export const setEvents = (events) => ({
    type: ACTION_TYPES.SET_EVENTS,
    payload: events,
});

export const setMyEvents = (events) => ({
    type: ACTION_TYPES.SET_MY_EVENTS,
    payload: events,
});

export const setLeftProfile = (profile) => ({
    type: ACTION_TYPES.SET_LEFT_PROFILE,
    payload: profile,
});

/* EVENTS ACTIONS */

export const setHomeEvents = (events) => ({
    type: ACTION_TYPES.SET_HOME_EVENTS,
    payload: events,
});

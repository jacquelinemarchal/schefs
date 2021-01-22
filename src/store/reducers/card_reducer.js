import * as ACTION_TYPES from '../actions/action_types'

export const initialState = {
    isOpen: false,
    events: null,
    myEvents: null,
}

export const CardReducer = (state=initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.OPEN_CARD:
            return {
                ...state,
                isOpen: true,
            }
        case ACTION_TYPES.CLOSE_CARD:
            return {
                ...state,
                isOpen: false,
            }
        case ACTION_TYPES.TOGGLE_CARD:
            return {
                ...state,
                isOpen: !state.isOpen
            }
        case ACTION_TYPES.SET_EVENTS:
            return {
                ...state,
                events: [...action.payload],
            }
        case ACTION_TYPES.SET_MY_EVENTS:
            return {
                ...state,
                myEvents: [...action.payload],
            }
        default:
            return state
    }
}

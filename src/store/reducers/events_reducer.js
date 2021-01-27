import * as ACTION_TYPES from '../actions/action_types'

export const initialState = {
    events: null,
}

export const EventsReducer = (state=initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_HOME_EVENTS:
            return {
                ...state,
                events: action.payload,
            }
        default:
            return state
    }
}

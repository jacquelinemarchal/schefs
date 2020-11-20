/**
 * @file Configures actions for the card.
 *
 * @requires /Client/src/store/actions/action_types
 */

import * as ACTION_TYPES from '../actions/action_types'

export const initialState = {
    isOpen: false,
}

export const CardReducer = (state=initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.OPEN_CARD:
            return {
                isOpen: true,
            }
        case ACTION_TYPES.CLOSE_CARD:
            return {
                isOpen:false,
            }
        case ACTION_TYPES.TOGGLE_CARD:
            return {
                isOpen:!state.isOpen
            }
        default:
            return state
    }
}
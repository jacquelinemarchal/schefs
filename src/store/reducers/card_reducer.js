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
        case 'openCard':
            return {
                isOpen: true,
            }
        case 'closeCard':
            return {
                isOpen:false,
            }
        case 'toggleCard':
            return {
                isOpen:!state.isOpen
            }
        default:
            return state
    }
}
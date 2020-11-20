/**
 * @file Configures actions for React reducers.
 *
 * @requires NPM:axios
 * @requires /Client/src/store/action_types
 */

import * as ACTION_TYPES from './action_types';

/* Auth actions */

/* Card actions */

export const closeCard = () => ({
    type: ACTION_TYPES.CLOSE_CARD,
})

export const openCard = () => ({
    type: ACTION_TYPES.OPEN_CARD
})

export const toggleCard = () => ({
    type: ACTION_TYPES.TOGGLE_CARD
})
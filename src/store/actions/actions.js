import * as ACTION_TYPES from './action_types';

export const openCard = () => ({
    type: ACTION_TYPES.OPEN_CARD,
});

export const closeCard = () => ({
    type: ACTION_TYPES.CLOSE_CARD,
});

export const toggleCard = () => ({
    type: ACTION_TYPES.TOGGLE_CARD,
});

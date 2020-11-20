import React, { useReducer } from 'react';
import Context from '../utils/context';
import * as ACTIONS from '../store/actions/actions';
import * as CardReducer from '../store/reducers/card_reducer';
// import Banner from "../components/Banners/banner"
// import NavBar from "../components/Banners/navbar"
// import CardButton from "../components/Card/cardbutton"
// import Card from "../components/Card/card"

const ContextState = () => {
    /* useReducer */
    const [stateCardReducer, dispatchCardReducer] = useReducer(CardReducer.CardReducer, CardReducer.initialState);

    const toggleCard = () => {
        dispatchCardReducer('toggleCard');
    }
    const closeCard = () => {
        dispatchCardReducer('closeCard');
    }
    const openCard = (stateCardReducer) => {
        dispatchCardReducer('openCard');
    }

    return (
        <Context.Provider
        value={{ cardState: stateCardReducer, cardDispatch: dispatchCardReducer }} />
            /* Card Reducer
            toggleCard: toggleCard(),
            closeCard: closeCard(),
            openCard: openCard(),*/
    )
}

export default ContextState;
/*  <div className={(openCard ? 'overflow-hidden fixed' : '')}>
                <Component {...pageProps}/>
            </div>*/
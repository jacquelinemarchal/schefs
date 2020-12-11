import React, { useReducer } from 'react';
import { CSSTransition } from 'react-transition-group';

import * as ACTIONS from '../../store/actions/actions';
import * as CardReducer from '../../store/reducers/card_reducer';
import Context from './context';
import NavBar from '../Banners/navbar';
import Banner from '../Banners/banner';
import Card from '../Card/card';
import CardButton from '../Card/cardbutton';
import GreyOut from '../Card/greyout';

const ContextState = ({ Component, pageProps, bannerProps }) => {
    const [stateCardReducer, dispatchCardReducer] = useReducer(
        CardReducer.CardReducer,
        CardReducer.initialState,
    );

    const handleOpenCard = () =>
        dispatchCardReducer(ACTIONS.openCard())

    const handleCloseCard = () =>
        dispatchCardReducer(ACTIONS.closeCard())

    const handleToggleCard = () =>
        dispatchCardReducer(ACTIONS.toggleCard())

    return (
        <Context.Provider
          value={{
            cardIsOpen: stateCardReducer.isOpen,
            handleOpenCard,
            handleCloseCard,
            handleToggleCard,
          }}
        >
          <Banner {...bannerProps} />
          <NavBar scrollShadow={false} />
          <CardButton/>
  
          <CSSTransition
            in={stateCardReducer.isOpen}
            timeout={500}
            key="grey-out"
            unmountOnExit
            classNames="grey-out"
          >
            <GreyOut />
          </CSSTransition>
  
          <CSSTransition
            in={stateCardReducer.isOpen}
            timeout={500}
            key="card"
            unmountOnExit
            classNames="card"
          >
            <Card />
          </CSSTransition>
  
          <div className={(stateCardReducer.isOpen ? 'overflow-hidden fixed' : '')}>
              <Component {...pageProps}/>
          </div>
        </Context.Provider>
    );
};

export default ContextState;

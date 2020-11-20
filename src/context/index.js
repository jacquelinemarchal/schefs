import React, { useReducer } from 'react';
import Context from '../utils/context';
import * as ACTIONS from '../store/actions/actions';
import * as CardReducer from '../store/reducers/card_reducer';
import Banner from "../components/Banners/banner"
import NavBar from "../components/Banners/navbar"
import CardButton from "../components/Card/cardbutton"
import Card from "../components/Card/card"


const ContextState = (props) => {
    let hostBanner = {
        left:"Host & attend small group themed conversations via Zoom on any topic. By & for college students.",
        buttonText: "HOST AN EVENT",
        link:"google.com",
    }
    let scroll = {
        scrollShadow: false
    }

    /* Posts Reducer */
    const [stateCardReducer, dispatchCardReducer] = useReducer(
        CardReducer.CardReducer,
        CardReducer.CardReducer
    );

    const toggleCard = posts => {
        dispatchCardReducer(ACTIONS.toggleCard());
    }
    const closeCard = posts => {
        dispatchCardReducer(ACTIONS.closeCard());
    }
    const openCard = posts => {
        dispatchCardReducer(ACTIONS.openCard());
    }

    return (
        <div>
          <Context.Provider
            value={{
              // Card Reducer
              cardState: stateCardReducer.posts,
            }}>
            <Banner {...hostBanner}/>
            <NavBar {...scroll}/>
            <CardButton function={() => setOpenCard(true)}/>

            <div className={(openCard ? 'block' : 'hidden')}>
                <Card function={() => setOpenCard(false)}/>
            </div>
            <props.Component {...props.pageProps}/>

          </Context.Provider>
        </div>
    )
}

export default ContextState;
/*  <div className={(openCard ? 'overflow-hidden fixed' : '')}>
                <Component {...pageProps}/>
            </div>*/
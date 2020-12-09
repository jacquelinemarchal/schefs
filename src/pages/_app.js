import '../styles/globals.css';
import NavBar from "../components/Banners/navbar";
import Banner from "../components/Banners/banner";
import CardButton from "../components/Card/cardbutton";
import Card from "../components/Card/card";
import GreyOut from "../components/Card/greyout";
import React, { useReducer } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export const StateContext = React.createContext();

const initialState = {
    isOpen: false,
}

const CardReducer = (state=initialState, action) => {
    switch (action) {
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

const App = ({ Component, pageProps }) => {
    let hostBanner = {
        left:"Host & attend small group themed conversations via Zoom on any topic. By & for college students.",
        buttonText: "HOST AN EVENT",
        link:"google.com",
    }
    let scroll = {
        scrollShadow: false
    }

    const [stateCardReducer, dispatch] = useReducer(CardReducer, initialState);

    return (
        <StateContext.Provider value = {{cardState: stateCardReducer, dispatch: dispatch}}>
            <div> 
                <Banner {...hostBanner}/>
                <NavBar {...scroll}/>
                <CardButton/>
                {stateCardReducer.isOpen}{
                    <p className="text-4xl">{stateCardReducer.isOpen}</p>
                }

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
            </div>
        </StateContext.Provider>
    );
};

export default App;

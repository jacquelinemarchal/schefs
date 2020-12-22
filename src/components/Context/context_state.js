import React, { useReducer } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

import * as ACTIONS from '../../store/actions/actions';
import * as CardReducer from '../../store/reducers/card_reducer';
import * as AuthReducer from '../../store/reducers/auth_reducer';
import Context from './context';
import NavBar from '../Banners/navbar';
import Banner from '../Banners/banner';
import Card from '../Card/card';
import CardButton from '../Card/cardbutton';

const ContextState = ({ Component, pageProps, bannerProps }) => {

    /* Auth Reducer */ 

    const [stateAuthReducer, dispatchAuthReducer] = useReducer(
        AuthReducer.AuthReducer,
        AuthReducer.initialState,
    );

    const handleSignup = signup_date => {
/*        axios
            .post('/api/users/register', register_data)
            .then(res => {
                dispatchAuthReducer(ACTIONS.registerSuccess());
                history.replace('/login');
            })
            .catch(err => dispatchAuthReducer(
                ACTIONS.authFailure(err.response.data)
            ));
*/
    }

    const handleLogin = login_data => {
/*        dispatchAuthReducer(ACTIONS.setLoading());
        axios
            .post('/api/users/login', login_data)
            .then(res => {
                // get JWT token
                const token = res.data.token;

                // decode token for profile data
                const profile = jwt_decode(token).profile;

                // update axios headers
                setAuthToken(token);

                // store token locally
                localStorage.setItem('id_token', token);

                // success dispatch
                dispatchAuthReducer(ACTIONS.loginSuccess(profile));
                history.replace('/');
            })
            .catch (err => dispatchAuthReducer(
                ACTIONS.authFailure(err.response.data)
            ));
*/
    }

    const handleLoginFromToken = (token, profile) => {
        setAuthToken(token);
        dispatchAuthReducer(ACTIONS.loginSuccess(profile));
    }

    const handleLogout = () => {
        // remove header from axios
        setAuthToken(null);

        // remove token from local storage
        localStorage.removeItem('id_token');

        // dispatch
        dispatchAuthReducer(ACTIONS.logout());
        history.replace('/login');
    }

    /* Card Reducer */

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

            profile: stateAuthReducer.profile,
          }}
        >
          <Banner {...bannerProps} />
          <NavBar scrollShadow={false} />
          <CardButton />
        
          <Card />

          <div className={(stateCardReducer.isOpen ? 'overflow-hidden fixed' : '')}>
            <Component {...pageProps}/>
          </div>
        </Context.Provider>
    );
};

export default ContextState;

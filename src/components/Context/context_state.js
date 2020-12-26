import React, { useEffect, useReducer } from 'react';
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
import firebase from '../../utils/firebase_client';

const setAuthHeader = (token) => {
    if (token)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    else
        delete axios.defaults.headers.common['Authorization'];
}

const ContextState = ({ Component, pageProps, bannerProps }) => {

    /* Auth Reducer */ 

    const [stateAuthReducer, dispatchAuthReducer] = useReducer(
        AuthReducer.AuthReducer,
        AuthReducer.initialState,
    );

    useEffect(() => {
        if (localStorage.id_token)
            setAuthHeader(localStorage.id_token);
    }, []);

    useEffect(() => {
        return firebase.auth().onIdTokenChanged(async (user) => {
            if (!user)
                dispatchAuthReducer(ACTIONS.logout());
            else {
                if (stateAuthReducer.profile && user.uid !== stateAuthReducer.profile.uid) {
                    const profile = (await axios.get('/api/users/' + uid)).data;
                    dispatchAuthReducer(ACTIONS.loginSuccess(profile));
                }

                const id_token = await user.getIdToken();
                setAuthHeader(id_token);
                localStorage.setItem('id_token', id_token);
            }
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(async () => {
            const user = firebase.auth().currentUser;
            if (user)
                await user.getIdToken(true);
        }, 10 * 60 * 1000);

        return () => clearInterval(timer);
    }, []);

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

    const handleLoginWithEmailAndPassword = async (email, password) => {
        const user = await firebase.auth().signInWithEmailAndPassword(email, password);
        const id_token = await firebase.auth().currentUser.getIdToken();
        setAuthHeader(id_token);
        
        const uid = firebase.auth().currentUser.uid;
        try {
            const profile = (await axios.get('/api/users/' + uid)).data;
            localStorage.setItem('id_token', id_token);
            dispatchAuthReducer(ACTIONS.loginSuccess(profile));
        } catch (err) {
            console.log(err.response.data.err);
            setAuthHeader(null);
            dispatchAuthReducer(ACTIONS.authFailure(err.response.data));
        }
    }

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem('id_token');
        dispatchAuthReducer(ACTIONS.logout());
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
            handleLoginWithEmailAndPassword,
            handleLogout,
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

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

const die = (err) => {
    console.log(err.response.data.err);
    setAuthHeader(null);
    dispatchAuthReducer(ACTIONS.authFailure(err.response.data));
}

const ContextState = ({ Component, pageProps, bannerProps }) => {

    /* Auth Reducer */ 

    const [stateAuthReducer, dispatchAuthReducer] = useReducer(
        AuthReducer.AuthReducer,
        AuthReducer.initialState,
    );

    useEffect(() => {
        return firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const uid = user.uid;
                const id_token = await user.getIdToken();
                setAuthHeader(id_token);

                try {
                    const profile = (await axios.get('/api/users/' + uid)).data;
                    dispatchAuthReducer(ACTIONS.loginSuccess(profile));
                } catch (err) {
                    die(err);
                }
            }
        });
    }, []);

    useEffect(() => {
        return firebase.auth().onIdTokenChanged(async (user) => {
            if (!user)
                dispatchAuthReducer(ACTIONS.logout());
            else {
                if (stateAuthReducer.profile && user.uid !== stateAuthReducer.profile.uid) {
                    try {
                        const profile = (await axios.get('/api/users/' + uid)).data;
                        dispatchAuthReducer(ACTIONS.loginSuccess(profile));
                    } catch (err) {
                        die(err);
                    }
                }

                const id_token = await user.getIdToken();
                setAuthHeader(id_token);
            }
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(async () => {
            const user = firebase.auth().currentUser;
            if (user) {
                const id_token = await user.getIdToken(true);
                setAuthHeader(id_token);
            }
        }, 10 * 60 * 1000);

        return () => clearInterval(timer);
    }, []);

    // missing img_profile right now
    const handleSignupWithEmailAndPassword = async (
        email,
        password,
        phone,
        first_name,
        last_name,
        bio,
        school,
        major,
        grad_year
    ) => {

        data = {
            email,
            password,
            phone,
            first_name,
            last_name,
            bio,
            school,
            major,
            grad_year,
        };

        try {
            await axios.post('/api/users/signup', data);
            await handleLoginWithEmailAndPassword(email, password);
        } catch (err) {
            die(err);
        }
    }

    const handleLoginWithEmailAndPassword = async (email, password) => {
        const user_creds = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = user_creds.user;

        const uid = user.uid;
        const id_token = await user.getIdToken();
        setAuthHeader(id_token);
        
        try {
            const profile = (await axios.get('/api/users/' + uid)).data;
            dispatchAuthReducer(ACTIONS.loginSuccess(profile));
        } catch (err) {
            die(err);
        }
    }

    const handleLogout = () => {
        setAuthToken(null);
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
            handleSignupWithEmailAndPassword,
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

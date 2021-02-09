import React, { useEffect, useReducer } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

import * as ACTIONS from '../../store/actions/actions';
import * as CardReducer from '../../store/reducers/card_reducer';
import * as AuthReducer from '../../store/reducers/auth_reducer';
import * as EventsReducer from '../../store/reducers/events_reducer';
import Context from './context';
import NavBar from '../Banners/navbar';
import Banner from '../Banners/banner';
import Card from '../Card/card';
import CardButton from '../Card/cardbutton';
import GreyOut from '../Card/greyout';
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

    const die = (err) => {
        console.log(err.response.data.err);
        setAuthHeader(null);
        dispatchAuthReducer(ACTIONS.authFailure(err.response.data));
    }

    useEffect(() => {
        return firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const fb_uid = user.uid;
                const id_token = await user.getIdToken();
                setAuthHeader(id_token);

                try {
                    const profile = (await axios.get('/api/users/login/' + fb_uid)).data;
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
                    const fb_uid = user.uid;
                    try {
                        const profile = (await axios.get('/api/users/login/' + fb_uid)).data;
                        dispatchAuthReducer(ACTIONS.loginSuccess(profile));
                    } catch (err) {
                        console.log(err);
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

    // TODO: missing img_profile right now
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

        const fb_uid = user.uid;
        const id_token = await user.getIdToken();
        setAuthHeader(id_token);
        
        try {
            const profile = (await axios.get('/api/users/login/' + fb_uid)).data;
            dispatchAuthReducer(ACTIONS.loginSuccess(profile));
        } catch (err) {
            die(err);
        }
    }

    const handleLoginWithGoogle = async () => {
        const res = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
        alert(JSON.stringify({
            cred: res.credential,
            user: res.user,
        }));
    }

    const handleLogout = async () => {
        await firebase.auth().signOut();
        setAuthHeader(null);
        handleSetREvents(null);
        handleSetMyEvents(null);
        dispatchAuthReducer(ACTIONS.logout());
    }

    const handleUpdateProfile = async (uid, updated_fields) => {
	try {
        await axios.put('/api/users/' + uid, updated_fields);
	    const profile = (await axios.get('/api/users/' + uid)).data;
        profile = {...profile, isVerified: firebase.auth().currentUser.emailVerified}
	    dispatchAuthReducer(ACTIONS.updateProfile(profile));
	} catch (err) {
	    die(err);
	}
    }

    /* Card Reducer */

    const [stateRCardReducer, dispatchRCardReducer] = useReducer(
        CardReducer.CardReducer,
        CardReducer.initialState,
    );

    const [stateLCardReducer, dispatchLCardReducer] = useReducer(
        CardReducer.CardReducer,
        CardReducer.initialState,
    );
    
    const handleOpenCard = (left, right) => {
        if (right)
            dispatchRCardReducer(ACTIONS.openCard());
        if (left)
            dispatchLCardReducer(ACTIONS.openCard());
    }

    const handleCloseCard = (left, right) => {
        if (right)
            dispatchRCardReducer(ACTIONS.closeCard());
        if (left)
            dispatchLCardReducer(ACTIONS.closeCard());
    }

    const handleToggleCard = (left, right) => {
        if (right)
            dispatchRCardReducer(ACTIONS.toggleCard());
        if (left)
            dispatchLCardReducer(ACTIONS.toggleCard());
    }

    const handleSetREvents = (events) => dispatchRCardReducer(ACTIONS.setEvents(events));
    const handleSetLEvents = (events) => dispatchLCardReducer(ACTIONS.setEvents(events));
    const handleSetMyEvents = (events) => dispatchRCardReducer(ACTIONS.setMyEvents(events));

    /* EVENTS REDUCER */

    const [stateEventsReducer, dispatchEventsReducer] = useReducer(
        EventsReducer.EventsReducer,
        EventsReducer.initialState,
    );

    const setHomeEvents = (events) => {
        dispatchEventsReducer(ACTIONS.setHomeEvents(events));
    }

    return (
        <Context.Provider
          value={{
            rCardIsOpen: stateRCardReducer.isOpen,
            lCardIsOpen: stateLCardReducer.isOpen,
            handleOpenCard,
            handleCloseCard,
            handleToggleCard,

            rEvents: stateRCardReducer.events,
            lEvents: stateLCardReducer.events,
            myEvents: stateRCardReducer.myEvents,
            handleSetREvents,
            handleSetLEvents,
            handleSetMyEvents,

            profile: stateAuthReducer.profile,
            handleSignupWithEmailAndPassword,
            handleLoginWithEmailAndPassword,
            handleLogout,
            handleLoginWithGoogle,
            handleUpdateProfile,

            events: stateEventsReducer.events,
            setHomeEvents,
          }}
        >
          <Banner {...bannerProps} />
          <NavBar scrollShadow={false} />
          <CardButton />        
          <Card right={true} />
          <Card right={false} profile={{"uid":5,"email":"cyw2124@columbia.edu","phone":null,"first_name":"Christopher","last_name":"Wang","img_profile":null,"bio":null,"school":"Columbia University","major":"Math","grad_year":2022,"fb_uid":"bOBANGm9UzPWeZMymLQkqWScSbm1"}}/>
          <GreyOut />

          <div className={(stateRCardReducer.isOpen ? 'overflow-hidden fixed w-full' : '')}>
            <Component {...pageProps}/>
          </div>
        </Context.Provider>
    );
};

export default ContextState;

import '../styles/globals.css';
import React from 'react';
import ContextState from '../components/Context/context_state';

const hostBanner = {
    left: "Host & attend small group themed conversations via Zoom on any topic. By & for college students.",
    buttonText: "HOST AN EVENT",
    link: "google.com",
}

const App = ({ Component, pageProps }) => {
    return (
        <ContextState Component={Component} pageProps={pageProps} bannerProps={hostBanner} />
    );
};

export default App;

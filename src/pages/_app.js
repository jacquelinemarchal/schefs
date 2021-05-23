import '../styles/globals.css';
import '../styles/transitions.css';

import React from 'react';
import ContextState from '../components/Context/context_state';
import Head from 'next/head'

const hostBanner = {
    left: "Lead & join intimate, themed conversations via Zoom on topics you care about. By & for college students.",
    left_small: "Lead & join intimate, themed conversations",
    buttonText: "HOST AN EVENT",
    link: "google.com",
}

const App = ({ Component, pageProps }) => {
    return (
        <>
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <ContextState Component={Component} pageProps={pageProps} bannerProps={hostBanner} />
        </>
    );
};

export default App;

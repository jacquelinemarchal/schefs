import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import pool from '../utils/db';
import queries from "../utils/queries/events"

import Head from 'next/head';
import Footer from '../components/Banners/footer';
import EventGrid from '../components/Events/eventgrid';
import NavBar from '../components/Banners/navbar';
import WhitePillButton from '../components/Buttons/wpillbutton.js'

const SocialFestival = ({ closeCardF, socialEvents }) => {
    const ambassador = {
        left:  "We’re looking for engaged students to spread the word",
        right: "Learn about becoming a Schefs Ambassador ",
        linkText:" here"
    }

    return (
        <>
            <Head>
                <title>Schefs - Social Festival</title>
            </Head>
            {socialEvents ? 
                <EventGrid
                    isEditable={false}
                    events={socialEvents}
                    style="px-2"
                    gridNum="3"
                    margin="px-6 md:px-12 xl:px-24"
                    closeCardF={closeCardF}
                    showAttendees={false}
                />
            : null}

          <Footer {...ambassador} />
        </>
    );
};

export default SocialFestival;

export async function getStaticProps() {
    try {
        let values = [
            '2021-01-04',
            '2021-01-11',
            'approved',
        ]
        const socialEvents = (await pool.query(queries.getEventsSummary, values)).rows
            .map((event) => ({...event, time_start: event.time_start.toISOString()}))

        return {
            props: {
                socialEvents,
            },
        };
    } catch (err) {
        console.log(err);
        return {
            notFound: true,
        };
    }
}
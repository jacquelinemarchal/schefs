import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import pool from '../utils/db';
import queries from "../utils/queries/events"

import Head from 'next/head';
import Footer from '../components/Banners/footer';
import EventGrid from '../components/Events/eventgrid';
import NavBar from '../components/Banners/navbar';
import WhitePillButton from '../components/Buttons/wpillbutton.js'

const SocialFestival = ({ closeCardF, multiEvents }) => {
    console.log(multiEvents)
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
            {multiEvents ? 
                <EventGrid
                    isEditable={false}
                    events={multiEvents}
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
            '2020-08-17',
            '2020-08-23',
            'approved',
        ]
        const multiEvents = (await pool.query(queries.getEventsSummary, values)).rows
            .map((event) => ({...event, time_start: event.time_start.toISOString()}))

        return {
            props: {
                multiEvents,
            },
        };
    } catch (err) {
        console.log(err);
        return {
            notFound: true,
        };
    }
}
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import pool from '../utils/db';
import queries from "../utils/queries/events"

import Head from 'next/head';
import Footer from '../components/Banners/footer';
import EventGrid from '../components/Events/eventgrid';
import NavBar from '../components/Banners/navbar';
import WhitePillButton from '../components/Buttons/wpillbutton';
import socialLogo from '../assets/socialLogo.png';

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

          <div className="px-6 md:px-12 xl:px-24">
            <div className="flex flex-row justify-between mb-16">
              <div className="pl-2">
                <img className="h-20 w-auto mb-6 -mx-2" src={socialLogo} altText="Social Logo" />
                <p className="text-xl leading-tight">
                  The second Schefs festival.<br />
                  A week of discussions.<br />
                  By &amp; for college students worldwide.
                </p>
              </div>

              <div className="pr-20 w-1/4 text-xl">
                <div className="flex flex-row justify-between">
                  <a href="#distancing">
                    : Distancing
                  </a>
                  <p>Jan 04</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#networks">
                    : Networks
                  </a>
                  <p>Jan 05</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#justice">
                    : Justice
                  </a>
                  <p>Jan 06</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#circles">
                    : Circles 
                  </a>
                  <p>Jan 07</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#isms">
                    : -isms
                  </a>
                  <p>Jan 08</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#constructs">
                    : Constructs
                  </a>
                  <p>Jan 09</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#responsibility">
                    : Responsibility 
                  </a>
                  <p>Jan 10</p>
                </div>
              </div>
            </div>
  
            {socialEvents
              ? <>
                  <div className="mb-16 relative">
                    <a name="distancing" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Monday, January 4th</p>
                    <p className="text-4xl px-2 mb-8">SOCIAL: Distancing</p>
                    <EventGrid
                      isEditable={false}
                      events={socialEvents.filter((e) => (e.time_start >= '2021-01-04' && e.time_start < '2021-01-05'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="networks" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Tuesday, January 5th</p>
                    <p className="text-4xl px-2 mb-8">SOCIAL: Networks</p>
                    <EventGrid
                      isEditable={false}
                      events={socialEvents.filter((e) => (e.time_start >= '2021-01-05' && e.time_start < '2021-01-06'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="justice" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Wednesday, January 6th</p>
                    <p className="text-4xl px-2 mb-8">SOCIAL: Networks</p>
                    <EventGrid
                      isEditable={false}
                      events={socialEvents.filter((e) => (e.time_start >= '2021-01-06' && e.time_start < '2021-01-07'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="circles" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Thursday, January 7th</p>
                    <p className="text-4xl px-2 mb-8">SOCIAL: Circles</p>
                    <EventGrid
                      isEditable={false}
                      events={socialEvents.filter((e) => (e.time_start >= '2021-01-07' && e.time_start < '2021-01-08'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="isms" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Friday, January 8th</p>
                    <p className="text-4xl px-2 mb-8">SOCIAL: -isms</p>
                    <EventGrid
                      isEditable={false}
                      events={socialEvents.filter((e) => (e.time_start >= '2021-01-08' && e.time_start < '2021-01-09'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="constructs" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Saturday, January 9th</p>
                    <p className="text-4xl px-2 mb-8">SOCIAL: Constructs</p>
                    <EventGrid
                      isEditable={false}
                      events={socialEvents.filter((e) => (e.time_start >= '2021-01-10' && e.time_start < '2021-01-11'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="responsibility" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Sunday, January 10th</p>
                    <p className="text-4xl px-2 mb-8">SOCIAL: Responsibility</p>
                    <EventGrid
                      isEditable={false}
                      events={socialEvents.filter((e) => (e.time_start >= '2021-01-11' && e.time_start < '2021-01-12'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                </>
              : null
            }
          </div>

          <Footer {...ambassador} />
        </>
    );
};

export default SocialFestival;

export const getStaticProps = async () => {
    try {
        // festival dates
        const values = [
            '2021-01-04',
            '2021-01-11',
            'approved',
        ];

        const socialEvents = (await pool.query(queries.getEventsSummary, values)).rows.map(
            (event) => ({...event, time_start: event.time_start.toISOString()})
        );

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

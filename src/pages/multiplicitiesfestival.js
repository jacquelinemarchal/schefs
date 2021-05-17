import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import pool from '../utils/db';
import queries from "../utils/queries/events"

import Head from 'next/head';
import Footer from '../components/Banners/footer';
import EventGrid from '../components/Events/eventgrid';
import NavBar from '../components/Banners/navbar';
import WhitePillButton from '../components/Buttons/wpillbutton.js'
import multiplicitiesLogo from '../assets/multiplicitiesLogo.png';

const MultiplicitiesFestival = ({ closeCardF, multiplicitiesEvents }) => {
    const ambassador = {
        left:  "We’re looking for engaged students to spread the word",
        right: "Learn about becoming a Schefs Ambassador ",
        linkText:" here"
    }

    return (
        <>
          <Head>
            <title>Schefs - Multiplicities Festival</title>
          </Head>

          <div className="px-6 md:px-12 xl:px-24">
            <div className="flex flex-row justify-between mb-16">
              <div className="pl-2">
                <img className="h-20 w-auto mb-6 -mx-2" src={multiplicitiesLogo} altText="Multiplicities Logo" />
                <p className="text-xl leading-tight">
                  The first Schefs festival.<br />
                  A week of discussions.<br />
                  By &amp; for college students worldwide.
                </p>
              </div>

              <div className="pr-20 w-1/4 text-xl">
                <div className="flex flex-row justify-between">
                  <a href="#eroticisms">
                    Eroticisms
                  </a>
                  <p>Aug 17</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#digitalcitizens">
                    Digital Citizens
                  </a>
                  <p>Aug 18</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#spacesplaces">
                    Spaces &amp; Places
                  </a>
                  <p>Aug 19</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#pandemicsociety">
                    Pandemic Society
                  </a>
                  <p>Aug 20</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#art">
                    Art: The Performative Self
                  </a>
                  <p>Aug 21</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#autonomies">
                    Autonomies
                  </a>
                  <p>Aug 22</p>
                </div>
                <div className="flex flex-row justify-between">
                  <a href="#anthropocene">
                    The Anthropocene
                  </a>
                  <p>Aug 23</p>
                </div>
              </div>
            </div>

            {multiplicitiesEvents
              ? <>
                  <div className="mb-16 relative">
                    <a name="eroticisms" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Monday, August 17th</p>
                    <p className="text-4xl px-2 mb-8">Eroticisms</p>
                    <EventGrid
                      isEditable={false}
                      events={multiplicitiesEvents.filter((e) => (e.time_start >= '2020-08-17' && e.time_start < '2020-08-18'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="digitalcitizens" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Tuesday, August 18th</p>
                    <p className="text-4xl px-2 mb-8">Digital Citizens</p>
                    <EventGrid
                      isEditable={false}
                      events={multiplicitiesEvents.filter((e) => (e.time_start >= '2020-08-18' && e.time_start < '2020-08-19'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="spacesplaces" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Wednesday, August 19th</p>
                    <p className="text-4xl px-2 mb-8">Spaces &amp; Places</p>
                    <EventGrid
                      isEditable={false}
                      events={multiplicitiesEvents.filter((e) => (e.time_start >= '2020-08-19' && e.time_start < '2020-08-20'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="pandemicsociety" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Thursday, August 20th</p>
                    <p className="text-4xl px-2 mb-8">Pandemic Society</p>
                    <EventGrid
                      isEditable={false}
                      events={multiplicitiesEvents.filter((e) => (e.time_start >= '2020-08-20' && e.time_start < '2020-08-21'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="art" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Friday, August 21st</p>
                    <p className="text-4xl px-2 mb-8">Art: The Performative Self</p>
                    <EventGrid
                      isEditable={false}
                      events={multiplicitiesEvents.filter((e) => (e.time_start >= '2020-08-21' && e.time_start < '2020-08-22'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="autonomies" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Saturday, August 22nd</p>
                    <p className="text-4xl px-2 mb-8">Autonomies</p>
                    <EventGrid
                      isEditable={false}
                      events={multiplicitiesEvents.filter((e) => (e.time_start >= '2020-08-22' && e.time_start < '2020-08-23'))}
                      style="px-2"
                      gridNum="3"
                      closeCardF={closeCardF}
                      showAttendees={false}
                    />
                  </div>
                  <div className="mb-16 relative">
                    <a name="anthropocene" className="absolute" style={{top: '-8rem'}}></a>
                    <p className="text-xl leading-tight px-2">Sunday, August 23rd</p>
                    <p className="text-4xl px-2 mb-8">The Anthropocene</p>
                    <EventGrid
                      isEditable={false}
                      events={multiplicitiesEvents.filter((e) => (e.time_start >= '2020-08-23' && e.time_start < '2020-08-24'))}
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

export default MultiplicitiesFestival;

export const getStaticProps = async () => {
    try {
        const values = [
            '2020-08-17',
            '2020-08-23',
            'approved',
        ]
        const multiplicitiesEvents = (await pool.query(queries.getEventsSummary, values)).rows.map(
            (event) => ({...event, time_start: event.time_start.toISOString()})
        );

        return {
            props: {
                multiplicitiesEvents,
            },
        };
    } catch (err) {
        console.log(err);
        return {
            notFound: true,
        };
    }
}

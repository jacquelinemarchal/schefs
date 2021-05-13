import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Head from 'next/head';
import WhitePillButton from '../components/Buttons/wpillbutton';
import EventGrid from '../components/Events/eventgrid';
import EventThumbnail from '../components/Events/eventthumbnail';
import Context from '../components/Context/context';

import pool from '../utils/db';
import queries from '../utils/queries/events';

const PostEventSubmit = (props) => {
    const context = useContext(Context);
    const [futureEvents, setFutureEvents] = useState(null);

    useEffect(async () => {
        const now = (new Date()).toISOString();

        if (!context.events) {
            const date_to = new Date();
            date_to.setDate(date_to.getDate() + 17);

            const query = {
                params: {
                    date_to: date_to,
                    status: 'approved',
                }
            };

            try {
                const events = (await axios.get('/api/events', query)).data;
                context.setHomeEvents(events);
                setFutureEvents(events.filter((e) => e.time_start > now));
            } catch (err) {
                if (err.response && err.response.data && err.response.data.err)
                    console.log(err.response.data.err)
                else
                    console.log(err);
            }
        }

        if (context.events)
            setFutureEvents(context.events.filter((e) => e.time_start > now));
    }, [context.events]);

    return (
        <>
          <Head>
            <title>Schefs - Thank you for submitting!</title>
          </Head>

          <div className="px-2 mx-6 md:mx-12 xl:mx-24 mt-8 sm:grid sm:grid-cols-2 gap-6">
            <div className="">
              <h1 className="text-5xl leading-tight w-1/2 mb-6">Thank you for submitting your event!</h1>
              <p className="text-xl leading-tight w-3/4">
                Check your email for a confirmation.<br/><br/>
                Our team will review your event within 24 hours before publishing it to the site if approved.<br/><br/>
                Your event will display as &lsquo;pending&rsquo; in your upcoming events section on your card
                and in &ldquo;my events.&rdquo;<br/><br/>
                In the meanwhile, why not sign up for other events?
              </p>
            </div>
            <div className="sm:grid sm:col-span-1">
              <div className="w-3/5" style={{opacity: '35%'}}>
                <p className="text-base">Pending approval</p>
                <EventThumbnail
                  {...props.eventInfo}
                  border={true}
                  showAttendees={false}
                  isEditable={false}
                  disabled={true}
                />
              </div>
              <div className="w-full flex flex-row">
                <a>
                    <WhitePillButton link="/eventbuilder" text="SUBMIT ANOTHER EVENT" padding="px-6 mr-2"/>
                </a>
                <a target="_blank" href="https://www.instagram.com/schefs.us/" rel="noopener noreferrer">
                  <WhitePillButton text="FOLLOW SCHEFS" padding="px-6"/>
                </a>
              </div>
            </div>
          </div>

          {futureEvents
            ? <>
                <p className="text-3xl mb-6 mt-24 pl-2 ml-6 md:ml-12 xl:ml-24">Upcoming Events</p>
                
                <EventGrid
                  isEditable={false}
                  events={futureEvents}
                  style="px-2"
                  gridNum="3"
                  margin="px-6 md:px-12 xl:px-24"
                  showAttendees={false}
                />
              </>
            : null
          }
        </>
    );
}

export default PostEventSubmit;

export const getServerSideProps = async (context) => {
    try {
        const eventInfo = (await pool.query(queries.getEvent, [ context.query.eid ])).rows[0].event;
        return {
            props: {
                eventInfo,
            },
        };
    } catch (err) {
        console.log(err);
        return {
            redirect: {
                destination: '/index',
                permanent: false
            }
        };
    }
}

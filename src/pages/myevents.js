import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Head from 'next/head';
import Footer from '../components/Banners/footer';
import EventGrid from '../components/Events/eventgrid';
import NavBar from '../components/Banners/navbar';
import Context from '../components/Context/context';

const MyEvents = (props) => {
    const context = useContext(Context);
    const [futureEvents, setFutureEvents] = useState(null); // [[eid, host_name, host_school, time_start, title]]
    const [pastEvents, setPastEvents] = useState(null);

    // TODO: make this more efficient - get detailed users events
    useEffect(async () => {
        const now = (new Date()).toISOString();

        if (context.profile && !context.rEvents) {
            try {
                const res = await axios.get(`/api/users/${context.profile.uid}/events/live`);
                const events = res.data.map((e) => {
                    if (context.profile.uid === e.host_id)
                        e.border = true;
                    return e;
                });

                context.handleSetREvents(events);
            } catch (err) {
                if (err.response && err.response.data && err.response.data.err)
                    console.log(err.response.data.err);
                else
                    console.log(err);
            }
        }

        if (context.profile && !context.myEvents) {
            try {
                const res = await axios.get(`/api/users/${context.profile.uid}/events/past`);
                const events = res.data.map((e) => {
                    if (context.profile.uid === e.hosts[0].uid)
                        e.border = true;
                    return e;
                });

                context.handleSetMyEvents(events);
            } catch (err) {
                if (err.response && err.response.data && err.response.data.err)
                    console.log(err.response.data.err);
                else
                    console.log(err);
            }
        }
        
        if (context.events && context.rEvents && context.myEvents) {
            setFutureEvents(context.rEvents.filter((e) => e.time_start > now));
            setPastEvents(context.myEvents);
        }

    }, [context.rEvents, context.myEvents, context.profile]);

    const ambassador = {
        left:  "We’re looking for engaged students to spread the word",
        right: "Learn about becoming a Schefs Ambassador ",
        linkText:" here"
    }

    return (
        <>
          <Head>
              <title>Schefs - My Events</title>
          </Head>
          {futureEvents && pastEvents
            ? <>
                <EventGrid
                  isEditable={false}
                  events={futureEvents}
                  style="px-2"
                  gridNum="3"
                  margin="px-6 md:px-12 xl:px-24"
                  closeCardF={props.closeCardF}
                  showAttendees={false}
                />

                <p className="text-3xl mt-8 mb-16 ml-6 md:ml-12 xl:ml-24 pl-2">Past Events</p>

                <EventGrid
                  isEditable={false}
                  events={pastEvents}
                  style="px-2"
                  gridNum="3"
                  margin="px-6 md:px-12 xl:px-24"
                  closeCardF={props.closeCardF}
                  showAttendees={true}
                />
              </>
            : null
          }
          <Footer {...ambassador} />
        </>
    );
};

export default MyEvents;

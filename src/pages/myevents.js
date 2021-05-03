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

    useEffect(async () => {
        const now = (new Date()).toISOString();

        if (!context.events) {
            const date_to = new Date();
            date_to.setDate(date_to.getDate() + 17);

            const query = {
                params: {
                    date_to: date_to,
                    status: 'approved',
                    type: 'detailed',
                }
            }

            try {
                const events = (await axios.get('/api/events', query)).data;
                context.setHomeEvents(events);

                setFutureEvents(events.filter((e) => e.time_start > now));
                setPastEvents(events.filter((e) => e.time_start <= now));
            } catch (err) {
                if (err.response && err.response.data && err.response.data.err)
                    console.log(err.response.data.err);
                else
                    console.log(err);
            }
        }
        
        if (context.events) {
            setFutureEvents(context.events.filter((e) => e.time_start > now));
            setPastEvents(context.events.filter((e) => e.time_start <= now));
        }

    }, [context.events]);

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
                  margin="px-6"
                  closeCardF={props.closeCardF}
                  showAttendees={false}
                />

                <p className="text-3xl mt-8 mb-16 ml-6 pl-2">Past Events</p>

                <EventGrid
                  isEditable={false}
                  events={pastEvents}
                  style="px-2"
                  gridNum="3"
                  margin="px-6"
                  closeCardF={props.closeCardF}
                  showAttendees={false}
                />
              </>
            : null
          }
          <Footer {...ambassador} />
        </>
    );
};

export default MyEvents;

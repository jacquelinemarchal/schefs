import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Head from 'next/head';
import Link from 'next/link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Footer from '../components/Banners/footer';
import EventGrid from '../components/Events/eventgrid';
import NavBar from '../components/Banners/navbar';
import WhitePillButton from '../components/Buttons/wpillbutton';
import Context from '../components/Context/context';

const MyEvents = ({ closeCardF }) => {
    const context = useContext(Context);

    const [isBottom, setIsBottom] = useState(false);
    const [displayLength, setDisplayLength] = useState(15);
    const [futureEvents, setFutureEvents] = useState(null); // [[eid, host_name, host_school, time_start, title]]
    const [pastEvents, setPastEvents] = useState(null);

    useEffect(async () => {
        const now = (new Date()).toISOString();

        if (context.profile && !context.myEvents) {
            let events = [];

            try {
                const res = await axios.get(`/api/users/${context.profile.uid}/events/past`);
                const past_events = res.data.map((e) => {
                    if (context.profile.uid === e.hosts[0].uid)
                        e.border = true;
                    return e;
                });

                events = events.concat(past_events);
            } catch (err) {
                if (err.response && err.response.data && err.response.data.err)
                    console.log(err.response.data.err);
                else
                    console.log(err);
            }

            try {
                const res = await axios.get(`/api/users/${context.profile.uid}/events/upcoming`);
                const future_events = res.data.map((e) => {
                    if (context.profile.uid === e.host_id)
                        e.border = true;
                    if (e.status !== 'approved') {
                        e.opacity = '35%';
                        e.disabled = true;
                    }

                    return e;
                });

                events = events.concat(future_events);
            } catch (err) {
                if (err.response && err.response.data && err.response.data.err)
                    console.log(err.response.data.err);
                else
                    console.log(err);
            }

            context.handleSetMyEvents(events);
        }
        
        if (context.myEvents) {
            setFutureEvents(context.myEvents.filter((e) => e.time_start > now).slice(0, displayLength));
            setPastEvents(context.myEvents.filter((e) => e.time_start <= now).slice(0, displayLength));
        }
    }, [context.myEvents, context.profile, displayLength]);

    useEffect(() => {
        window.addEventListener('scroll', handleScrollToBottom, {passive: true});
        return () => window.removeEventListener('scroll', handleScrollToBottom);
    }, []);

    useEffect(() => {
        console.log(isBottom);
        if (isBottom && context.events && displayLength < context.events.length)
            setDisplayLength(displayLength + 15);
    }, [isBottom]);

    const handleScrollToBottom = () => {
        const scrollTop = (document.documentElement
            && document.documentElement.scrollTop)
            || document.body.scrollTop;

        const scrollHeight = (document.documentElement
            && document.documentElement.scrollHeight)
            || document.body.scrollHeight;

        if (scrollTop + window.innerHeight + 50 >= scrollHeight)
            setTimeout(() => setIsBottom(true), 200);
        else
            setIsBottom(false);
    }

    const ambassador = {
        left:  "We’re looking for engaged students to spread the word",
        right: "Learn about becoming a Schefs Ambassador ",
        linkText: " here"
    }

    return (
        <>
          <Head>
            <title>Schefs - My Events</title>
          </Head>
         
          {context.profile && context.profile.isVerified
            ? futureEvents && pastEvents
                ? futureEvents.length || pastEvents.length
                    ? <>
                        {futureEvents.length
                          ? <>
                              <EventGrid
                                isEditable={false}
                                events={futureEvents}
                                style="px-2"
                                gridNum="3"
                                margin="px-6 md:px-12 xl:px-24"
                                closeCardF={closeCardF}
                                showAttendees={false}
                              />
                            </>
                          : null
                        }
          
                        {pastEvents.length
                          ? <>
                              <p className="text-3xl mt-4 mb-6 ml-6 md:ml-12 xl:ml-24 pl-2">Past Events</p>
              
                              <EventGrid
                                isEditable={false}
                                events={pastEvents}
                                style="px-2"
                                gridNum="3"
                                margin="px-6 md:px-12 xl:px-24"
                                closeCardF={closeCardF}
                                showAttendees={true}
                              />
                            </>
                          : null
                        }
                      </>
                    : <p className="pl-2 ml-6 md:ml-12 xl:ml-24">
                        You haven't attended any events yet... so go start reserving tickets already!<br />
                        <Link href="/index"><a className="underline">Browse upcoming events</a></Link>
                      </p>
                : <div className="items-center flex flex-col mt-12">
                    <CircularProgress thickness={3} />
                  </div>
            : context.profile && !context.profile.isVerified
                ? <div className="text-center items-center flex flex-col mt-12">
                    You must verify your Schefs account to make events
                    <WhitePillButton handleClick={() => context.handleToggleCard(false, true)} text="VERIFY ACCOUNT" padding="flex px-16 mt-4" />
                  </div>
                : <div className="text-center items-center flex flex-col mt-12">
                    You must have a Schefs account to make events
                    <WhitePillButton handleClick={() => context.handleToggleCard(false, true)} text="SIGN UP" padding="flex px-16 mt-4" />
                  </div>
          }

          <Footer {...ambassador} />
        </>
    );
};

export default MyEvents;

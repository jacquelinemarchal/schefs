import Footer from "../components/Banners/footer"
import EventGrid from "../components/Events/eventgrid"
import NavBar from "../components/Banners/navbar";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios"
import Context from '../components/Context/context';
import Head from 'next/head';
export default function Home(props) {
    const context = useContext(Context);
    const [allEvents, setAllEvents]  = useState(null); // [[eid, host_name, host_school, time_start, title]]

    useEffect(async () => {
        if (!context.events) {
            const date_to = new Date();
            date_to.setDate(date_to.getDate() + 17);

            const query = {
                params: {
                    date_from: '2018-01-01',
                    date_to: date_to,
                    status: 'approved',
                    type: 'detailed',
                }
            }

            try {
                const events = (await axios.get("/api/events", query)).data;
                context.setHomeEvents(events);
                setAllEvents(events);
            } catch (err) {
                if (err.response && err.response.data && err.response.data.err)
                    console.log(err.response.data.err)
                else
                    console.log(err);
            }
        }
        
        if (context.events)
            setAllEvents(context.events);

    }, [context.events, allEvents]);

    const ambassador = {
        left:  "We’re looking for engaged students to spread the word",
        right: "Learn about becoming a Schefs Ambassador ",
        linkText:" here"
    }

    return (
        <>
        <Head>
            <title>Schefs - Learn From Each Other</title>
        </Head>
            {allEvents
              ? <EventGrid
                  isEditable={false}
                  events={allEvents}
                  style="px-2"
                  gridNum="3 mx-6"
                  closeCardF={props.closeCardF}
                  showAttendees={true}
                /> 
              : null
            }
            <Footer {...ambassador} />
        </>
    );
};

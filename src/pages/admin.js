// Approval Portal
import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useEffect, useContext } from "react";
import axios from "axios"
import EventGrid from "../components/Events/eventgrid"
import NavBar from "../components/Banners/navbar";
import Context from '../components/Context/context';

// use https://www.npmjs.com/package/react-scrollable-list if issues with larger lists

export default function ApprovalPortal() {

    const [pendingEvents, setPendingEvents]  = useState(null); // [[eid, host_name, host_school, time_start, title]]

    useEffect(async () => {

        const query = {
            params: {
                date_from: '2020-12-31',
                date_to: '2021-01-31',
                status: 'pending',
                type: 'summary',
            }
        }

        try {
            const events = (await axios.get("/api/events", query)).data;
            setPendingEvents(events);
        } catch (err) {
            console.log(err.response.data.err);
        }      
    },[]);

    return (
        <>{pendingEvents && pendingEvents.length ? <EventGrid events={pendingEvents} style="px-2" gridNum="3 mx-6" closeCardF={()=>{console.log("close card")}}/> : <> <div>No Events</div> </>}
        </>
    );
};


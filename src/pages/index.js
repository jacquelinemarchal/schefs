import Footer from "../components/Banners/footer"
import EventGrid from "../components/Events/eventgrid"
import NavBar from "../components/Banners/navbar";
import React, { useState, useEffect } from "react";
import axios from "axios"

export default function Home(props) {

    const [allEvents, setAllEvents]  = useState([]); // [[eid, host_name, host_school, time_start, title]]

    useEffect(async () => {
        const query = {
            params: {
                date_from:"2020-01-01",
                date_to:"2021-12-31",
                status:"all",
                type:"summary"
            }
        }

        axios
            .get("/api/events", query)
            .then((res) =>  setAllEvents([...res.data]))
            .catch((err) => alert(err));
    }, []);

    const ambassador = {
        left:"We’re looking for engaged students to spread the word",
        right:"Learn about becoming a Schefs Ambassador ",
        linkText:"here"
      }

    return (
        <>
            {allEvents.length ?  <EventGrid events={allEvents} style="px-2" gridNum="3 mx-6" closeCardF={props.closeCardF} /> : null}
            <Footer {...ambassador} />
        </>
  );
};

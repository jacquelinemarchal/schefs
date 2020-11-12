import Footer from "../components/Banners/footer"
import EventGrid from "../components/Events/eventgrid"
import NavBar from "../components/Banners/navbar";
import React, { useState, useEffect } from "react";
import axios from "axios"
import Card from "../components/Card/card"

export default function Home() {

    const [allEvents, setAllEvents]  = useState([]); // [[eid, host_name, host_school, time_start, title]]

    useEffect(async () => {
        getEvents()
        return()=>console.log("cleanup function here")
    }, [])

    const getEvents = () => {
        let query = {
             params:{
                  date_from:"2020-01-01",
                  date_to:"2020-12-31",
                  status:"all",
                  type:"summary"
            }
        }
        axios.get("http://localhost:5000/api/events", query)
        .then((res)=>{
            setAllEvents([...res.data])
        })
        .catch((err)=>{alert(err)})
    }

    let ambassador = {
        left:"We’re looking for engaged students to spread the word",
        right:"Learn about becoming a Schefs Ambassador ",
        linkText:"here"
      }

  return (
    <>
        <div>
            <EventGrid {...allEvents}/>
            <Footer {...ambassador} />
        </div>
    </>
  );
};

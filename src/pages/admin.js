// Approval Portal
import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useEffect, useContext, useRef} from "react";
import axios from "axios"
import upload from "../assets/upload-long.png"
import EventGrid from "../components/Events/eventgrid"
import NavBar from "../components/Banners/navbar";
import Context from '../components/Context/context';
import CountUp from 'react-countup';
import Head from 'next/head';
import moment from 'moment';
const admin = require('../utils/firebase_admin');

// use https://www.npmjs.com/package/react-scrollable-list if issues with larger lists

export default function ApprovalPortal() {
    const context = useContext(Context);
    const [pendingEvents, setPendingEvents]  = useState(null); // [[eid, host_name, host_school, time_start, title]]
    const fileInput = useRef(null);
    const [ticketsNum, setTicketsNum] = useState(0);
    const [usersNum, setUsersNum] = useState(0);
    const [eventsNum, setEventsNum] = useState(0);

    const [dayTicketsNum, setDayTicketsNum] = useState(0);
    const [dayEventsNum, setDayEventsNum] = useState(0);
    const [dayUsersNum, setDayUsersNum] = useState(0);

    useEffect(async () => {
            var start_date = moment();
            var end_date = moment().add(1, 'days');
            const dayTicketQuery = {
                params: {
                    date_from: start_date.format('YYYY-MM-DD'),
                    date_to: end_date.format('YYYY-MM-DD')
                }
            }

            const dayEventQuery = {
                params: {
                    date_from: start_date.format('YYYY-MM-DD'),
                    date_to: end_date.format('YYYY-MM-DD'),
                    status: 'approved',
                }
            }

            const ticketQuery = {
                params: {
                    date_from: "2019-01-01",
                    date_to: end_date.format('YYYY-MM-DD'),
                }
            }

            const eventQuery = {
                params: {
                    date_from: '2019-01-01',
                    date_to: end_date.format('YYYY-MM-DD'),
                    status: 'approved',
                }
            }

            const query = {
                params: {
                    date_from: '2020-01-31',
                    date_to: '2022-01-31',
                    status: 'denied',
                    type: 'summary',
                }
            }
            try{
                setTicketsNum((await axios.get("/api/events/countTickets", ticketQuery)).data.count);
                setUsersNum((await axios.get("/api/users/usersCount", ticketQuery)).data.count);
                setEventsNum((await axios.get("/api/events/countEvents", eventQuery)).data.count);
                
                setDayTicketsNum((await axios.get("/api/events/countTickets", dayTicketQuery)).data.count);
                setDayUsersNum((await axios.get("/api/users/usersCount", dayTicketQuery)).data.count);
                setDayEventsNum((await axios.get("/api/events/countEvents", dayEventQuery)).data.count);
            }
            catch (e){
                console.log(e.response.data.err);
            }


            try {
                const events = (await axios.get("/api/events", query)).data;
                setPendingEvents(events);
            } catch (err) {
                console.log(err.response.data.err);
            }  
    },[]);

    const fileEventHandler = async e => {
        let images = e.target.files;

        for (let [key, value] of Object.entries(images)) {
            const file = value;
            const userData = new FormData();
            try {
                userData.append('img_thumbnail', file);

                await axios.post('/api/thumbnails/', userData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                alert('images successfully submitted');
            } catch (err) {
                if (err.response && err.response.data)
                    alert(err.response.data);
                else
                    alert(err);
            }
        }
		
    }


    return (
        context.profile && context.profile.is_admin ?
        <>
        <Head>
            <title>Admin Dashboard</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <h2 className="pl-8 pb-4 text-2xl">Approval Portal</h2>
        {pendingEvents && pendingEvents.length ? <EventGrid events={pendingEvents} isEditable={true} style="px-2" gridNum="3 mx-6" closeCardF={()=>{console.log("close card")}}/> : <> <div className="text-center">No Events</div> </>}
        <h2 className="pl-8 text-2xl">Upload to Image Bank</h2>

        <div className="w-full h-24">
            <input className="hidden" ref={fileInput} type="file" onChange={fileEventHandler} accept={"image/*"} multiple={true} />
            <div onClick={() => {fileInput.current.click()}}>
                <img className="w-full px-12 py-8 items-center cursor-pointer" src={upload}></img>
            </div>
        </div>
        <h2 className="pt-32 pb-12 pl-8 text-2xl">Today</h2>
        <div className="flex flex-row justify-between px-24">
            <div className="flex flex-col text-center">
                <div className="text-2xl">{dayTicketsNum}</div>
                <div>Tickets Booked</div>
            </div>
            <div className="flex flex-col text-center">
                <div className="text-2xl">{dayEventsNum}</div>
                <div>Events Submitted</div>
            </div>
            <div className="flex flex-col text-center">
                <div className="text-2xl">{dayUsersNum}</div>
                <div>Accounts Made</div>
            </div>
        </div>
        
        <h2 className="pl-8 text-2xl pb-8 pt-12">All Time</h2>
        <div className="flex flex-row justify-between px-24 pb-12">
            <div className="flex flex-col">
                <CountUp duration={1.2} className="text-2xl text-center" end={ticketsNum} />
                <div>Tickets Booked</div>
            </div>
            <div className="flex flex-col">
                <CountUp duration={1.2} className="text-2xl text-center" end={eventsNum} />
                <div>Events Submitted</div>
            </div>
            <div className="flex flex-col">
                <CountUp duration={1.2} className="text-2xl text-center" end={usersNum} />
                <div>Accounts Made</div>
            </div>
        </div>
        </>
    : 
    <>
        <h3 className="pl-8 pb-4 items-center mt-12 text-lg text-center">You're not authorized to view this page. Click <a className=" underline" href="/">here</a> to visit our homepage.</h3>
    </>
    );
};


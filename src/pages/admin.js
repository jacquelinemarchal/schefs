import React, { useState, useEffect, useContext, useRef} from 'react';
import axios from 'axios';
import moment from 'moment';
import upload from '../assets/upload-long.png';

import Head from 'next/head';
import CountUp from 'react-countup';
import NavBar from '../components/Banners/navbar';
import EventGrid from '../components/Events/eventgrid';
import WhitePillButton from '../components/Buttons/wpillbutton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Context from '../components/Context/context';

// use https://www.npmjs.com/package/react-scrollable-list if issues with larger lists

const ApprovalPortal = () => {
    const context = useContext(Context);

    const [pendingEvents, setPendingEvents]  = useState(null); // [[eid, host_name, host_school, time_start, title]]
    const fileInput = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [ticketsNum, setTicketsNum] = useState(0);
    const [usersNum, setUsersNum] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("")
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
                status: 'pending',
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
        } catch (e){
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
            setIsUploading(true);
            try {
                userData.append('img_thumbnail', file);

                await axios.post('/api/thumbnails/', userData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setIsUploading(false);
                setUploadStatus("Images uploaded successfully")
                setTimeout(() => {
                    setUploadStatus("");
                },3000); 
              //  alert('images successfully submitted');
            } catch (err) {
                if (err.response && err.response.data)
                    alert(err.response.data);
                else
                    alert(err);
            }
        }
    }


    return (
        <>
          {context.profile && context.profile.is_admin
            ? <>
                <Head>
                  <title>Admin Dashboard</title>
                  <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
  
                <h2 className="pl-2 ml-6 md:ml-12 xl:ml-24 pb-4 text-2xl">Approval Portal</h2>
  
                {pendingEvents && pendingEvents.length
                  ? <EventGrid
                      events={pendingEvents}
                      isEditable={true}
                      style="px-2"
                      margin="px-6 md:px-12 xl:px-24"
                      gridNum="3"
                      closeCardF={() => {/*TODO: add close card function*/}}
                    />
                  : <div className="text-center">No Events</div>
                }

                <h2 className="pl-2 ml-6 md:ml-12 xl:ml-24 text-2xl">Upload to Image Bank</h2> 
                <p className="text-lg text-center text-green-500 font-bold">{uploadStatus}</p>
                {isUploading ? 
                <div className="ml-20 pl-8 my-4" style={{width: "60rem"}}>
                    <LinearProgress/>
                </div>
                :null
                }

                <div className="w-full h-24">
                  <input
                    className="hidden"
                    ref={fileInput}
                    type="file"
                    onChange={fileEventHandler}
                    accept={"image/*"}
                    multiple={true}
                  />
  
                  <div className="cursor-pointer px-2 mx-6 md:mx-12 xl:mx-24" onClick={() => fileInput.current.click()}>
                    <img className="w-full" src={upload}></img>
                  </div>
                </div>

                <h2 className="pt-32 pb-12 pl-2 ml-6 md:ml-12 xl:ml-24 text-2xl">Today</h2>
  
                <div className="flex flex-row justify-between px-2 mx-6 md:mx-12 xl:mx-24">
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
                
                <h2 className="text-2xl pl-2 ml-6 md:ml-12 xl:ml-24 pt-12 pb-12">All Time</h2>
              
                <div className="flex flex-row justify-between px-2 mx-6 md:mx-12 xl:mx-24 pb-12">
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
            : <h3 className="pl-8 pb-4 items-center mt-12 text-lg text-center">You're not authorized to view this page. Click <a className=" underline" href="/">here</a> to visit our homepage.</h3>
          }
        </>
    );
};

export default ApprovalPortal;

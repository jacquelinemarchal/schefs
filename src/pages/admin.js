// Approval Portal
import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useEffect, useContext, useRef} from "react";
import axios from "axios"
import upload from "../assets/upload-long.png"
import EventGrid from "../components/Events/eventgrid"
import NavBar from "../components/Banners/navbar";
import Context from '../components/Context/context';

// use https://www.npmjs.com/package/react-scrollable-list if issues with larger lists

export default function ApprovalPortal() {

    const [pendingEvents, setPendingEvents]  = useState(null); // [[eid, host_name, host_school, time_start, title]]
    const fileInput = useRef(null)

    useEffect(async () => {

        const query = {
            params: {
                date_from: '2020-12-31',
                date_to: '2021-01-31',
                status: 'denied',
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
        <>
        <h2 className="pl-8 pb-4 text-2xl">Approval Portal</h2>
        {pendingEvents && pendingEvents.length ? <EventGrid events={pendingEvents} style="px-2" gridNum="3 mx-6" closeCardF={()=>{console.log("close card")}}/> : <> <div className="text-center">No Events</div> </>}
        <h2 className="pl-8 text-2xl">Upload to Image Bank</h2>

        <div className="w-full h-24">
            <input className="hidden" ref={fileInput} type="file" onChange={fileEventHandler} accept={"image/*"} multiple={true} />
            <div onClick={() => {fileInput.current.click()}}>
                <img className="w-full px-12 py-8 items-center cursor-pointer" src={upload}></img>
            </div>
        </div>
        

        
        </>
    );
};


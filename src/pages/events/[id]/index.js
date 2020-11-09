import { useRouter } from 'next/router'
import { useState, useEffect, Fragment } from 'react'
import EventPageDetails from "../../../components/Events/eventpagedetails"
import axios from 'axios';
 
const EventPage = () => {
    const router = useRouter()
    const [eventInfo, setEventInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (router.query.eid){
            var eid = router.query.eid
        }
        else{
            var eid = (window.location.pathname).substring(8)
        }
        const fetchData = () => {
        let query = {
            params:{
                eid:eid,
            }
        }
        axios.get(`http://localhost:5000/api/events/${eid}`, query)
        .then((res) => {
            setEventInfo(res.data)
            setIsLoading(false);
        })
        .catch((err) => {console.log(err)})
        setIsLoading(true);
        };
        fetchData();
    }, []);

    return (
        <>
        {isLoading ? (
            <div className="justify-center flex">Loading ...</div>
        ) : (
            <div>
                <EventPageDetails {...eventInfo}/>
            </div>
        )}
        </>
    )
}

export default EventPage

/*
    let sampleEvent ={
        title: "Polyglot= Poly-Personalities?",
        time_start:"Wednesday, September 31st @ 9:30 pm EDT",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        requirements: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        host_name: "Lola Lafia",
        hosts: null,
    }
*/
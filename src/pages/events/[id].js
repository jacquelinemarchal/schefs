import { useRouter } from 'next/router'
import { useState, useEffect, Fragment } from 'react'
import EventPageDetails from "../../../components/Events/eventpagedetails"
import axios from 'axios';
 
const EventPage = () => {
    const router = useRouter()
    const [eventInfo, setEventInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        if (router.query.eid){
            var eid = router.query.eid
        }
        else{
            var eid = (window.location.pathname).substring(8)
        }
        let query = {
            params:{
                eid:eid,
            }
        }
        await axios.get(`http://localhost:5000/api/events/${eid}`, query)
        .then((res) => {
            setEventInfo(res.data)
            setIsLoading(false);
        })
        .catch((err) => {console.log(err)})
    };

    useEffect(() => {
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
export const getStaticProps = async () => {
    const data = await fetchData();

    return {
      props: {data,}
    };
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
import { useRouter } from 'next/router'
import { useState, useEffect, Fragment } from 'react'
import EventPageDetails from "../../../components/Events/eventpagedetails"
import axios from 'axios';
 
const EventPage = () => {
    const router = useRouter()
    const { id } = router.query
    const [eventInfo, setEventInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
     
          const result = await axios(url);
     
          setData(result.data);
          setIsLoading(false);
        };
     
        fetchData();
      }, []);

    return (
        <>
        {isLoading ? (
            <div className="justify-center flex">Loading ...</div>
        ) : (
            <div>
                <h1>Event: {id}</h1>
                <EventPageDetails />
            </div>
        )}
        </>
    )
}

export default EventPage
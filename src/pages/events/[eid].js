import EventPageDetails from "../../components/Events/eventpagedetails"
import useSWR from 'swr'
import axios from "axios"
import pool from '../../utils/db'
import queries from "../../utils/events_queries"

const EventPage = ( {eventInfo} ) => {

 //   const fetcher = url => axios.get(url).then(res => res.data)

  //  const { data, error } = useSWR(`http://localhost:5000/api/events/${eventInfo.eid}/tickets`, fetcher)

   /* if (error){
        console.log(error)
    }*/
    return (
        <>
            <EventPageDetails eventInfo={eventInfo} reservedTickets={2}/>
        </>
    )
}
export default EventPage

export const getStaticProps = async (context) => {
    const eventInfo = await new Promise((resolve, reject) => 
        pool.query(queries.getEvent, [ context.params.eid ], (err, results) => {
            (err ? reject(err) : resolve((results.rows[0].event)))
        })
    )
    return {
        props: {
            eventInfo,
        },
    }
}
export async function getStaticPaths(){
    const events = await new Promise((resolve, reject) => {
        pool.query(queries.getEventsSummary, ["2020-01-01", "2020-12-31", "all" ], (err, results) => {
            (err ? reject(err) : resolve((results.rows)))
        })
    })
    const paths = events.map(e => {
        return {
            params: {eid: (e.eid).toString()}
        }
    })
    return{
        paths,
        fallback: false,
    }
}
    /*

    const res = await axios.get(`http://localhost:5000/api/events/${eid}`, query)
    const eventInfo = res.data
    return {
      props: {eventInfo,},
    };
    
    let sampleEvent ={
        title: "Polyglot= Poly-Personalities?",
        time_start:"Wednesday, September 31st @ 9:30 pm EDT",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        requirements: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        host_name: "Lola Lafia",
        hosts: null,
    }*/
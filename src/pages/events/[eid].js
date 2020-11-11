import EventPageDetails from "../../components/Events/eventpagedetails"
//import useSWR from 'swr'
import pool from '../../utils/db'
import queries from "../../utils/events_queries"

const EventPage = ( {eventInfo} ) => {
    return (
        <>
            <EventPageDetails {...eventInfo}/>
        </>
    )
}
export default EventPage

export const getStaticProps = async (context) => {
    const eventInfo = await new Promise((resolve, reject) => 
        pool.query(queries.getEvent, [ context.params.eid ], (err, results) => {
            (err ? reject(err) : resolve((results.rows[0].json_build_object)))
        })
    )
    return {
        props: {
            eventInfo,
        },
    }
}
export async function getStaticPaths(){
    return{
        paths: [
            { params: { eid: '1' } },
            { params: { eid: '2' } },
            { params: { eid: '3' } },
        ],
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
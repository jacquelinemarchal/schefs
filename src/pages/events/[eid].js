import axios from "axios"
import pool from '../../utils/db'
import queries from "../../utils/events_queries"
import thumb from "../../../dev/images/e2.jpg"
import prof from "../../../dev/images/p2.jpg"
import Comment from "../../components/Events/comment"
import WhitePillButton from "../../components/Buttons/wpillbutton" //type, size (text), text, link
import {useEffect, useState} from "react"
import downloadLogo from "../../assets/bdownload.png"
import downloadHoverLogo from "../../assets/hdownload.png" //https://fkhadra.github.io/react-toastify/introduction/
import useSWR from 'swr'

const EventPage = ( props ) => {
    const fetcher = url => axios.get(url).then(res => res.data.count === "0" ? 0 : parseInt(res.data.count, 10))

    const { data:ticketCount, error:ticketError } = useSWR(`http://localhost:5000/api/events/${props.eventInfo.eid}/countTickets`, fetcher, {initialData: props.tickets})

    if (ticketError) {
        console.log(ticketError)
    }

    const commentFetcher = url => axios.get(url).then(res => res.data)
    const { data:comments, error:commentsError } = useSWR(`http://localhost:5000/api/${props.eventInfo.eid}/comments`, commentFetcher, {initialData: props.comments})

    if (commentsError) {
        console.log(commentsError)
    }
    console.log(comments)
    const [inHover, setHover] = useState(downloadLogo);
    const [copyStatus, setCopyStatus] = useState("")

    let reserveButton = {
        type:"submit", 
        size:"xl",
        padding:"px-4",
        text:"RESERVE FOR ZOOM",
    }

    const copyLink = (e) => {{
        navigator.clipboard.writeText(`schefs.us/events/${props.eventInfo.eid}`)}
        setCopyStatus("Copied!")
        setTimeout(() => {
            setCopyStatus("");
        },2000); 
      };
    
    return (
        <div className="mb-4 sm:gap-4 sm:grid sm:grid-cols-5 mx-8">
            <div className="sm:col-span-3">
                <div className="text-5xl">
                    {props.eventInfo.title}
                </div>
                <div className="mb-2">
                    {props.eventInfo.time_start}
                </div>
                <div className="mr-6 mb-4">
                    <img src={thumb} className="sm:w-3/4 rounded-2xl"></img>
                </div>
                <div className="mb-2">
                    {props.eventInfo.description}
                </div>
                <div className="text-2xl">
                    What to Prepare
                </div>
                <div className="mb-4">
                    {props.eventInfo.requirements ? props.eventInfo.requirements : "This event has no requirements."}
                </div>
                <hr></hr>
                <div className="my-4 text-2xl">
                    Thoughts:
                </div>
                <form className="flex row-span-1 items-end justify-center" >
                    <input className="w-full border-b border-black focus:outline-none" type="text" placeholder="Share your thought here" aria-label="Add a comment" />
                    <WhitePillButton padding="px-4" type="submit" text="POST" size="lg" />
                </form>
                <div className="">
                    {comments ? comments.map((p, i) => <Comment key={i} time={p.time_created} name={p.name} university={p.school} thought={p.body} />) : null}
                </div>
            </div>

            <div className="sm:col-span-2 mb-20 sm:m-0">
                <div className="sm:fixed">
                    <div className="hidden sm:inline-block">
                        <div className="flex">
                            <WhitePillButton {...reserveButton} />
                            <button onMouseEnter={() => setHover(downloadHoverLogo)} onMouseLeave={() => setHover(downloadLogo)} onClick={copyLink} className="ml-2 flex space-x-2 text-gray-700 items-center h-8 w-8 bg-gray-400 rounded-full focus:outline-none">
                                <img src={inHover} className="p-2"></img><p>{copyStatus}</p>
                            </button>
                        </div>
                        <div className="text-gray-500 mt-2">
                            {7-ticketCount} / 7 spots available
                        </div>
                    </div>
                    <div className="sm:hidden inline-block">
                        <footer className="left-0 px-8 fixed w-full flex justify-between bottom-0 bg-white h-16">
                            <div className="text-gray-500 self-center">
                                {7-ticketCount} / 7 spots available
                            </div>
                            <div className="self-center">
                                <WhitePillButton padding="px-4" type="submit" text="RESERVE" size="xl" />
                            </div>
                        </footer>
                    </div>

                    <div className="text-sm my-2">
                        Hosted by:
                    </div>
                    <div className="sm:mr-8 shadow-md sm:shadow-none mr-4 border-solid border-black border sm:border-2 rounded-2xl">
                        <div className="p-4 grid-rows-3">
                            <div className="row-span-1 flex">
                                <img src={prof} className="rounded-full p-2 h-24 w-24 items-center justify-center"></img>
                                <p className="self-center ml-4 text-3xl">{props.eventInfo.host_name}</p>
                            </div>
                            <div className="mb-8 row-span-1 text-center justify-center">
                                <p>{props.eventInfo.host_school} • 2023</p>
                                <p>Computer Engineering</p>
                            </div>
                            <div className="row-span-1 text-center justify-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </div>                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EventPage

export const getStaticProps = async (context) => {
    const eventInfo = await new Promise((resolve, reject) => 
        pool.query(queries.getEvent, [ context.params.eid ], (err, results) => {
            (err ? reject(err) : resolve((results.rows[0].event)))
        })
    )
    const tickets = await new Promise((resolve, reject) =>
        pool.query(queries.getReservedTicketsCount, [ context.params.eid ], (err, results) => {
            (err ? reject(err) : resolve((results.rows[0].count)))
        })
    )
    const comments = await new Promise((resolve, reject) =>
        pool.query(queries.getComments, [ context.params.eid ], (err, results) => {
            err ? reject(err) : resolve(results.rows.map(comment => (
                {
                    ...comment,
                    time_created: comment.time_created.toJSON()
                }
            )))
        })
    )
    return {
        props: {
            eventInfo,
            tickets: tickets === "0" ? 0 : parseInt(tickets, 10),
            comments,
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
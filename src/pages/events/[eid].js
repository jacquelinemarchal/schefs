import axios from 'axios';
import pool from '../../utils/db';
import queries from "../../utils/queries/events"
import Comment from "../../components/Events/comment"
import WhitePillButton from "../../components/Buttons/wpillbutton" //type, size (text), text, link
import React, { useEffect, useContext, useState } from "react"
import Context from '../../components/Context/context';
import downloadLogo from "../../assets/bdownload.png"
import downloadHoverLogo from "../../assets/hdownload.png" //https://fkhadra.github.io/react-toastify/introduction/
const { htmlToText } = require('html-to-text');

const EventPage = (props) => {
    const [clientTickets, setClientTickets] = useState(props.tickets)
    const [clientComments, setClientComments] = useState(props.comments)
    const [inHover, setHover] = useState(downloadLogo);
    const [copyStatus, setCopyStatus] = useState("")
    const [commentBody, setCommentBody] = useState("")
    const [reservedTicket, setReservedTicket] = useState(false)
    const context = useContext(Context);

    /* Get comments and new tickets for event every 10 seconds*/ 
    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`/api/events/${props.eventInfo.eid}/countTickets`)
            .then(res => {
                (res.data.count === "0" ? setClientTickets(0) : setClientTickets(parseInt(res.data.count, 10)))
            })
            .catch(err => {
                console.log(err)
            })
            axios.get(`/api/events/${props.eventInfo.eid}/comments`)
            .then(res => {
                setClientComments(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }, 10000);
        return () => clearInterval(interval);
      }, []); /*    necessary? [clientComments, clientTickets]);    */
      
    useEffect(() => {
        if (context.profile){
            axios.get(`/api/events/${props.eventInfo.eid}/${context.profile.uid}/ticketstatus`)
            .then(res => {
                setReservedTicket(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }
        else{
            setReservedTicket(false)
        }
    }, [context.profile]);

    const copyLink = (e) => {{
        navigator.clipboard.writeText(`schefs.us/events/${props.eventInfo.eid}`)}
        setCopyStatus("Copied!")
        setTimeout(() => {
            setCopyStatus("");
        },2000); 
      };
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        console.log("HI")
        if (context.profile){
            if (commentBody.replace(/\s/g, '').length) {
                setClientComments([...clientComments, {
                    time_created: Date.now(),
                    name: context.profile.first_name.concat(" ", context.profile.last_name),
                    school: context.profile.school, 
                    body: commentBody
                }])
                let sendComment = {
                    user_id: context.profile.uid, // ADD AUTH
                    name: context.profile.first_name.concat(" ", context.profile.last_name),
                    body:commentBody,
                    school: context.profile.school,
                }
                axios.post(`/api/events/${props.eventInfo.eid}/comment`, sendComment)
                .then((res)=>{
                    setCommentBody("")
                    console.log(res)
                })
                .catch((err)=>{alert(err)})
            }
        }
        else{
            context.handleToggleCard(false, true)
        }
        
    }
    const reserveTicket = (e) => {
        e.preventDefault()
        if (context.profile){
            let userContent = {
                user_id: context.profile.uid,
            }
            setClientTickets(clientTickets + 1)
            axios.post(`/api/events/${props.eventInfo.eid}/tickets`, userContent)
            .then(() => {
                setReservedTicket(true)
            })
            .catch((err) => {
                console.log(err.response.data.err);
            })
        }
        else{
            context.handleToggleCard(false, true)
        }
        
    }

    return (
        <div className="mb-4 sm:gap-24 sm:grid sm:grid-cols-5 mx-8">
            <div className="sm:col-span-3">
                <div className="text-5xl">
                    {props.eventInfo.title}
                </div>
                <div className="mb-2">
                    {props.eventInfo.time_start}
                </div>
                <div className="mr-6 mb-4">
                    <img src={process.env.BASE_URL + props.eventInfo.img_thumbnail} className="sm:w-3/4 rounded-2xl"></img>
                </div>
                <div className="mb-2">
                    {htmlToText(props.eventInfo.description)}
                </div>
                <div className="text-2xl">
                    What to Prepare
                </div>
                <div className="mb-4">
                    {props.eventInfo.requirements ? htmlToText(props.eventInfo.requirements) : "This event has no requirements."}
                </div>
                <hr></hr>
                <div className="my-4 text-2xl">
                    Thoughts:
                </div>
                <form className="flex row-span-1 items-end justify-center">
                    <input className="w-full border-b border-black focus:outline-none" value={commentBody} onChange={(e) => setCommentBody(e.target.value)} type="text" placeholder="Share your thought here" aria-label="Add a comment" />
                    <WhitePillButton handleClick={handleCommentSubmit} padding="px-4 flex" type="submit" text="POST" size="lg" />
                </form>
                <div className="">
                    {clientComments.length
                        ? clientComments.sort((a, b) => {return new Date(b.time_created) - new Date(a.time_created)}).map((p, i) => <Comment key={i} time={p.time_created} name={p.name} university={p.school} thought={p.body} />) 
                        : <p className="my-4 text-gray-500">There are no comments yet...start the conversation!</p>}
                </div>
            </div>

            <div className="sm:col-span-2 mb-20 sm:m-0">
                <div className="sm:fixed">
                    <div className="hidden sm:inline-block">
                        <div className="flex">
                            {clientTickets > 14 
                                ? <button className={"flex justify-center items-center focus:outline-none text-xl text-gray-500 border sm:border-2 border-gray-500 px-4 cursor-default rounded-full"}>SOLD OUT</button>  
                                : reservedTicket 
                                    ? <button className={"flex justify-center items-center bg-yellow-300 focus:outline-none text-xl text-black border sm:border-2 border-black px-4 cursor-not-allowed rounded-full"}>RESERVED</button> 
                                    : <form onSubmit={reserveTicket}><WhitePillButton type = "submit" size="xl" padding="px-4 flex" text="RESERVE FOR ZOOM" handleClick= {reserveTicket}/></form>}
                            <button onMouseEnter={() => setHover(downloadHoverLogo)} onMouseLeave={() => setHover(downloadLogo)} onClick={copyLink} className="ml-2 flex space-x-2 text-gray-700 items-center h-8 w-8 bg-gray-400 rounded-full focus:outline-none">
                                <img src={inHover} className="p-2"></img><p>{copyStatus}</p>
                            </button>
                        </div>
                        <div className="text-gray-500 mt-2">
                            {clientTickets > 5 
                            ? <> 6 / 7 spots available</>
                            : <>{7-clientTickets} / 7 spots available</>}
                        </div>
                    </div>
                    <div className="sm:hidden inline-block">
                        <footer className="left-0 px-8 fixed w-full flex justify-between bottom-0 bg-white h-16">
                            <div className="text-gray-500 self-center">
                                {7-clientTickets} / 7 spots available
                            </div>
                            <div className="self-center">
                                <WhitePillButton padding="px-4 flex" type="submit" text="RESERVE" size="xl" />
                            </div>
                        </footer>
                    </div>

                    <div className="text-sm my-2">
                        Hosted by:
                    </div>
                    <div className="sm:mr-8 shadow-md sm:shadow-none mr-4 border-solid border-black border sm:border-2 rounded-2xl" style={{ maxWidth: "350px"}}>
                        <div className="p-4 grid-rows-3">
                            <div className="row-span-1 flex">
                                <img src={process.env.BASE_URL + props.eventInfo.hosts[0].img_profile
                                //TODO: update for cohosts
                                } className="rounded-full p-2 h-24 w-24 items-center justify-center"></img>
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

export default EventPage;

export const getServerSideProps = async (context) => {
    const eventInfo = await new Promise((resolve, reject) => 
        pool.query(queries.getEvent, [ context.params.eid ], (err, results) => {
            if (err)
                reject(err);
            else if (results.rows.length == 0)
                reject({ err: 'No such event' });
            else
                resolve((results.rows[0].event));
        })
    )
    const tickets = await new Promise((resolve, reject) =>
        pool.query(queries.getReservedTicketsCount, [ context.params.eid ], (err, results) => {
            (err ? reject(err) : resolve((results.rows[0].count)))
        })
    )
    const comments = await new Promise((resolve, reject) => {
        pool.query(queries.getComments, [ context.params.eid], (err, results) => {
            (err ? reject(err) : resolve((results.rows)))
        })
    })
    const commentSerialized = comments.map(comment => ({...comment, time_created: comment.time_created.toISOString()}))

    return {
        props: {
            eventInfo,
            tickets: tickets === "0" ? 0 : parseInt(tickets, 10),
            comments: commentSerialized,
        },
    }
}

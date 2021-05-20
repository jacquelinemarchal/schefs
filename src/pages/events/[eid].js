import React, { useEffect, useContext, useState } from "react"
import axios from 'axios';
import moment from 'moment-timezone';
const { htmlToText } = require('html-to-text');
import Head from 'next/head';

import pool from '../../utils/db';
import queries from "../../utils/queries/events"
import Comment from "../../components/Events/comment"
import WhitePillButton from "../../components/Buttons/wpillbutton" //type, size (text), text, link
import Context from '../../components/Context/context';
import downloadLogo from "../../assets/bdownload.png"
import downloadHoverLogo from "../../assets/hdownload.png" 

const EventPage = ({eventInfo, tickets, comments}) => {
    const context = useContext(Context);
    console.log(eventInfo)

    // get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';

    const [clientTickets, setClientTickets] = useState(tickets)
    const [clientComments, setClientComments] = useState(comments)
    const [inHover, setHover] = useState(downloadLogo);
    const [copyStatus, setCopyStatus] = useState("")
    const [commentFocus, setCommentFocus] = useState(false)
    const [commentBody, setCommentBody] = useState("")
    const [reservedTicket, setReservedTicket] = useState(null)

    /* Get comments and new tickets for event every 10 seconds*/ 
    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`/api/events/${eventInfo.eid}/countTickets`)
                .then(res => {
                    (res.data.count === "0" ? setClientTickets(0) : setClientTickets(parseInt(res.data.count, 10)))
                })
                .catch(err => console.log(err));

            axios.get(`/api/events/${eventInfo.eid}/comments`)
                .then(res => setClientComments(res.data))
                .catch(err => console.log(err))
        }, 10000);

        return () => clearInterval(interval);
      }, []); 
      
    useEffect(() => {
        if (context.profile){
            axios.get(`/api/events/${eventInfo.eid}/${context.profile.uid}/ticketstatus`)
                .then(res => setReservedTicket(res.data))
                .catch(err => console.log(err));
        } else
            setReservedTicket(false);
    }, [context.profile]);

    const copyLink = (e) => {{
        navigator.clipboard.writeText(`${process.env.BASE_URL}events/${eventInfo.eid}`)}
        setCopyStatus("Copied!");
        setTimeout(() => {
            setCopyStatus("");
        }, 2000); 
      };
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        if (context.profile) {
            if (commentBody.replace(/\s/g, '').length) {
                setCommentBody('');
                setClientComments([...clientComments, {
                    time_created: Date.now(),
                    name: context.profile.first_name.concat(" ", context.profile.last_name),
                    school: context.profile.school, 
                    body: commentBody
                }]);
                
                const sendComment = {
                    name: context.profile.first_name.concat(" ", context.profile.last_name),
                    body:commentBody,
                    school: context.profile.school,
                };

                axios.post(`/api/events/${eventInfo.eid}/comment`, sendComment)
                    .catch((err) => console.log(err));
            }
        } else
            context.handleToggleCard(false, true);
    }

    const reserveTicket = () => {
        if (context.profile && context.profile.isVerified){
            const userContent = {
                user_id: context.profile.uid,
            };

            axios.post(`/api/events/${eventInfo.eid}/tickets`, userContent)
                .then(() => {
                    setClientTickets(clientTickets + 1);
                    setReservedTicket(true);
                })
                .catch((err) => {
                    console.log(err.response.data.err);
                })
        } else
            context.handleToggleCard(false, true);
    }
       
     return (
        <div id="eventPgDiv" className="mb-4 sm:gap-24 mx-6 md:mx-12 xl:mx-24 ">
            <Head>
                <title>{eventInfo.title}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="sm:col-span-3">
                <p className="text-5xl mb-2" style={{lineHeight:'1.15'}}>
                  {eventInfo.title}
                </p>
                <div className="sm:mb-2 mb-4 mt-2 sm:mt-0">
                    {moment(eventInfo.time_start).tz(timezone).format('dddd, MMMM D, YYYY @ h:mm A z')}
                </div>
                <div className="mb-6">
                    <img src={process.env.BASE_URL + eventInfo.img_thumbnail} className="sm:w-5/6 w-auto rounded-2xl"></img>
                </div>
                <div className=" sm:mr-8 lg:mr-16 mb-4">
                    {htmlToText(eventInfo.description)}
                </div>
                <div className="text-2xl">
                    What to Prepare
                </div>
                <div className="mb-4 sm:mb-6 sm:mr-8 lg:mr-16">
                    {eventInfo.requirements ? htmlToText(eventInfo.requirements) : "This event has no requirements."}
                </div>
                <hr></hr>
                <div className="mb-2 mt-4 sm:hidden sm:text-left text-center">
                  Hosted by:
                </div>
                <div className="justify-center sm:hidden shadow-md mx-2 border-solid border-black border-2 rounded-2xl" style={{ maxWidth: "350px"}}>
                    <div className="p-4 grid-rows-3">
                        <div className="row-span-1 flex">
                            <img src={process.env.BASE_URL + eventInfo.hosts[0].img_profile} className="rounded-full p-2 h-24 w-24 items-center justify-center"></img>
                            <p className="self-center mb-4 ml-4 text-3xl" style={{lineHeight: "1.15"}}>{eventInfo.host_name}</p>
                        </div>
                        <div className="mb-4 mt-4 row-span-1 text-center justify-center">
                            <p>{eventInfo.host_school} • {eventInfo.hosts[0].grad_year}</p>
                            <p>{eventInfo.hosts[0].major}</p>
                        </div>
                        <div className="row-span-1 justify-center">
                            {htmlToText(eventInfo.host_bio)}
                        </div>                        
                    </div>
                </div>
                <div className="sm:my-4 text-2xl mt-6 mb-4">
                    Thoughts:
                </div>
                <form className="mr-16 flex row-span-1 items-end justify-center" onSubmit={handleCommentSubmit}>
                    <input className="w-full border-b border-black focus:outline-none mr-4" onFocus={() => {setCommentFocus(true)}} onBlur={() => {setCommentFocus(false)}} value={commentBody} onChange={(e) => setCommentBody(e.target.value)} type="text" placeholder="Share your thought here" aria-label="Add a comment" />
                    <WhitePillButton padding="px-4 flex" type="submit" text="POST" size="lg" />
                </form>
                <div className="mr-16">
                    {clientComments.length
                        ? clientComments.sort((a, b) => {return new Date(b.time_created) - new Date(a.time_created)}).map((p, i) => <Comment key={i} time={p.time_created} name={p.name} university={p.school} thought={p.body} />) 
                        : <p className="my-4 text-gray-500">There are no comments yet...start the conversation!</p>}
                </div>
            </div>

            <div className="sm:col-span-2 mb-20 sm:m-0">
                <div className="sm:fixed h-0 sm:h-auto">
                    <div className="hidden sm:inline-block">
                        <div className="flex">
                            {new Date(eventInfo.time_start) > new Date()
                              ? clientTickets > 14 
                                  ? <button className={"flex justify-center items-center focus:outline-none text-xl text-gray-500 border sm:border-2 border-gray-500 px-4 cursor-default rounded-full"}>SOLD OUT</button>  
                                  : reservedTicket 
                                    ? <button className={"flex justify-center items-center bg-yellow-300 focus:outline-none text-xl text-black border sm:border-2 border-black px-4 cursor-not-allowed rounded-full"}>RESERVED</button> 
                                    : <WhitePillButton type="button" size="xl" padding="px-4 flex" text="RESERVE FOR ZOOM" handleClick={reserveTicket}/>
                              : <WhitePillButton type="button" size="xl" padding="px-4 flex" text="EVENT HAS PASSED" />
                            }
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
                                <WhitePillButton padding="px-4 flex" type="button" text="RESERVE" size="xl" />
                            </div>
                        </footer>
                    </div>

                    <div className="my-2 hidden sm:block sm:text-left text-center">
                        Hosted by:
                    </div>
                    <div className="justify-center hidden sm:block sm:ml-0 sm:mr-8 shadow-md sm:shadow-none mx-2 border-solid border-black border-2 rounded-2xl" style={{ maxWidth: "350px"}}>
                        <div className="p-4 grid-rows-3">
                            <div className="row-span-1 flex">
                                <img src={process.env.BASE_URL + eventInfo.hosts[0].img_profile} className="rounded-full p-2 h-24 w-24 items-center justify-center"></img>
                                <p className="self-center mb-4 ml-4 text-3xl" style={{lineHeight: "1.15"}}>{eventInfo.host_name}</p>
                            </div>
                            <div className="mb-4 mt-4 row-span-1 text-center justify-center">
                                <p>{eventInfo.host_school} • {eventInfo.hosts[0].grad_year}</p>
                                <p>{eventInfo.hosts[0].major}</p>
                            </div>
                            <div className="row-span-1 justify-center">
                                {eventInfo.host_bio}
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
    try {
        const eventInfo = (await pool.query(queries.getEvent, [ context.params.eid ])).rows[0].event;
        const tickets = parseInt((await pool.query(queries.getReservedTicketsCount, [ context.params.eid ])).rows[0].count);
        const comments = (await pool.query(queries.getComments, [ context.params.eid ])).rows.map(
            (comment) => ({...comment, time_created: comment.time_created.toISOString()})
        );

        if (eventInfo.status !== 'approved') {
            return {
                notFound: true,
            };
        }
        return {
            props: {
                eventInfo,
                tickets,
                comments,
            },
        };
    } catch (err) {
        console.log(err);
        return {
            notFound: true,
        };
    }
}

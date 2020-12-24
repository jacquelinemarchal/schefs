import thumb from "../../../dev/images/e2.jpg"
import prof from "../../../dev/images/p2.jpg"
import Comment from "./comment"
import axios from "axios"
import WhitePillButton from "../Buttons/wpillbutton" //type, size (text), text, link
import {useEffect, useState} from "react"
import downloadLogo from "../../assets/bdownload.png"
import downloadHoverLogo from "../../assets/hdownload.png" //https://fkhadra.github.io/react-toastify/introduction/
import useSWR from 'swr'

const EventPageDetails = (props) => {

    const fetcher = url => axios.get(url).then(res => res.data)
    const { data, error } = useSWR(`http://localhost:5000/api/events/${props.eventInfo.eid}/tickets`, fetcher, {initialData: props.reservedTickets})

    const commentFetcher = url => axios.get(url).then(res => res.data)
    const { data, error } = useSWR(`http://localhost:5000/api/${props.eventInfo.eid}/comments`, commentFetcher, {initialData: props.comments})

    console.log(data)
    if (error){
        console.log(error)
    }

    const [inHover, setHover] = useState(downloadLogo);
    const [copyStatus, setCopyStatus] = useState("")

    let reserveButton = {
        type:"submit", 
        size:"xl",
        padding:"px-4 flex",
        text:"RESERVE FOR ZOOM",
    }
    useEffect(() => {
        let requirements = props.eventInfo.requirements

        if (!requirements){
            requirements = "This event has no requirements."
        }        
    }, []);

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
                    {props.eventInfo.requirements}
                </div>
                <hr></hr>
                <div className="my-4 text-2xl">
                    Thoughts:
                </div>
                <form className="flex row-span-1 items-end justify-center" >
                    <input className="w-full border-b border-black focus:outline-none" type="text" placeholder="Share your thought here" aria-label="Add a comment" />
                    <WhitePillButton padding="px-4 flex" type="submit" text="POST" size="lg" />
                </form>
                <div className="">
                    <Comment time="Yesterday" name="Jacqueline Marchal" university="Columbia University" thought="Wow I’d really love to come to this event but I can’t make it. Please please please host this again some other time!!!" />
                    <Comment time="Yesterday" name="Jacqueline Marchal" university="Columbia University" thought="Wow I’d really love to come to this event but I can’t make it. Please please please host this again some other time!!!" />

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
                            {props.reservedTickets ? 7-props.reservedTickets : null} / 7 spots available
                        </div>
                    </div>
                    <div className="sm:hidden inline-block">
                        <footer className="left-0 px-8 fixed w-full flex justify-between bottom-0 bg-white h-16">
                            <div className="text-gray-500 self-center">
                                {props.reservedTickets ? 7-props.reservedTickets : null} / 7 spots available
                            </div>
                            <div className="self-center">
                                <WhitePillButton padding="px-4 flex" type="submit" text="RESERVE" size="xl" />
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
  };
  
  export default EventPageDetails;
import thumb from "../../../dev/images/e2.jpg"
import prof from "../../../dev/images/p2.jpg"
import Comment from "./comment"
import WhitePillButton from "../Buttons/wpillbutton" //type, size (text), text, link
import {useEffect} from "react"

const EventPageDetails = (props) => {
    let reserveButton = {
        type:"submit", 
        size:"xl",
        text:"RESERVE FOR ZOOM",
    }
    useEffect(() => {
        let requirements = props.requirements
        if (!requirements){
            requirements = "This event has no requirements."
        }
        
    }, []);

    return (
        <div className="mb-4 sm:gap-4 sm:grid sm:grid-cols-5 mx-8">
            <div className="sm:col-span-3">
                <div className="text-5xl">
                    {props.title}
                </div>
                <div className="mb-2">
                    {props.time_start}
                </div>
                <div className="mr-6 mb-4">
                    <img src={thumb} href="/sampleevent" className="sm:w-3/4 rounded-2xl"></img>
                </div>
                <div className="mb-2">
                    {props.description}
                </div>
                <div className="text-2xl">
                    What to Prepare
                </div>
                <div className="mb-4">
                    {props.requirements}
                </div>
                <hr></hr>
                <div className="my-4 text-2xl">
                    Thoughts:
                </div>
                <form className="flex row-span-1 items-end justify-center" >
                    <input className="w-full border-b border-black focus:outline-none" type="text" placeholder="Share your thought here" aria-label="Add a comment" />
                    <WhitePillButton type="submit" text="POST" size="lg" />
                </form>
                <div className="">
                    <Comment time="Yesterday" name="Jacqueline Marchal" university="Columbia University" thought="Wow I’d really love to come to this event but I can’t make it. Please please please host this again some other time!!!" />
                    <Comment time="Yesterday" name="Jacqueline Marchal" university="Columbia University" thought="Wow I’d really love to come to this event but I can’t make it. Please please please host this again some other time!!!" />

                </div>
            </div>

            <div className="sm:col-span-2 mb-20 sm:m-0">
                <div className="sm:fixed">
                    <div className="hidden sm:inline-block">
                        <WhitePillButton {...reserveButton} />
                        <div className="text-gray-500 mt-2">
                            2/7 spots available
                        </div>
                    </div>
                    <div className="sm:hidden inline-block">
                        <footer className="left-0 px-8 fixed w-full flex justify-between bottom-0 bg-white h-16">
                            <div className="text-gray-500 self-center">
                                2/7 spots available
                            </div>
                            <div className="self-center">
                                <WhitePillButton type="submit" text="RESERVE" size="xl" />
                            </div>
                        </footer>
                    </div>

                    <div className="text-sm my-2">
                        Hosted by:
                    </div>
                    <div className="sm:mr-8 shadow-md sm:shadow-none mx-4 border-solid border-black border-2 rounded-2xl">
                        <div className="p-4 grid-rows-3">
                            <div className="row-span-1 flex">
                                <img src={prof} className="rounded-full p-2 h-24 w-24 items-center justify-center"></img>
                                <p className="self-center ml-4 text-3xl">{props.host_name}</p>
                            </div>
                            <div className="mb-8 row-span-1 text-center justify-center">
                                <p>{props.host_school} • 2023</p>
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
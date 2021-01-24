import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useContext, useEffect } from "react";
import axios from "axios"
import Context from "../components/Context/context"
// use https://www.npmjs.com/package/react-scrollable-list if issues with larger lists
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

export default function OMA () {
    const [topic, setTopic]  = useState("");
    const [allTopics, setAllTopics]  = useState([]); // [["omid", user_id, "body", time_created]]
    const context = useContext(Context);

    useEffect(() => {
        getTopics(-1) // GET everything from open mind api

        const interval = setInterval(() => {
            getTopics(-1)
        },10000)

        return()=>clearInterval(interval)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (context.profile){
            let sendTopic = {
                user_id: context.profile.uid,
                body:topic,
            }
            axios.post("http://localhost:5000/api/openmind", sendTopic)
            .then((res)=>{
                setTopic("")
                getTopics(-1)
            })
            .catch((err)=>{alert(err)})
        }
        else{
            context.handleToggleCard(false, true)
        }

    }

    const getTopics = (lastId) => {
        let getRecentTopics = {
                params:{
                    last_id: lastId
            }
        }
        axios.get("http://localhost:5000/api/openmind", getRecentTopics)
        .then((res)=>{
            setAllTopics([...res.data])
            scroll.scrollToBottom({
                containerId: "topic-container",
                duration: 0,
              });
        })
        .catch((err)=>{alert(err)})
    }
    return (
        <>  
            <div className="grid mx-8 sm:grid-cols-2">
                <div className="col-span-1 sm:mr-6">
                    <p className="sm:my-8">Open Mind Archive</p>
                    <p className="leading-snug text-4xl sm:mt-24 sm:mb-2">What's a topic you're curious to learn more about?</p>
                    <p className="">A curiousity bank generated by the Schefs community.</p>
                </div>
                <div className="col-span-1">
                    <div className="grid rows-7 h-screen/1.25 pb-4">
                        <div id="topic-container" className="flex overflow-y-scroll row-span-6">
                            <ul className="m-auto text-center">
                                {allTopics.map(topic=>(
                                    <li key={topic.omid}>{topic.body}</li>
                                ))}
                            </ul>
                        </div>
                        <form className="flex row-span-1 items-end justify-center">
                                <input className="w-1/3 pt-4 border-b border-black focus:outline-none" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Add a topic"  />
                                <WhitePillButton handleClick={handleSubmit} padding="px-4 flex" type="submit" text="POST" size="lg" />
                        </form>
                    </div>
                </div>
            </div>
        </>
  );
};

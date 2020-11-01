import WhitePillButton from "../components/wpillbutton"
import React, { useState, useEffect } from "react";
import axios from "axios"

export default function OMA() {
    const [topic, setTopic]  = useState("");
    const [allTopics, setAllTopic]  = useState([]); // [["stringTopic", dbId, "userName", timestamp]]
    // constant query from backend with react... should you use useEffect?
    useEffect(() => {
        if (!allTopics.length){
            getTopics(-1)
        }
        else{
            let latestId = allTopics[allTopics.length-1].dbId;
            getTopics(latestId)
        }
        setTimeout(()=> {}, 1000)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        let sendTopic = {
            body:topic
        }
        axios.post("https://localhost:5000/api/openmind/", sendTopic)
        .then((res)=>{})
        .catch((err)=>{/*alert(err)*/})
    }

    const getTopics = (lastId) => {
        let getRecentTopics = {
            params:{
                query: lastId
            }
        }
        axios.get("https://localhost:5000/api/openmind/", getRecentTopics)
        .then((res)=>{
            // add response to array using setAllTopic
        })
        .catch((err)=>{alert(err)})
    }
    return (
        <>  
            <div className="grid mx-8 sm:grid-cols-2">
                <div className="col-span-1 sm:mr-6">
                    <p className="sm:my-8">Open Mind Archive</p>
                    <p className="text-4xl sm:mt-24 sm:mb-2">What's a topic you're curious to learn more about?</p>
                    <p className="">A curiousity bank generated by the Schefs community.</p>
                </div>
                <div className="col-span-1">            
                    <div className="grid rows-7 h-screen/1.25 pb-4 bg-gray-200">

                        <div className="row-span-6 bg-gray-400"></div>

                        <form className="flex row-span-1 items-end justify-center" onSubmit={handleSubmit}>
                                <input className="w-2/10 border-b border-black focus:outline-none" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Add a topic"  />
                                <WhitePillButton type="submit" text="POST" size="lg" />
                        </form>
                    </div>
                </div>
            </div>
        </>
  );
};

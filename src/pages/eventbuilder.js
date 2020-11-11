import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useEffect } from "react";
import axios from "axios"

export default function OMA () {
    const [topic, setTopic]  = useState("");

    useEffect(() => {

        return()=>(console.log("cleanup"))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        let sendTopic = {
            user_id: 1, // ADD AUTH
            body:topic,
        }
        axios.post("http://localhost:5000/api/openmind", sendTopic)
        .then((res)=>{
            setTopic("")
            getTopics(-1)
        })
        .catch((err)=>{alert(err)})
    }

    return (
        <>  
            <div className="">

                <form className="flex row-span-1 items-end justify-center" onSubmit={handleSubmit}>
                        <input className="w-1/3 pt-4 border-b border-black focus:outline-none" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Add a topic"  />
                        <WhitePillButton type="submit" text="POST" size="lg" />
                </form>

            </div>
        </>
  );
};

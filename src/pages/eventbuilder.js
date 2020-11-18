import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useEffect, useRef } from "react";
import axios from "axios"
import ContentEditable from 'react-contenteditable'

export default function EventBuilder () {

    useEffect(() => {
        // get data
        return()=>(console.log("cleanup"))
    }, [])

    const eventName = useRef("");
    const [charCounter, setCharCounter] = useState("0/65 characters")

    const onBlur = () => {
       // console.log(eventName.current);
    };

    const countChars = () => {
        var maxLength = 65;
        var strLength = eventName.current.length;
        console.log(eventName.current)
        if (strLength > maxLength){
            setCharCounter(`${strLength} / 65 characters`)
            // alert to error
            // set contenteditable to disabled
        }
        else{
            setCharCounter(`${strLength} / 65 characters`)
        }
    }
    return (
        <>  
            <div className="grid grid-cols-5 px-6 mx-1">
                <div className="grid col-span-3 bg-pink-300">
                    <ContentEditable
                        html={eventName.current}
                        onBlur={onBlur}
                        onKeyUp={countChars}
                        onChange={(e) => {eventName.current=e.target.value}} 
                        placeholder={"My event title..."}
                        className="text-5xl leading-snug mb-2 focus:outline-none"
                    />
                    <div className="text-gray-600">
                        {charCounter}
                    </div>
                </div>
                <div className="grid col-span-2 bg-red-500">
                    <div className="flex space-x-2 h-8">
                        <WhitePillButton type="submit" text="SET DATE &#038; SUBMIT" padding="px-6"/>
                        <WhitePillButton type="submit" text="HELP" padding="px-6"/>
                    </div>

                </div>

            </div>
        </>
  );
};

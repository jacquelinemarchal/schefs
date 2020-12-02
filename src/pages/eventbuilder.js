import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useEffect, useRef } from "react";
import axios from "axios"
import ContentEditable from 'react-contenteditable'
import thumb from "../../dev/images/e2.jpg"
//https://www.npmjs.com/package/html-parser

export default function EventBuilder () {
    const eventName = useRef("");
    const [charCounter, setCharCounter] = useState("0/65 characters");

    const onBlur = () => {
       // console.log(eventName.current);
    };
    
    const cleanupText = (text) => {
        var inHTML = false;
        var num = 0;
        for (let i = 0; i < text.length; i++){
            if (!inHTML){
                num++;
                break;
            }
            if (text.charAt(i) === "&"){
                inHTML = true;
                break;
            }
            if (text.charAt(i) === ";"){
                inHTML = false;
                break;
            }
        };
        return num;
    };

    const countChars = () => {
        var maxLength = 65;
        var strLength = cleanupText(eventName.current);

        if (strLength > maxLength){
            setCharCounter(`${strLength} / 65 characters`)
            return false;
        }
        else{
            setCharCounter(`${strLength} / 65 characters`)
            return true;
        }
    };

    return (
        <>  
            <div className="mb-4 sm:gap-4 sm:grid sm:grid-cols-5 mx-1 pl-6">
                <div className="grid col-span-3 bg-pink-300">
                    <ContentEditable
                        html={eventName.current}
                        onBlur={onBlur}
                        onKeyUp={countChars}
                        disabled={countChars ? false:true}
                        onChange={(e) => {eventName.current=e.target.value}} 
                        placeholder={"My event title..."}
                        className="text-5xl leading-snug mb-2 focus:outline-none"
                    />
                    <div className="text-gray-600 pb-2">
                        {charCounter}
                    </div>
                    <div>
                        You’ll be able to select your event’s date on the next page
                    </div>
                    <div className="mr-6 mb-4">
                   
                    </div>
                </div>
                <div className="grid col-span-2 bg-red-500 ">
                    <div className="sm:fixed">
                        <div className="flex space-x-2 h-8">
                            <WhitePillButton type="submit" text="SET DATE &#038; SUBMIT" padding="px-6"/>
                            <WhitePillButton type="submit" text="HELP" padding="px-6"/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};
/*
<ImageUploader
    {...props}
    onChange={onDrop}
    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
    maxFileSize={5242880}
    />
*/
import React, { useState, useRef, useContext } from 'react';
import Context from '../Context/context';
import { SentimentSatisfied } from "@material-ui/icons";
import ContentEditable from 'react-contenteditable'
import WhitePillButton from "../Buttons/wpillbutton"
import EventThumbnail from "../Events/eventgrid"

const CardContent = () => {

    const context = useContext(Context)
    const [dropDown, setDropDown] = useState(false)
    const [gradYear, setGradYear] = useState(context.profile.grad_year)
    const [edited, setEdited] = useState(false)
    const userInfo = useRef({
        first_name: context.profile.first_name,
        last_name: context.profile.last_name,
        uni:context.profile.school,
        email: context.profile.email,
    })

    const [events, setEvents] = useState([])

    const toggleDropDown = () => {
        setDropDown(!dropDown)
    }

    const closeCard = () => {
        if (window.location.pathname === "/" || window.location.pathname ===  "" || window.location.pathname === "/index"){
            context.handleCloseCard();
        }
        else {
            window.location.href="/"
        }
    }
  
    const handleBlur = () => {
      console.log(userInfo.current);
    };

    const saveUserInfo = () => {
        console.log("user info saved")
        //TASK: send to user endpoint
    }

    let fakeEvent = [{
        title: "How to Code in React",
        host_name: "Jackie",
        host_school: "Columbia",
        time_start: "Sunday, December 10, 10am EDT",
        eid: "1"
    },
    {
        title: "How to Code in React",
        host_name: "Jackie",
        host_school: "Columbia",
        time_start: "Sunday, December 10, 10am EDT",
        eid: "1"
    }]

    return (       
            <>  
                {context.profile ?
                    <>
                        <div className="md-shadow sm:px-8 px-6 pb-0 pt-2 rounded-2xl">
                            <ContentEditable
                                html={userInfo.current.first_name}
                                onBlur={handleBlur}
                                //onKeyUp={checkLength(100, userName)} TASK: Check if you want char limit
                                //disabled={checkLength(100, userName)}
                                onChange={(e) => {userInfo.current.first_name=e.target.value; setEdited(true)}} 
                                placeholder={"First Name"}
                                className="text-5xl leading-none mb-4 focus:outline-none"
                            />
                            <ContentEditable
                                html={userInfo.current.last_name}
                                onBlur={handleBlur}
                                //onKeyUp={checkLength(100, userName)} TASK: Check if you want char limit
                                //disabled={checkLength(100, userName)}
                                onChange={(e) => {userInfo.current.last_name=e.target.value; setEdited(true)}} 
                                placeholder={"Last Name"}
                                className="text-5xl leading-none mb-4 focus:outline-none"
                            />
                            <ContentEditable
                                html={userInfo.current.uni}
                                onBlur={handleBlur}
                                onChange={(e) => {userInfo.current.uni=e.target.value; setEdited(true)}} 
                                placeholder={"Your University"}
                                className="focus:outline-none text-sm"
                            />
                            <div className="relative inline-block text-left text-sm">
                                <div>
                                    <span className="rounded-md">
                                        <button id="gradYear" type="button" onClick={toggleDropDown} className="inline-flex justify-center w-full rounded-md bg-white leading-5 hover:text-gray-500 focus:outline-none active:bg-gray-50 active:text-gray-800 transition ease-in-out text-sm duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                        {gradYear}
                                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </div>
                            </div>
                            <div className={(dropDown ? 'block' : 'hidden') + " w-40 absolute mt-1 rounded-md shadow-lg"}>
                                <div className="rounded-md bg-white shadow-xs">
                                    <div tabIndex="0" onBlur={() => {setDropDown(false)}} role="menu" className="focus:outline-none" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <a onClick={() => {setGradYear("Class of 2021")}} className="block px-2 text-sm hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Class of 2021</a>
                                        <a onClick={() => {setGradYear("Class of 2022")}} className="block px-2 text-sm hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Class of 2022</a>
                                        <a onClick={() => {setGradYear("Class of 2023")}} className="block px-2 text-sm hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Class of 2023</a>
                                        <a onClick={() => {setGradYear("Class of 2024")}} className="block px-2 text-sm hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Class of 2024</a>
                                        <a onClick={() => {setGradYear("Gap Year")}} className="block px-2 text-sm hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Gap Year</a>
                                    </div>
                                </div>
                            </div>
                            <ContentEditable
                                html={userInfo.current.email}
                                onBlur={handleBlur}
                                onChange={(e) => {userInfo.current.email=e.target.value; setEdited(true)}} 
                                placeholder={"Your Email"}
                                className="focus:outline-none text-sm"
                            /> 
                            { edited ? <button onClick={saveUserInfo} className="px-4 my-2 bg-yellow-200 justify-center items-center bg-transparent focus:outline-none text-xs sm:text-sm text-black hover:bg-black hover:text-white border sm:border-2 border-black rounded-full">SAVE NEW INFO</button> : null} 

                            <div className="">
                                <div className="text-gray-500 mt-6 text-sm hidden">
                                    Your upcoming events will be displayed here… so go start reserving tickets already!
                                </div>
                                <a onClick={closeCard} className="underline text-sm cursor-pointer"> 
                                    Browse upcoming events
                                </a>
                            </div>
                            <div className="mt-4 text-sm ">
                                My upcoming events:
                                <div id="innerCardContainer" className="overflow-scroll mt-2" style={{height: "333px"}}>
                                    <EventThumbnail events={fakeEvent} style="mr-12" gridNum="1"/>
                                </div>
                            </div>
                        </div>
                        <div className="w-11/12 absolute bottom-0 mb-2 ml-4 flex justify-between">
                            <WhitePillButton text="MY EVENTS" link="" padding="px-4" size="xs bg-white sm:text-sm"/>
                            <WhitePillButton text="HOST AN EVENT" link="" padding="px-4" size="xs bg-white sm:text-sm"/>        
                            <WhitePillButton text="LOG OUT" link="" padding="px-4" size="xs bg-white sm:text-sm"/>        
                        </div> 
                    </>
                : <p>Not Logged In</p>}
            </>
    )
}
export default CardContent;

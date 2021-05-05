import React, { useState, useRef, useContext, useEffect } from 'react';
import Context from '../Context/context';
import { SentimentSatisfied } from "@material-ui/icons";
import ContentEditable from 'react-contenteditable'
import WhitePillButton from "../Buttons/wpillbutton"
import EventGrid from "../Events/eventgrid"
import axios from "axios"

// props.profile -- either current user's profile or another user's
const CardContent = (props) => {
    const context = useContext(Context)
    const disabled = !(context.profile && (props.profile.uid === context.profile.uid));
    const gradYearOptions = [
        'Class of 2021',
        'Class of 2022',
        'Class of 2023',
        'Class of 2024',
        'Gap Year',
    ];

    const userInfo = useRef({
        first_name: props.profile.first_name,
        last_name: props.profile.last_name,
        uni: props.profile.school,
        major: props.profile.major
    });

    const [dropDown, setDropDown] = useState(false);
    const [gradYear, setGradYear] = useState(props.profile.grad_year);
    const [edited, setEdited] = useState(false);

    const [events, setEvents] = useState(null);

    useEffect(() => {
        if (context.profile && context.profile.uid === props.profile.uid && !context.rEvents) {
            axios
                .get(`/api/users/${context.profile.uid}/events/live`)
                .then(res => {
                    res.data = res.data.map(event => {
                        if (context.profile.uid === event.host_id)
                            event.border = true;
                        return event;
                    });
                    context.handleSetREvents(res.data);
                })
                .catch(err => console.log(err.response.data.err));
        }
        
        if (props.profile && !events) {
            axios
                .get(`/api/users/${props.profile.uid}/events/live`)
                .then(res => {
                    res.data = res.data.map(event => {
                        if (props.profile.uid === event.host_id)
                            event.border = true;
                        return event;
                    });
                    context.handleSetLEvents(res.data);
                })
                .catch(err => console.log(err.response.data.err));
        }

        if (context.profile && context.profile.uid === props.profile.uid && context.rEvents)
            setEvents([...context.rEvents]);
        else if (context.lEvents)
            setEvents([...context.lEvents]);

    }, [props.profile, context.profile, context.lEvents, context.rEvents, context.myEvents]);

    const toggleDropDown = () => {
        setDropDown(!dropDown)
    }

    // for "Browse events" button
    const closeCard = () => {
        if (window.location.pathname === "/" || window.location.pathname ===  "" || window.location.pathname === "/index")
            context.handleCloseCard(true, true);
        else
            window.location.href="/"
    }

    const handleSelectGradYear = (selection) => {
        setGradYear(selection);
        setEdited(true);
        setDropDown(false);
    }

    const saveUserInfo = () => {
        const uid = context.profile.uid;
        const updated_fields = {
            first_name: userInfo.current.first_name,
            last_name: userInfo.current.last_name,
            school: userInfo.current.uni,
            grad_year: gradYear,
            major: userInfo.current.major
        }

        context.handleUpdateProfile(uid, updated_fields);
        setEdited(false);
    }

    return (       
        <>
        <div className="md-shadow sm:px-8 px-6 pb-0 pt-2 rounded-2xl">
            <ContentEditable
                disabled={disabled}
                html={userInfo.current.first_name}
                onChange={(e) => {userInfo.current.first_name=e.target.value; setEdited(true)}} 
                placeholder={"First Name"}
                className="text-5xl leading-none mb-4 focus:outline-none"
            />
            <ContentEditable
                disabled={disabled}
                html={userInfo.current.last_name}
                onChange={(e) => {userInfo.current.last_name=e.target.value; setEdited(true)}} 
                placeholder={"Last Name"}
                className="text-5xl leading-none mb-4 focus:outline-none"
            />

            {!disabled && !context.profile.isVerified
                ? <div className="text-sm text-red-600">Please verify your account via email before using Schefs.us</div>
                : null
            }
            <div className="flex space-x-2">
                <ContentEditable
                    disabled={disabled}
                    html={userInfo.current.uni}
                    onChange={(e) => {userInfo.current.uni=e.target.value; setEdited(true)}} 
                    placeholder={"Your University"}
                    className="focus:outline-none text-sm"
                />
                <ContentEditable
                    disabled={disabled}
                    html={userInfo.current.major}
                    onChange={(e) => {userInfo.current.major=e.target.value; setEdited(true)}} 
                    placeholder={"Your Major"}
                    className="focus:outline-none text-sm"
                />
            </div>
            <div className="relative inline-block text-left text-sm">
                <div>
                    <span className="rounded-md">
                        {disabled
                          ? <>{gradYear}</>
                          : <button id="gradYear" type="button" onClick={toggleDropDown} className="inline-flex justify-center w-full rounded-md bg-white leading-5 hover:text-gray-500 focus:outline-none active:bg-gray-50 active:text-gray-800 transition ease-in-out text-sm duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true" disabled={disabled}>
                                {gradYear}
                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        }
                    </span>
                </div>
            </div>
            <div className={(dropDown ? 'block' : 'hidden') + " w-40 absolute mt-1 rounded-md shadow-lg"}>
                <div className="rounded-md bg-white shadow-xs">
                    <div tabIndex="0" onBlur={() => setDropDown(false)} role="menu" className="focus:outline-none" aria-orientation="vertical" aria-labelledby="options-menu">
                        {gradYearOptions.map(option => <a key={option} onClick={() => handleSelectGradYear(option)} className="block px-2 text-sm hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">{option}</a>)}
                    </div>
                </div>
            </div>
            <div className="flex flex-col text-sm">
                {props.profile.email}
            </div>

            {edited
              ? <button onClick={saveUserInfo} className="flex-col flex px-4 my-2 bg-yellow-200 justify-center items-center bg-transparent focus:outline-none text-xs sm:text-sm text-black hover:bg-black hover:text-white border sm:border-2 border-black rounded-full">SAVE NEW INFO</button>
              : null
            } 

            {events
              ? <>
                  {events.length === 0
                    ? <div className="text-gray-500 mt-6 text-sm">
                          Your upcoming events will be displayed here... so go start reserving tickets already!
                      </div>
                    : null
                  }
                  <a onClick={closeCard} className="underline text-sm cursor-pointer"> 
                      Browse upcoming events
                  </a>

                  {events.length
                    ? <div className="mt-4 text-sm">
                          {disabled
                              ? <>{props.profile.first_name}'s upcoming events:</>
                              : <>My upcoming events:</>
                          }
                          <div id="innerCardContainer" className="overflow-scroll mt-2">
                              <EventGrid isEditable={false} events={events} style="mr-12" gridNum="1"/>
                          </div>
                      </div>
                    : null
                  }
                </>
              : null
            }
        </div>

        {!disabled
          ? <div className="w-11/12 absolute bottom-0 mb-2 ml-4 flex justify-between">
                <WhitePillButton
                    text="MY EVENTS"
                    link="/myevents"
                    padding="px-4"
                    size="xs bg-white sm:text-sm"
                    handleClick={context.handleCloseCard}
                />
                <WhitePillButton
                    text="HOST AN EVENT"
                    link="/eventbuilder"
                    padding="px-4"
                    size="xs bg-white sm:text-sm"
                    handleClick={context.handleCloseCard}
                /> 
                <WhitePillButton
                    text="LOG OUT"
                    link=""
                    padding="px-4"
                    size="xs bg-white sm:text-sm"
                    handleClick={context.handleLogout}
                />
            </div> 
          : null
        }
        </>
    )
}
export default CardContent;

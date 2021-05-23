import React, { useState, useRef, useContext, useEffect } from 'react';
import Context from '../Context/context';
import Switch from '@material-ui/core/Switch';
import ContentEditable from 'react-contenteditable'

import { SentimentSatisfied } from "@material-ui/icons";
import CircularProgress from '@material-ui/core/CircularProgress';
import WhitePillButton from "../Buttons/wpillbutton"
import EventGrid from "../Events/eventgrid"
import axios from "axios"
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';


// props.profile -- either current user's profile or another user's
const CardContent = (props) => {
    const context = useContext(Context)
    const [isEmailPublic, setIsEmailPublic] = useState(context.profile.is_email_public);

    const handlePublicEmailSwitchChange = () => {
        setIsEmailPublic(!isEmailPublic);
        context.handleUpdateProfile(context.profile.uid, {...context.profile, is_email_public: isEmailPublic});
    };

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
        const now = (new Date()).toISOString();
        if (context.profile && context.profile.uid === props.profile.uid && !context.rEvents) {
            axios
                .get(`/api/users/${context.profile.uid}/events/upcoming`)
                .then(res => {
                    res.data = res.data.map((e) => {
                        if (context.profile.uid === e.host_id)
                            e.border = true;
                        if (e.status !== 'approved') {
                            e.opacity = '35%';
                            e.disabled = true;
                        }

                        return e;
                    });
                    context.handleSetREvents(res.data);
                })
                .catch(err => console.log(err.response.data.err));
        }
        
        if (props.profile && !events) {
            axios
                .get(`/api/users/${props.profile.uid}/events/live`)
                .then(res => {
                    res.data = res.data.map((e) => {
                        if (props.profile.uid === e.host_id)
                            e.border = true;
                        return e;
                    });
                    context.handleSetLEvents(res.data);
                })
                .catch(err => console.log(err.response.data.err));
        }

        if (context.profile && context.profile.uid === props.profile.uid && context.rEvents)
            setEvents(context.rEvents.filter((e) => e.time_start > now).sort((e1, e2) => e1.time_start - e2.time_start));
        else if (context.lEvents)
            setEvents(context.lEvents.sort((e1, e2) => e1.time_start - e2.time_start));

    }, [props.profile, context.profile, context.lEvents, context.rEvents]);

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
                className="text-5xl font-bold leading-tight focus:outline-none"
            />
            <ContentEditable
                disabled={disabled}
                html={userInfo.current.last_name}
                onChange={(e) => {userInfo.current.last_name=e.target.value; setEdited(true)}} 
                placeholder={"Last Name"}
                className="text-5xl font-bold leading-none mb-4 focus:outline-none"
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
                    className="focus:outline-none text-sm mr-2"
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
                          ? <>{gradYear} <div>{props.profile.email}</div> </>
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

            {!disabled ? 
                <div className="flex flex-row text-sm items-center">
                        <div>{props.profile.email}</div>
                        <div className="mx-2">
                            <Switch
                                checked={!isEmailPublic}
                                onChange={handlePublicEmailSwitchChange}
                                disableRipple
                                color="default"
                                size="small"
                                name="isEmailPublic"
                            />
                        </div>
                        {isEmailPublic 
                        ? <div className="text-xs">Email private</div>
                        : <div className="text-xs">Email public to Schefs users</div>
                        }
                        
                </div>
            : null
            }

            {edited
              ? <><button onClick={saveUserInfo} className="flex-col flex px-4 my-2 bg-yellow-200 justify-center items-center bg-transparent focus:outline-none text-xs sm:text-sm text-black hover:bg-black hover:text-white border sm:border-2 border-black rounded-full">SAVE NEW INFO</button></>
              : null
            } 

            {events
              ? <>
                  {!disabled && events.length === 0
                    ? <div className="text-gray-500 mt-6 text-sm">
                        Your upcoming events will be displayed here... so go start reserving tickets already!
                      </div>
                    : null
                  }

                  {!disabled
                    ? <>
                        <a onClick={closeCard} className="underline text-sm cursor-pointer"> 
                          Browse upcoming events
                        </a>
                        <a href="mailto:schefs.us@gmail.com" className="ml-4 underline text-sm cursor-pointer"> 
                          Contact Schefs
                        </a>
                      </>
                    : null
                  }

                  {events.length
                    ? <div className="mt-4 text-sm">
                          {disabled
                              ? <>{props.profile.first_name}'s events:</>
                              : <>My upcoming events:</>
                          }
                          <div id="innerCardContainer" className="overflow-scroll mt-2">
                            <EventGrid isEditable={false} events={events} style="mr-4 md:mr-12" gridNum="1"/>
                          </div>
                      </div>
                    : null
                  }
                </>
              : <div className="flex flex-col mt-8">
                  <CircularProgress thickness={3} />
                </div>
            }
        </div>

        {!disabled
          ? <div className="w-11/12 absolute bottom-0 mb-2 ml-4 flex justify-around sm:justify-between">
                <WhitePillButton
                    text="MY EVENTS"
                    link="/myevents"
                    padding="px-4 bg-white"
                    size="sm"
                    handleClick={() => context.handleCloseCard(true, true)}
                />
                <WhitePillButton
                    text="HOST AN EVENT"
                    link="/eventbuilder"
                    padding="bg-white px-4 hidden sm:block"
                    size="sm"
                    handleClick={() => context.handleCloseCard(true, true)}
                /> 
                <WhitePillButton
                    text="LOG OUT"
                    padding="px-4 bg-white"
                    size="sm"
                    handleClick={context.handleLogout}
                />
            </div> 
          : null
        }
        </>
    )
}
export default CardContent;

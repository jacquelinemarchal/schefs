import React, {useEffect, useState, useContext} from "react";
import Link from 'next/link';
import Context from '../Context/context';
import WhitePillButton from '../Buttons/wpillbutton';

const EventThumbnail = (props) => {
    const context = useContext(Context);
    const [link, setLink] = useState('');

    useEffect(() => {
        if (!props.isEditable) {
            setLink(`/events/${props.eid}`) 
        }
        else{
            setLink(`eventbuilder/${props.eid}`)
        }
    }, [])

    return (
        <div className={"col-span-1 mb-4 " + props.style} >
            <a className="cursor-pointer" onClick={context.handleCloseCard} href={link}>
                <div className="relative">
                    <img
                      src={process.env.BASE_URL + props.img_thumbnail}
                      className="mb-2 rounded-2xl"
                      style={{zIndex:-1}}
                    ></img>
                    {props.border
                      ? <div
                          style={{boxShadow: 'inset 0 0 0 4px #FDFE86'}}
                          className="absolute inset-0 w-full h-full mb-2 rounded-2xl"
                        ></div>
                      : null
                    }
                </div>
                <p className="mb-1 text-sm">{props.title}</p> 
                <p className="text-xs">Hosted by {props.host_name.split(' ')[0]} • {props.host_school}<br></br> at {props.time_start}</p>
            </a>

            {props.showAttendees && props.hosts && props.attendees
              ? <>
                  <p>Hosted by:</p>
                  {props.hosts.map(host => 
                    <WhitePillButton
                      text={host.first_name + ' ' + host.last_name}
                      padding="w-full text-left pl-3 py-0.5 mb-1"
                      size="lg"
                      key={props.eid + ' ' + host.uid}
                      handleClick={() => {
                          context.handleSetLeftProfile(host);
                          context.handleOpenCard(true, false);
                      }}
                    />
                  )}
                  <p>Attended by:</p>
                  {props.attendees.map(attendee =>
                    <WhitePillButton
                      text={attendee.first_name + ' ' + attendee.last_name}
                      padding="w-full text-left pl-3 py-0.5 mb-1"
                      size="lg"
                      key={props.eid + ' ' + attendee.uid}
                      handleClick={() => {
                          context.handleSetLeftProfile(attendee);
                          context.handleOpenCard(true, false);
                      }}
                    />
                  )}
                </>
              : null
            }
        </div>
    )
};
export default EventThumbnail;

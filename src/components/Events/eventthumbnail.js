import React, {useEffect, useState, useContext} from "react";
import Link from 'next/link';
import Context from '../Context/context';
import WhitePillButton from '../Buttons/wpillbutton';

const EventThumbnail = (props) => {
    const context = useContext(Context);

    return (
        <div onClick={context.handleCloseCard} className={"cursor-pointer col-span-1 mb-4 " + props.style} >
            <a href={`/events/${props.eid}`}>
                <div className="relative">
                    <img
                      src={process.env.BASE_URL + props.img_thumbnail}
                      className="mb-2 rounded-2xl"
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
                <p className="text-xs">Hosted by {props.host_name} • {props.host_school}<br></br> at {props.time_start}</p>
            </a>
        </div>
    )
};
export default EventThumbnail;

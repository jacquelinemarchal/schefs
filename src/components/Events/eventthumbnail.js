import React, {useEffect, useState, useContext} from "react";
import thumb from "../../../dev/images/e2.jpg"
import Link from 'next/link'
import Context from '../Context/context';

const EventThumbnail = (props) => {
    const context = useContext(Context)

    const checkCard = () => {
        if (context.cardIsOpen)
            context.handleCloseCard();
    }

    return (
        <div onClick={checkCard} className={"cursor-pointer col-span-1 mb-4 " + props.style} >
            <a href={`/events/${props.eid}`}>
                <div>
                    <img src={thumb} className="mb-2 rounded-2xl"></img>
                    <p className="mb-1 text-sm">{props.title}</p> 
                    <p className="text-xs">Hosted by {props.host_name} • {props.host_school}<br></br> at {props.time_start}</p>
                </div>
            </a>
        </div>
    )
};
export default EventThumbnail;

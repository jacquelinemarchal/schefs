import React from "react";
import thumb from "../../../dev/images/e2.jpg"
import Link from 'next/link'

const EventThumbnail = (props) => {
    return (
        <div className="col-span-1 p-2 mb-4">
            <Link href={`events/${encodeURIComponent(props.eid)}`} as={`events/${props.title.replace(/\s/, '_')}`}>
                <div>
                    <img src={thumb} className="mb-2 rounded-2xl"></img>
                    <p className="mb-1 text-sm">{props.title}</p> 
                    <p className="text-xs">Hosted by {props.host_name} • {props.host_school}<br></br> at {props.time_start}</p>
                </div>
            </Link>
        </div>
    )
};
export default EventThumbnail;

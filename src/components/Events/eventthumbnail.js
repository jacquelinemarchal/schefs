import React from "react";
import thumb from "../../../dev/images/e2.jpg"
import Link from 'next/link'

const EventThumbnail = (props) => {
    return (
        <div className="col-span-1 p-2 mb-4">
            <Link href={{
                pathname: `events/${encodeURIComponent(props.eid)}`,
                query: {...props},
            }}>
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

// pass something else to the router on Link tag so that /events/[id]/index.js can properly render correct page :) 
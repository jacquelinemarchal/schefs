import React, {useEffect, useState} from "react";
import thumb from "../../../dev/images/e2.jpg"
import Link from 'next/link'

const EventThumbnail = (props) => {
    const [path, setPath] = useState(``);

    useEffect(() => {
        if (window.location.pathname === "/" || window.location.pathname ===  "" || window.location.pathname === "/index"){
            setPath(`events/${encodeURIComponent(props.eid)}`)
        }
        else {
            setPath(`hi`)
           // TASK: remove earlier part of URL and replace with correct /events/eid\ 
           // Pass card state error: onClick={props.closeCardF()}
        }
    }, [])

    return (
        <div className="cursor-pointer col-span-1 p-2 mb-4" >
            <Link href={{
                pathname: path,
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
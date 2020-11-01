import React from "react";
import thumb from "../../dev/images/e2.jpg"

const EventThumbnail = (props) => {
  return (
    <div className="col-span-1 p-2 mb-4">
        <a href="#">
        <img src={thumb} href="#" className="mb-2 rounded-2xl"></img>
            <p className="mb-1 text-sm">{props.title}</p> 
            <p className="text-xs">Hosted by {props.firstName} • {props.university}<br></br> at {props.time}</p>
        </a>
    </div>
    )
};

export default EventThumbnail;

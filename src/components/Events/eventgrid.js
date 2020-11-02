import React from "react";
import EventThumbnail from "./eventthumbnail"

const EventGrid = (props) => {
    let fakeEvent = {
        title: "How to Code in React",
        firstName: "Jackie",
        university: "Columbia",
        time: "Sunday, December 10, 10am EDT"
    }
  return (
    <div className="mx-4 grid grid-cols-1 sm:grid-cols-3">
            <EventThumbnail {...fakeEvent} />
            <EventThumbnail {...fakeEvent} />
            <EventThumbnail {...fakeEvent} />
            <EventThumbnail {...fakeEvent} />
            <EventThumbnail {...fakeEvent} />
    </div>
    )
};

export default EventGrid;

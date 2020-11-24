import EventThumbnail from "./eventthumbnail"

const EventGrid = (props) => {
    return (
        <div className={"grid grid-cols-1 sm:grid-cols-" + props.gridNum}>
            {props.events.length != 0 ? props.events.map((p, i) => <EventThumbnail {...p} style={props.style} key={i} closeCardF={props.closeCardF} />) : null}
        </div>
    )
};
/*
    let fakeEvent = {
        title: "How to Code in React",
        host_name: "Jackie",
        host_school: "Columbia",
        time_start: "Sunday, December 10, 10am EDT"
    }
    <EventThumbnail {...fakeEvent} />

    Pass Card State: props.events.length != 0 && props.closeCardF 
*/
export default EventGrid;

import EventThumbnail from "./eventthumbnail"

const EventGrid = (props) => {
    const array = Object.entries(props)
    return (
        <div className={"mx-6 grid grid-cols-1 sm:grid-cols-" + props.gridNum}>
            {array.length != 0 ? array.map((p, i) => (<EventThumbnail {...p[1]} key={i} />)) : null}
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
*/
export default EventGrid;

import EventThumbnail from "./eventthumbnail"

const EventGrid = (props) => {
    return (
        <div className={"grid grid-cols-1 sm:grid-cols-" + props.gridNum + ' ' + props.margin}>
            {props.events.length != 0 
              ? props.events.map(p =>
                  <EventThumbnail
                    {...p}
                    isEditable={props.isEditable}
                    style={props.style}
                    border={p.border}
                    key={-p.eid}
                    closeCardF={props.closeCardF}
                    showAttendees={Boolean(props.showAttendees)}
                  />
                )
              : null
            }
        </div>
    )
};
export default EventGrid;

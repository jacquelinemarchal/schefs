import EventThumbnail from "./eventthumbnail"

const EventGrid = (props) => {
    return (
        <div className={"duration-300 grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-" + props.gridNum + ' ' + props.margin}>
            {props.events.length != 0 
              ? props.events.map((e) =>
                  <EventThumbnail
                    {...e}
                    isEditable={props.isEditable}
                    style={props.style}
                    border={e.border}
                    key={-e.eid}
                    closeCardF={props.closeCardF}
                    showAttendees={Boolean(props.showAttendees)}
                    photoOpacity={props.photoOpacity}
                    opacity={e.opacity}
                    disabled={e.disabled}
                  />
                )
              : null
            }
        </div>
    )
};
export default EventGrid;

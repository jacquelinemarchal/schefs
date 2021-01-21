import EventThumbnail from "./eventthumbnail"

const EventGrid = (props) => {
    return (
        <div className={"grid grid-cols-1 sm:grid-cols-" + props.gridNum}>
            {props.events.length != 0 
              ? props.events.map(p =>
                  <EventThumbnail
                    {...p}
                    style={props.style}
                    border={p.border}
                    key={-p.eid}
                    closeCardF={props.closeCardF}
                  />
                )
              : null
            }
        </div>
    )
};
export default EventGrid;

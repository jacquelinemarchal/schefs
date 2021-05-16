import React, { useContext } from 'react';
import moment from 'moment-timezone';

import Link from 'next/link';
import Context from '../Context/context';
import WhitePillButton from '../Buttons/wpillbutton';

const EventThumbnail = (props) => {
    const context = useContext(Context);

    // get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';

    return (
        <div className={"col-span-1 mb-8 " + props.style} style={{opacity: props.opacity}}>
            <a
              className={props.disabled ? '' : 'cursor-pointer'}
              onClick={props.disabled ? null : context.handleCloseCard}
              href={
                props.disabled
                  ? null
                  : props.isEditable
                    ? `/eventbuilder/${props.eid}`
                    : `/events/${props.eid}`
              }
            >
              <div className="relative">
                  <img
                    src={process.env.BASE_URL + props.img_thumbnail}
                    className="mb-2 rounded-2xl"
                    style={{opacity: props.photoOpacity}}
                  ></img>
                  {props.border
                    ? <div
                        style={{boxShadow: 'inset 0 0 0 4px #FDFE86'}}
                        className="absolute inset-0 w-full h-full mb-2 rounded-2xl"
                      ></div>
                    : null
                  }
              </div>
              <p className="mb-1 text-xl sm:text-base">{props.title}</p> 
              <p className="text-base sm:text-sm">
                  Hosted by {props.host_name.split(' ')[0]} • {props.host_school}<br/>
                  {moment(props.time_start).tz(timezone).format('dddd, MMMM D @ h:mm A z')}
              </p>
            </a>

            {props.showAttendees && props.hosts && props.attendees
              ? <>
                  <p className="mt-2">Hosted by:</p>
                  {props.hosts.map(host => 
                    <WhitePillButton
                      text={host.first_name + ' ' + host.last_name}
                      padding="w-full text-left pl-3 py-0.5 mb-1"
                      size="lg"
                      key={props.eid + ' ' + host.uid}
                      handleClick={() => {
                          context.handleSetLeftProfile(host);
                          context.handleOpenCard(true, false);
                      }}
                    />
                  )}
                  <p>Attended by:</p>
                  {props.attendees.map(attendee =>
                    <WhitePillButton
                      text={attendee.first_name + ' ' + attendee.last_name}
                      padding="w-full text-left pl-3 py-0.5 mb-1"
                      size="lg"
                      key={props.eid + ' ' + attendee.uid}
                      handleClick={() => {
                          context.handleSetLeftProfile(attendee);
                          context.handleOpenCard(true, false);
                      }}
                    />
                  )}
                </>
              : null
            }
        </div>
    )
};
export default EventThumbnail;

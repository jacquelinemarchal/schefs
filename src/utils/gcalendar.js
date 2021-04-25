const { google } = require('googleapis');
const credentials = require(process.env.GOOGLE_CALENDAR_CREDENTIALS);

const TIMEZONE = 'America/New_York';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar('v3');

const auth = new OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
);

auth.setCredentials({refresh_token: credentials.refresh_token});

exports.createGcalEvent = async (event_name, host_name, host_email, description, zoom_link, zoom_id, start_time, end_time) => {
    const gcal_event = {
        summary: event_name,
        location: zoom_link,
        description: `
            <html>
              A Schefs event hosted by ${host_name}.
              <br><br>
              ${description}
              <br><br>
              Meeting Link: <a href=${zoom_link}>${zoom_link}</a><br>
              Meeting ID: ${zoom_id}
            </html>`,
        start: {
            dateTime: start_time.toISOString(),
            timeZone: TIMEZONE
        },
        end: {
            dateTime: end_time.toISOString(),
            timeZone: TIMEZONE,
        },
        attendees: [{ email: host_email }],
        guestsCanSeeOtherGuests: false,
        reminders: { useDefault: false },
    };

    let gcal_id = false;
    await calendar.events.insert({
        auth: auth,
        calendarId: CALENDAR_ID,
        resource: gcal_event
    }, (err, event) => {
        if (err)
            console.log(err);

        gcal_id = event.data.id;
    });

    return gcal_id;
};

exports.addAttendeeToGcalEvent = async (gcal_id, attendee_email) => {
    const gcal_event = await calendar.events.get({
        auth: auth,
        calendarId: CALENDAR_ID,
        eventId: gcal_id,
    });

    let attendees = gcal_event.data.attendees;
    if (!attendees) attendees = [];

    attendees.push({email: attendee_email});

    const gcal_event_patch = {attendees: attendees};

    let success = false;
    await calendar.events.patch({
        auth: auth,
        calendarId: CALENDAR_ID,
        eventId: encoded_id,
        resource: gcal_event_patch,
    }, (err, event) => {
        if (err) console.log(err);
        else success = true;
    });

    return success;
};

exports.deleteGcalEvent = async (gcal_id) => {
    let success = false;
    await calendar.events.delete({
        auth: auth,
        calendarId: CALENDAR_ID,
        eventId: gcal_id, 
    }, (err, event) => {
        if (err) console.log(err);
        else success = true;
    });

    return success;
}

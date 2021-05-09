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
              <p>
                A Schefs event hosted by ${host_name}.
                <br><br>
                ${description}
                <br><br>
                Meeting Link: <a href=${zoom_link}>${zoom_link}</a><br>
                Meeting ID: ${zoom_id}
              </p>
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

    try {
        const res = await calendar.events.insert({
            auth: auth,
            calendarId: CALENDAR_ID,
            resource: gcal_event
        });

        return res.data.id;
    } catch (err) {
        console.log(err);
        return false;
    }
};

exports.updateGcalEvent = async (gcal_id, gcal_event_patch) => {
    try {
        const res = await calendar.events.patch({
            auth: auth,
            calendarId: CALENDAR_ID,
            eventId: gcal_id,
            resource: gcal_event_patch,
        });

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
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

    try {
        const res = await calendar.events.patch({
            auth: auth,
            calendarId: CALENDAR_ID,
            eventId: gcal_id,
            resource: gcal_event_patch,
        });

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

exports.deleteGcalEvent = async (gcal_id) => {
    let success = false;
    try {
        const res = await calendar.events.delete({
            auth: auth,
            calendarId: CALENDAR_ID,
            eventId: gcal_id, 
        });

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

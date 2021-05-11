const schedule = require('node-schedule');
const pool = require('./db');
const queries = require('./queries/reminders');

exports.schedule = async (time_send, type, email, first_name, event_title, zoom_link=null, rid=null) => {
    const values = [
        time_send,
        type,
        email,
        first_name,
        event_title,
        zoom_link
    ];

    try {
        // if not already in PSQL, add a new entry
        if (!rid)
            rid = (await pool.query(queries.setReminder, values)).rows[0].rid;
        
        schedule.scheduleJob(time_send, async () => {
            try {
                if (type === '24h') {
                    emails.send24HourReminderEmail(
                        email,
                        first_name,
                        event_title
                    );
                } else if (type === '30m') {
                    emails.send30MinuteReminderEmail(
                        email,
                        first_name,
                        event_title,
                        zoom_link
                    );
                } else if (type === 'post') {
                    email.sendPostEventEmail(
                        email,
                        first_name,
                        event_title
                    );
                } else
                    throw 'Failed to schedule reminder: Missing reminder type';

                await pool.query(queries.deleteReminder, [ rid ]);
            } catch (err) {
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

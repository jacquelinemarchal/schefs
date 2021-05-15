const getReminders = `
    SELECT * FROM reminders
`;

/*
 * $1: time_send     <Date>
 * $2: email_type    <string>
 * $3: email_address <string>
 * $4: first_name    <string>
 * $5: event_title   <string>
 * $6: zoom_link     <string || null>
 */
const setReminder = `
    INSERT INTO reminders (
        time_send,
        email_type,
        email_address,
        first_name,
        event_title,
        zoom_link
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
    ) RETURNING rid
`;

/*
 * $1: rid <int>
 */
const deleteReminder = `
    DELETE FROM reminders
    WHERE rid = $1
`;

module.exports = {
    getReminders,
    setReminder,
    deleteReminder,
};

const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const payload = {
    iss: process.env.ZOOM_API_KEY,
    exp: ((new Date()).getTime() + 5000),
};
const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);

const baseOptions = {
    baseURL: 'https://api.zoom.us/v2/',
    headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },
};

exports.getLiveMeetings = async (page_size=300) => {
    if (page_size > 300 || page_size < 1)
        throw new Error('page_size must be between 1 and 300');

    const options = {
        ...baseOptions, 
        params: { page_size: page_size },
    };

    try {
        res = await axios.get('/users/me/meetings', options);
        return res.data.meetings;
    } catch (err) {
        console.log(err);
        return false;
    }
}

exports.createMeeting = async (title, time_start) => {

    const start_time = moment(time_start).utc().format();

    const data = {
        topic: title,
        type: 2, // scheduled meeting
        start_time: start_time,
        duration: 105, // 1:45 length meeting
        settings: {
            join_before_host: true,
            jbh_time: 10,
        }
    };

    try {
        res = await axios.post('/users/me/meetings', data, baseOptions);
        return {
            id: res.data.id,
            url: res.data.join_url,
        };
    } catch (err) {
        console.log(err);
        return false;
    }
}

exports.updateMeeting = async (meeting_id, title, time_start, duration=null) => {
    if (!meeting_id)
        throw new Error('Must pass valid meeting_id');

    const start_time = moment(time_start).utc().format();

    const data = {}
    if (title)
        data.title = title;
    if (time_start)
        data.start_time = time_start;
    if (duration)
        data.duration = duration;

    try {
        res = await axios.patch('/meetings/' + meeting_id, data, baseOptions);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

exports.endMeeting = async (meeting_id) => {
    const data = {
        action: 'end'
    };

    try {
        res = await axios.put('/meetings/' + meeting_id + '/status', data, baseOptions);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

exports.deleteMeeting = async (meeting_id) => {
    const options = {
        ...baseOptions,
        params: {
            schedule_for_reminder: false,
            cancel_meeting_reminder: false,
        },
    };

    try {
        await axios.delete('/meetings/' + meeting_id, options);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

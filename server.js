const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routers = require('./src/routes')

const pool = require('./src/utils/db');
const rs = require('./src/utils/reminders');
const queries = require('./src/utils/queries/reminders');

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

const port = normalizePort(process.env.PORT || '5000');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    // check for reminder emails not yet sent
    pool.query(queries.getReminders, (q_err, q_res) => {
        if (q_err)
            console.log(q_err.message);
        else {
            const reminders = q_res.rows;
            for (r of reminders) {
                rs.schedule(
                    r.time_send,
                    r.email_type,
                    r.email_address,
                    r.first_name,
                    r.event_title,
                    r.zoom_link,
                    r.rid
                );
            }
        }
    });


    // boot server
    const server = express();
    
    server.use(express.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());
    server.use(cors({
        origin: true,
        credentials: true,
        methods: [ 'GET', 'PUT', 'POST', 'DELETE' ],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization'
        ]
    }));

    server.use('/api/events', routers.eventsRouter);
    server.use('/api/openmind', routers.openMindRouter);
    server.use('/api/users', routers.usersRouter);
    server.use('/api/thumbnails', routers.thumbnailsRouter);

    if (dev)
        server.use(express.static('public'));

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});


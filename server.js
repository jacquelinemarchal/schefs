const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
const routers = require('./src/routes')

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

    server.use('/api/tickets', routers.ticketsRouter);

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});


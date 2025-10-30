/* server.js
 * Express + Socket.IO v4
 */

'use strict';


require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');

const config = require('./config');


const configureMiddleware = require('./middleware');
const configureRoutes = require('./routes');
const siweRoutes = require('./routes/siwe');


const { Server: IOServer } = require('socket.io');
const socketAuth = require('./socket/auth');
const gameSocket = require('./socket');


const requiredEnv = ['PORT', 'NODE_ENV'];
for (const key of requiredEnv) {
    if (!config[key]) {
        console.warn(`[config] Missing ${key}. Using fallback/default if provided.`);
    }
}

//
// ---- Inicialización Express ----
const app = express();


app.set('trust proxy', 1);
configureMiddleware(app);
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), env: config.NODE_ENV });
});
app.get('/ready', (_req, res) => {
    res.status(200).json({ ready: true });
});
app.use('/api/siwe', siweRoutes);


configureRoutes(app);


// ---- Servidor HTTP + Socket.IO ----
const httpServer = http.createServer(app);


const io = new IOServer(httpServer, {
    cors: {
        origin: [config.CLIENT_ORIGIN, 'http://localhost:3000', 'http://192.168.1.15:3000', '*'],
        methods: ['GET', 'POST'],
        credentials: true,
    },

});

socketAuth(io);

io.on('connection', (socket) => {
    try {
        console.log(`[socket.io] client connected: ${socket.id}`);
        gameSocket.init(socket, io);
    } catch (e) {
        console.error('[socket] error during init:', e);
        socket.disconnect(true);
    }
});

//
// ---- Arranque del servidor ----
const PORT = Number(config.PORT) || 7777;

let serverUp = false;
httpServer.listen(PORT, () => {
    serverUp = true;
    console.log(`[server] Listening on port ${PORT} — env: ${config.NODE_ENV || 'development'}`);
});


// (async () => {
//   try {
//     await connectDB();
//     console.log('[db] connected');
//   } catch (err) {
//     console.error('[db] connection error:', err);
//     process.exit(1);
//   }
// })();

//
// ---- Manejo de errores global ----
process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason);
    shutdown(1);
});

process.on('uncaughtException', (err) => {
    console.error('[uncaughtException]', err);
    shutdown(1);
});

process.on('SIGINT', () => {
    console.log('[signal] SIGINT');
    shutdown(0);
});

process.on('SIGTERM', () => {
    console.log('[signal] SIGTERM');
    shutdown(0);
});

function shutdown(code) {
    try {
        io.close();
    } catch (_) { }

    if (serverUp) {
        httpServer.close(() => {
            console.log('[server] closed');
            process.exit(code);
        });


        setTimeout(() => {
            console.warn('[server] forced shutdown');
            process.exit(code);
        }, 5000).unref();
    } else {
        process.exit(code);
    }
}

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('./logger.js');
const requestIdMiddleware = require('./reqId.middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(requestIdMiddleware);
app.use((req, res, next) => {
    logger.info({
        message: 'Incoming request at gateway',
        method: req.method,
        url: req.originalUrl,
        requestId: req.requestId,
        body: req.body
    });
    req.headers['x-request-id'] = req.requestId;
    next();
});

app.get('/ping', (req, res) => {
    res.json({ message: 'pong (jenkins)' });
});

app.use('/api/auth-service', createProxyMiddleware({
    target: 'http://auth-service:3003',
    changeOrigin: true,
    pathRewrite: {'^/api/auth-service': '/'},
    onProxyReq: (proxyReq, req, res) => {
        if (req.requestId) {
            proxyReq.setHeader('X-Request-Id', req.requestId);
        }
    }
}));


app.use('/api/order-service', createProxyMiddleware({
        target: 'http://order-service:3001',
        changeOrigin: true,
        pathRewrite: {'^/api/order-service': '/'},
        onProxyReq: (proxyReq, req, res) => {
            if (req.requestId) {
                proxyReq.setHeader('X-Request-Id', req.requestId);
            }
        }
}));

app.use('/api/notification-service', createProxyMiddleware({
    target: 'http://notification-service:3002',
    changeOrigin: true,
    pathRewrite: {'^/api/notification-service': '/'},
    onProxyReq: (proxyReq, req, res) => {
        if (req.requestId) {
            proxyReq.setHeader('X-Request-Id', req.requestId);
        }
    }
}))


app.use(express.json());
app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
});


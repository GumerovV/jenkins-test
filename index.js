const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const requestIdMiddleware = require('./reqId.middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(requestIdMiddleware);

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
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


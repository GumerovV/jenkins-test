const winston = require('winston');
require('winston-logstash');

const logger = new (winston.Logger)({
    level: 'info',
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: false
        }),
        new (winston.transports.Logstash)({
            port: parseInt(process.env.LOGSTASH_PORT, 10) || 5001,
            host: process.env.LOGSTASH_HOST || 'logstash',
            node_name: process.env.SERVICE_NAME || 'gateway'
        })
    ]
});

logger.on('error', function (err) {
    console.error('Logstash transport error:', err);
});

module.exports = logger;

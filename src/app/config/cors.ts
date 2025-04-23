/**
 * packages
 */
import Common from '@core/common';

const CorsConfig = {
    socket: {
        origin: [Common.baseUrl()],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            'Authorization',
            'Content-Type',
            'X-Requested-With',
            'Accept',
            'Origin',
        ],
        credentials: true,
    },
};

export default CorsConfig;

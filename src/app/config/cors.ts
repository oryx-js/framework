/**
 * packages
 */
import Common from '@core/common';

const CorsConfig = {
    socket: {
        origin: [Common.baseUrl()],
        credentials: true,
    },
};

export default CorsConfig;

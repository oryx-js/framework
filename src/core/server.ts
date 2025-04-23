/**
 * packages
 */
import http from 'http';
import Common from '@core/common';
import CoreExpress from '@core/express';

class CoreServer {
    public static server: http.Server = http.createServer(CoreExpress.express);
    private static serverPort: number = Number(
        Common.env<number>('APP_PORT', 3000),
    );
    private static serverUrl: string = Common.env<string>(
        'APP_URL',
        'http://localhost:3000',
    );

    public static start() {
        this.server.listen(this.serverPort, () => {
            Common.logger(
                'log',
                'SERVER',
                `Server is already running : ${this.serverUrl}`,
            );
        });
    }
}

export default CoreServer;

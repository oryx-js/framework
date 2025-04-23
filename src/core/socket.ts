/**
 * packages
 */
import { Server } from 'socket.io';
import CoreServer from '@core/server';
import CorsConfig from '@app/config/cors';

class CoreSocket {
    public static io: Server = new Server(CoreServer.server, {
        cors: CorsConfig.socket,
    });
}

export default CoreSocket;

/**
 * packages
 */
import CoreExpress from '@core/express';
import CoreServer from '@core/server';
import Database from '@core/typeorm';
import Common from '@core/common';

class CoreBoot {
    public static run() {
        Database.init()
            .then(() => {
                CoreExpress.start();
                CoreServer.start();
            })
            .catch((error: any) => {
                Common.logger('error', 'BOOT', `Failed to initialize application: ${error}`)
                process.exit(1);
            });
    }
}

export default CoreBoot;

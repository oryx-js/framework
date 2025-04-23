/**
 * packages
 */
import express, { Express, Router } from 'express';
import cookieParser from 'cookie-parser';
import Routes from '@core/routes';
import path from 'path';

class CoreExpress {
    public static express: Express = express();
    private static router: Router = express.Router();

    public static start() {
        this.middlewares();
        this.routes();
    }

    private static async middlewares() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(cookieParser());
        this.express.set('/static', express.static(path.join(__dirname, '../../public/static')))
        this.express.set('views engine', 'ejs');
        this.express.set('views', path.join(__dirname, '../../public/views'))
        await import('@app/http/middlewares/register');
    }

    private static async routes() {
        await import('@app/routes/register');
        Routes.apply(this.router);
        this.express.use(this.router);
    }
}

export default CoreExpress;

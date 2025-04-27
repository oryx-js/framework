/**
/**
 * packages
 */
import express, { Express, Router } from 'express';
import cookieParser from 'cookie-parser';
import Routes from '@core/routes';
import ExpressConfig from '@app/config/express';
import multer from 'multer';
import Cookie from '@core/cookie';
import ejs from 'ejs';
import RegisterMiddlewares from '@app/http/middlewares/register';

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
        this.express.use((req, res, next) => {
            Cookie.init(req, res);
            next();
        });
        this.express.use(ExpressConfig.static.route, express.static(ExpressConfig.static.path));
        ejs.delimiter = "?";
        this.express.set('view engine', ExpressConfig.view.engine);
        this.express.set('views', ExpressConfig.view.path);
        this.express.use((req, res, next) => {
            req.upload = multer({
                storage: ExpressConfig.multer.storage,
                limits: ExpressConfig.multer.limits,
                fileFilter: ExpressConfig.multer.fileFilter,
            });
            next();
        });
        RegisterMiddlewares.set(this.express)
    }

    private static async routes() {
        await import('@app/routes/register');
        Routes.apply(this.router);
        this.express.use(this.router);
    }
}

export default CoreExpress;

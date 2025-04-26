/**
 * packages
 */
import path from 'path';
import multer from 'multer';

const ExpressConfig = {
    view: {
        engine: 'ejs',
        path: path.join(__dirname, '../../../public/views'),
    },
    static: {
        route: '/static',
        path: path.join(__dirname, '../../../public/static'),
    },
    multer: {
        storage: multer.diskStorage({
            destination: path.join(__dirname, '../../../public/static/file'),
        }),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: multer.FileFilterCallback,
        ) => {
            if (!file.mimetype.startsWith('image/')) {
                cb(new Error(`Only image formats are allowed`));
            } else {
                cb(null, true);
            }
        },
    },
};

export default ExpressConfig;

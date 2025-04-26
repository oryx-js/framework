// /**
//  * packages
//  */
// import { Request, Response, NextFunction } from 'express';
// import Common from '@core/common';

// class SampleMiddleware {
//     public static async handle(
//         req: Request,
//         res: Response,
//         next: NextFunction,
//     ): Promise<void> {
//         Common.handler(
//             async () => {
//                 const origin = Common.extractUrl(
//                     req.headers.origin || Common.baseUrl(),
//                     'host',
//                 ) as string;

//                 // 🛡️ Origin check
//                 const allowedOrigins = ['http://localhost:3456/'];

//                 const isAllowed = origin && allowedOrigins.includes(origin);

//                 if (isAllowed) {
//                     res.header(
//                         'Access-Control-Allow-Origin',
//                         req.headers.origin as string,
//                     );
//                     res.header('Access-Control-Allow-Methods', '*');
//                     res.header(
//                         'Access-Control-Allow-Headers',
//                         'Origin, X-Requested-With, Content-Type, Accept, Authorization, ApiKey',
//                     );
//                     res.header('Access-Control-Allow-Credentials', 'true');
//                 } else {
//                     return Common.resJson(
//                         res,
//                         false,
//                         403,
//                         'Forbidden: Origin not allowed',
//                         {
//                             origin,
//                         },
//                     );
//                 }

//                 // 🧼 CORS preflight
//                 if (req.method === 'OPTIONS') {
//                     return Common.resJson(
//                         res,
//                         true,
//                         204,
//                         'CORS preflight accepted',
//                         {},
//                     );
//                 }

//                 next();
//             },
//             (err) => {
//                 return Common.resJson(
//                     res,
//                     false,
//                     500,
//                     'CORS middleware failed',
//                     {
//                         detail: err instanceof Error ? err.message : err,
//                     },
//                 );
//             },
//         );
//     }
// }

// export default SampleMiddleware;

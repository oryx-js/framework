// /**
//  * packages
//  */
// import Common from '@core/common';
// import SampleEntity from '@app/database/entities/sample.entity';
// import CoreDate from '@core/date';

// export default async () => {
//     await Common.executeSeed({
//         entity: SampleEntity,
//         data: [
//             {
//                 id: 1,
//                 token: Common.md5(
//                     Common.randomAlphaNumeric(32) + CoreDate.create(),
//                 ),
//                 expire: CoreDate.create().add(1, 'months').toDate(),
//                 url: 'http://localhost:3456/',
//             },
//         ],
//     });
// };

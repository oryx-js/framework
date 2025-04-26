// /**
//  * packages
//  */
// import Common from '@core/common';
// import SampleRepository from '@app/database/repositories/sample.repository';

// class SampleService {
//     public static async allData() {
//         return Common.handler(async () => {
//             const data = await SampleRepository.all()
//             return Common.rawJson(true, 200, 'Success', data)
//         }, (err) => {
//             return Common.rawJson(false, 500, err?.message || err)
//         })
//     }
// }

// export default SampleService

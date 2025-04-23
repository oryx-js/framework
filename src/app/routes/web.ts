/**
 * packages
 */
import { HttpContext } from '@type/core.routes';
import Routes from '@core/routes'
import Common from '@core/common';

Routes.get('/', ({ res }: HttpContext) => {
    Common.resJson(res, true, 200, 'Success');
})

import * as LogController from './LogController';
import { RATE_LIMIT } from '../../utils/enums';
import { Router } from 'express';
import { USER_ROLE } from '../user/UserEnums';
import { authMiddleware } from '../../middleware/authMiddleware';
import { getLogsSchema } from './schemas/getLogsSchema';
import { rateLimiterMiddleware } from '../../middleware/rateLimiterMiddleware';
import { roleMiddleware } from '../../middleware/roleMiddleware';
import { validationMiddleware } from '../../middleware/validationMiddleware';

const LogRoutes: Router = Router();

LogRoutes.get(
  '',
  [
    rateLimiterMiddleware(RATE_LIMIT.DEFAULT),
    authMiddleware,
    roleMiddleware([USER_ROLE.ADMIN]),
    validationMiddleware(getLogsSchema),
  ],
  LogController.getLogs
);

export default LogRoutes;

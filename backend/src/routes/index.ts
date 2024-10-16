import { Router } from 'express';
import userRouter from './userRoutes';
import vendorRouter from './vendorRoutes';

const rootRouter = Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/vendors', vendorRouter);

export default rootRouter;

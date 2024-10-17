import { Router } from 'express';
import userRouter from './userRoutes/userRoutes';
import vendorRouter from './vendorRoutes/vendorRoutes';
import adminRouter from './adminRoutes/adminRoutes';

const rootRouter = Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/vendors', vendorRouter);
rootRouter.use('/admin', adminRouter);

export default rootRouter;

import { Router } from 'express';
import userRouter from './userRoutes';

const rootRouter = Router();
rootRouter.use('/users', userRouter);

export default rootRouter;

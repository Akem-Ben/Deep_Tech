import express from 'express';
import { joiValidators } from '../../validations';
import { userAuthController } from '../../controllers';

const router = express.Router();

router.post('/email-signup', joiValidators.inputValidator(joiValidators.userRegisterSchemaViaEmail), userAuthController.userRegisterWithEmail)
router.post('/email-login', joiValidators.inputValidator(joiValidators.loginUserSchemaViaEmail), userAuthController.userLoginWithEmail)

export default router;
import express from 'express';
import { joiValidators } from '../../validations';
import { userAuthController } from '../../controllers';

const router = express.Router();

router.post('/email-signup', joiValidators.inputValidator(joiValidators.userRegisterSchemaViaEmail), userAuthController.userRegisterWithEmail)

export default router;
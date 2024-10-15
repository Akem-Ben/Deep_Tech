import {Request, Response} from 'express';
import {userAuthService} from '../../services';
import { responseUtilities } from '../../utilities';


const userRegisterWithEmail = async(request:Request, response:Response):Promise<any> => {

        const newUser:any = await userAuthService.userRegistrationService(request.body)

        return responseUtilities.responseHandler(response, newUser.message, newUser.statusCode, newUser.data)
}

const userLoginWithEmail = async(request:Request, response:Response):Promise<any> => {

   const loggedInUser:any = await userAuthService.userLogin(request.body)

   return responseUtilities.responseHandler(response, loggedInUser.message, loggedInUser.statusCode, loggedInUser.data)

}

export default {
    userRegisterWithEmail,
    userLoginWithEmail
}

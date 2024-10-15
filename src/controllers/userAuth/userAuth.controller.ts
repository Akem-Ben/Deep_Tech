import {Request, Response} from 'express';
import {userAuthService} from '../../services';
import { responseUtilities } from '../../utilities';


const userRegisterWithEmail = async(request:Request, response:Response):Promise<any> => {
    try{

        const newUser:any = await userAuthService.userRegistrationService(request.body)


            return responseUtilities.responseHandler(response, newUser.message, newUser.statusCode, newUser.data)

    }catch(error:any){
        return responseUtilities.responseHandler(response, error, 500)
    }
}

export default {
    userRegisterWithEmail
}

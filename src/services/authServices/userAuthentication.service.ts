import { ResponseDetails } from '../../types/utilities.types';
import validator from 'validator';
import {userDatabase, generalHelpers} from '../../helpers';
import { mailUtilities } from '../../utilities';


const userRegistrationService = async (userPayload: Record<string, any>):Promise<any> => {
    try{

        const responseHandler:ResponseDetails = {
            statusCode: 0,
            message: ""
        }


    const {
        name,
        email,
        password,
        phone
    } = userPayload

    if(!validator.isMobilePhone(phone, 'en-NG')){
        responseHandler.statusCode = 400;
        responseHandler.message = "Invalid phone number";
        return responseHandler
    }

    if(!validator.isEmail(email)){
        responseHandler.statusCode = 400;
        responseHandler.message = "Invalid email";
        return responseHandler
    }

    const existingUser = await userDatabase.userDatabaseHelper.getOne({ email });
    if (existingUser) {
        responseHandler.statusCode = 400;
        responseHandler.message = "User already exists with this email";
        return responseHandler;
    }

    const payload = {
        name,
        email,
        password,
        phone,
        role: 'User'
    }

    const newUser = await userDatabase.userDatabaseHelper.create(payload)

    const tokenPayload = {
        userId: newUser._id,
        role: newUser.role,
        email: newUser.email
    }

    const verificationToken = await generalHelpers.generateTokens(tokenPayload, '1h')

    await mailUtilities.sendMail(newUser.email, verificationToken)

    responseHandler.statusCode = 201;
    responseHandler.message = "User registered successfully";
    responseHandler.data = newUser;
    return responseHandler;

}catch(error:any){

    const responseHandler: ResponseDetails = {
        statusCode: 500,
        message: `${error.message}`
    };
    return responseHandler;
}

}


const adminRegistrationService = async ({userPayload}: Record<string, any>) => {
    try{

        const responseHandler:ResponseDetails = {
            statusCode: 0,
            message: ""
        }

    const {
        name,
        email,
        password,
        phone
    } = userPayload

    if(!validator.isMobilePhone(phone, 'en-NG')){
        responseHandler.statusCode = 400;
        responseHandler.message = "Invalid phone number";
        return responseHandler
    }

    if(!validator.isEmail(email)){
        responseHandler.statusCode = 400;
        responseHandler.message = "Invalid email";
        return responseHandler
    }

    const existingUser = await userDatabase.userDatabaseHelper.getOne({ email });
    if (existingUser) {
        responseHandler.statusCode = 400;
        responseHandler.message = "Admin already exists with this email";
        return responseHandler;
    }

    const payload = {
        name,
        email,
        password,
        phone,
        role: 'Admin',
        isVerified: true
    }

    const newUser = await userDatabase.userDatabaseHelper.create(payload)

    responseHandler.statusCode = 201;
    responseHandler.message = "Admin registered successfully";
    responseHandler.data = newUser;
    return responseHandler;

}catch(error:any){

    const responseHandler: ResponseDetails = {
        statusCode: 500,
        message: `${error.message}`
    };
    return responseHandler;
}

}


export default {
    userRegistrationService,
    adminRegistrationService
}
import { ResponseDetails } from "../../types/utilities.types";
import validator from "validator";
import { userDatabase, generalHelpers } from "../../helpers";
import { mailUtilities, errorUtilities } from "../../utilities";
import { USERS_APP_BASE_URL } from '../../configurations/envKeys';

const userRegistrationService = errorUtilities.withErrorHandling(async (
  userPayload: Record<string, any>
): Promise<any> => {

    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { name, email, password, phone } = userPayload;

    if (!validator.isMobilePhone(phone, "en-NG")) {
      throw errorUtilities.createError("Invalid phone number", 400);
    }

    if (!validator.isEmail(email)) {
      throw errorUtilities.createError("Invalid email", 400);
    }

    const existingUser:any = await userDatabase.userDatabaseHelper.getOne({
      email,
    });

    if (existingUser) {
      throw errorUtilities.createError("User already exists with this email", 400);
    }

    const payload = {
      name,
      email,
      password: await generalHelpers.hashPassword(password),
      phone,
      role: "User",
    };

    const newUser = await userDatabase.userDatabaseHelper.create(payload);

    const tokenPayload = {
      userId: newUser._id,
      role: newUser.role,
      email: newUser.email,
    };

    const verificationToken = await generalHelpers.generateTokens(
      tokenPayload,
      "1h"
    );

    await mailUtilities.sendMail(newUser.email, "Click the button below to verify your account", "PLEASE VERIFY YOUR ACCOUNT", `${USERS_APP_BASE_URL}/verification/${verificationToken}`);

    const userWithoutPassword = await userDatabase.userDatabaseHelper.extractUserDetails(newUser)

    delete userWithoutPassword.refreshToken

    responseHandler.statusCode = 201;
    responseHandler.message = "User registered successfully";
    responseHandler.data = userWithoutPassword;
    return responseHandler;

});

const adminRegistrationService = errorUtilities.withErrorHandling(async (userPayload: Record<string, any>) => {

    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { name, email, password, phone } = userPayload;

    if (!validator.isMobilePhone(phone, "en-NG")) {
      throw errorUtilities.createError("Invalid phone number", 400);
    }

    if (!validator.isEmail(email)) {
      throw errorUtilities.createError("Invalid email", 400);
    }

    const existingAdmin = await userDatabase.userDatabaseHelper.getOne({
      email,
    });
    if (existingAdmin) {
      throw errorUtilities.createError("Admin already exists with this email", 400);
    }

    const payload = {
      name,
      email,
      password: await generalHelpers.hashPassword(password),
      phone,
      role: "Admin",
      isVerified: true,
    };

    const newUser = await userDatabase.userDatabaseHelper.create(payload);

    const userWithoutPassword = await userDatabase.userDatabaseHelper.extractUserDetails(newUser)

    delete userWithoutPassword.refreshToken

    responseHandler.statusCode = 201;
    responseHandler.message = "Admin registered successfully";
    responseHandler.data = userWithoutPassword;
    return responseHandler;

});

const userLogin = errorUtilities.withErrorHandling(async (loginPayload: Record<string, any>) => {

    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { email, password } = loginPayload;

    const existingUser = await userDatabase.userDatabaseHelper.getOne({
      email,
    });

    if (!existingUser) {
        throw errorUtilities.createError(`User with email ${email} does not exist`, 404);
    }

    if(!existingUser.isVerified){
        throw errorUtilities.createError(`User with email ${email} is not verified. Click on the link in the verification mail sent to ${email} or request for another verification mail`, 400);
    }

    if(existingUser.isBlacklisted){
        throw errorUtilities.createError(`Account Blocked, contact admin on info@naijamade.com`, 400)
    }

    const verifyPassword = await generalHelpers.validatePassword(
      password,
      existingUser.password
    );

    if (!verifyPassword) {
        throw errorUtilities.createError("Incorrect Password", 400);
    }

    const tokenPayload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const accessToken = await generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await generalHelpers.generateTokens(
      tokenPayload,
      "30d"
    );

    existingUser.refreshToken = refreshToken;

    await existingUser.save();

    const userWithoutPassword = await userDatabase.userDatabaseHelper.extractUserDetails(existingUser);

    delete userWithoutPassword.refreshToken

    const dateDetails = generalHelpers.dateFormatter(new Date())
    const mailMessage = `Hi ${existingUser.name}, <br /> There was a login to your account on ${dateDetails.date} by ${dateDetails.time}. If you did not initiate this login, click the button below to restrict your account. If it was you, please ignore. The link will expire in one hour.`;
    const mailLink = `${USERS_APP_BASE_URL}/restrict-account/${existingUser._id}`
    const mailButtonText = 'Restrict Account'
    const mailSubject = "Activity Detected on Your Account";

    await mailUtilities.sendMail(existingUser.email, mailMessage, mailSubject, mailLink, mailButtonText)

    responseHandler.statusCode = 200;

    responseHandler.message = `Welcome back ${userWithoutPassword.name}`;

    responseHandler.data = {
      user: userWithoutPassword,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return responseHandler;

});

export default {
  userRegistrationService,
  adminRegistrationService,
  userLogin,
};

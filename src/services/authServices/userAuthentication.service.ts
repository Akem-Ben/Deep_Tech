import { ResponseDetails } from "../../types/utilities.types";
import validator from "validator";
import { userDatabase, generalHelpers } from "../../helpers";
import { mailUtilities } from "../../utilities";
import { APP_BASE_URL } from '../../configurations/envKeys';

const userRegistrationService = async (
  userPayload: Record<string, any>
): Promise<any> => {
  try {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { name, email, password, phone } = userPayload;

    if (!validator.isMobilePhone(phone, "en-NG")) {
      responseHandler.statusCode = 400;
      responseHandler.message = "Invalid phone number";
      return responseHandler;
    }

    if (!validator.isEmail(email)) {
      responseHandler.statusCode = 400;
      responseHandler.message = "Invalid email";
      return responseHandler;
    }

    const existingUser = await userDatabase.userDatabaseHelper.getOne({
      email,
    });

    if (existingUser) {
      responseHandler.statusCode = 400;
      responseHandler.message = "User already exists with this email";
      return responseHandler;
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

    await mailUtilities.sendMail(newUser.email, "Click the button below to verify your account", "PLEASE VERIFY YOUR ACCOUNT", `${APP_BASE_URL}/${verificationToken}`);

    responseHandler.statusCode = 201;
    responseHandler.message = "User registered successfully";
    responseHandler.data = newUser;
    return responseHandler;


  } catch (error: any) {
    const responseHandler: ResponseDetails = {
      statusCode: 500,
      message: `${error.message}`,
    };
    return responseHandler;
  }
};

const adminRegistrationService = async (userPayload: Record<string, any>) => {
  try {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { name, email, password, phone } = userPayload;

    if (!validator.isMobilePhone(phone, "en-NG")) {
      responseHandler.statusCode = 400;
      responseHandler.message = "Invalid phone number";
      return responseHandler;
    }

    if (!validator.isEmail(email)) {
      responseHandler.statusCode = 400;
      responseHandler.message = "Invalid email";
      return responseHandler;
    }

    const existingUser = await userDatabase.userDatabaseHelper.getOne({
      email,
    });
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
      role: "Admin",
      isVerified: true,
    };

    const newUser = await userDatabase.userDatabaseHelper.create(payload);

    responseHandler.statusCode = 201;
    responseHandler.message = "Admin registered successfully";
    responseHandler.data = newUser;
    return responseHandler;
  } catch (error: any) {
    const responseHandler: ResponseDetails = {
      statusCode: 500,
      message: `${error.message}`,
    };
    return responseHandler;
  }
};

const userLogin = async (loginPayload: Record<string, any>) => {
  try {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { email, password } = loginPayload;

    const existingUser = await userDatabase.userDatabaseHelper.getOne({
      email,
    });

    if (!existingUser) {
      responseHandler.statusCode = 404;
      responseHandler.message = `User with email ${email} does not exist`;
      return responseHandler;
    }

    if(!existingUser.isVerified){
        responseHandler.statusCode = 400;
        responseHandler.message = `User with email ${email} is not verified. Click on the link in the verification mail sent to ${email} or request for another verification mail`;
        return responseHandler;
    }

    if(existingUser.isBlacklisted){
        responseHandler.statusCode = 400;
        responseHandler.message =  `Account Blocked, contact admin on info@naijamade.com`
    }

    const verifyPassword = await generalHelpers.validatePassword(
      password,
      existingUser.password
    );

    if (!verifyPassword) {
      responseHandler.statusCode = 400;
      responseHandler.message = "Incorrect Password";
      return responseHandler;
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

    responseHandler.statusCode = 200;
    responseHandler.message = `Welcome back ${userWithoutPassword.name}`;
    responseHandler.data = {
      user: userWithoutPassword,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return responseHandler;

  } catch (error: any) {
    const responseHandler: ResponseDetails = {
      statusCode: 500,
      message: `${error.message}`,
    };
    return responseHandler;
  }
};

export default {
  userRegistrationService,
  adminRegistrationService,
  userLogin,
};

import { Request, Response } from "express";
import { userAuthService } from "../../services";
import { responseUtilities } from "../../utilities";

const userRegisterWithEmail = async (
  request: Request,
  response: Response
): Promise<any> => {
  const newUser: any = await userAuthService.userRegistrationService(
    request.body
  );

  return responseUtilities.responseHandler(
    response,
    newUser.message,
    newUser.statusCode,
    newUser.details,
    newUser.data
  );
};

const userLoginWithEmail = async (
  request: Request,
  response: Response
): Promise<any> => {
  const loggedInUser: any = await userAuthService.userLogin(request.body);

  if(loggedInUser.statusCode === 200){
  response
    .header("x-access-token", loggedInUser.data.accessToken)
    .header("x-refresh-token", loggedInUser.data.refreshToken);
  }
  
  return responseUtilities.responseHandler(
    response,
    loggedInUser.message,
    loggedInUser.statusCode,
    loggedInUser.details,
    loggedInUser.data,
  );
};

const userVerifiesAccountWithEmail = async (
  request: Request,
  response: Response
): Promise<any> => {
  
  const { token } = request.params;

  const verification = await userAuthService.verifyUserAccount(token)

  return responseUtilities.responseHandler(
    response,
    verification.message,
    verification.statusCode,
    verification.details,
    verification.data
  );

};

const userResendsVerificationLink = async (
  request: Request,
  response: Response
): Promise<any> => {

  const { email } = request.body;

  if(!email || email === ''){
    return responseUtilities.responseHandler(response, 'Email required', 400);
  }

  const resendLink = await userAuthService.resendVerificationLinkService(email)

  return responseUtilities.responseHandler(
    response,
    resendLink.message,
    resendLink.statusCode,
    resendLink.details,
    resendLink.data
  );

}

export default {
  userRegisterWithEmail,
  userLoginWithEmail,
  userVerifiesAccountWithEmail,
  userResendsVerificationLink
};

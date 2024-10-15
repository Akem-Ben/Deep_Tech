import {Request, Response} from 'express';
import { cartService } from '../../services';
import { responseUtilities } from '../../utilities';
import { JwtPayload } from 'jsonwebtoken';

const addItemToCart = async(request:JwtPayload, response:Response):Promise<any> => {

    const user_id = request.user._id;

    if(!user_id){
        return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }

    const body = {...request.body, user_id}

    const cart:any = await cartService.addItemToCartService(body)

    return responseUtilities.responseHandler(response, cart.message, cart.statusCode, cart.data)
}


const updateItemInCart = async(request:JwtPayload, response:Response):Promise<any> => {

    const user_id = request.user._id;

    if(!user_id){
        return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }

    const body = {...request.body, user_id}

    const cart:any = await cartService.updateCartItemService(body)

    return responseUtilities.responseHandler(response, cart.message, cart.statusCode, cart.data)
}


const deleteItemFromCart = async(request:JwtPayload, response:Response):Promise<any> => {

    const user_id = request.user._id;

    if(!user_id){
        return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }

    const body = {...request.body, user_id}

    const cart:any = await cartService.deleteCartItemService(body)

    return responseUtilities.responseHandler(response, cart.message, cart.statusCode, cart.data)
}









export default {
    addItemToCart,
    updateItemInCart,
    deleteItemFromCart
}
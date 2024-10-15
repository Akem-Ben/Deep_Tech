import {Request, Response} from 'express';
import { cartService, vendorShopService } from '../../services';
import { responseUtilities } from '../../utilities';
import { JwtPayload } from 'jsonwebtoken';

const createShop = async(request:JwtPayload, response:Response):Promise<any> => {

    const user_id = request.user._id;

    if(!user_id){
        return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }

    const body = {...request.body, user_id}

    const shop:any = await vendorShopService.createVendorShopService(body)

    return responseUtilities.responseHandler(response, shop.message, shop.statusCode, shop.data)
}



export default {
    createShop
}
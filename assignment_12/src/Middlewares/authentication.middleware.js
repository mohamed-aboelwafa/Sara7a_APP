import {TokenTypeEnum , signatureEnum} from '../Utils/enums/user.enum.js';
import {getSignature , verifyToken} from '../Utils/tokens/token.js';
import UserModel from '../DB/Models/user.model.js';
import TokenModel from '../DB/Models/token.model.js';
import { findById, findOne } from '../DB/database.repository.js';
import * as exception from '../Utils/response/error.response.js';


export const decodeToken = async({authorization , tokenType = TokenTypeEnum.ACCESS}) =>{
    const [Bearer , token] = authorization.split(" ") || [];

    let signature = await getSignature({
        signatureLevel : Bearer === "ADMIN" ? signatureEnum.ADMIN : Bearer === "USER" ? signatureEnum.USER : exception.BadRequestException("invalid data"),
    })

    const decodedToken = verifyToken({
        token , 
        secretKey: tokenType === TokenTypeEnum.ACCESS ? signature.accessSignature : signature.refreshSignature
    })

    // check if jwt is revoked:
    if(await findOne({model: TokenModel, filter: {jti: decodedToken.jti}})){
        throw exception.UnauthorizedException({message: "This Token is revoked"})
    }

    // check if user exists:
    const existing_user = await findById({model:UserModel, id:decodedToken.id});
    if(!existing_user){
        throw exception.NotFoundException("User Not Found");
    }

    // check if changeCredentilasTime of existing_user > iat of jwt:
    if ( (existing_user.changeCredentilasTime?.getTime() || 0) > decodedToken.iat * 1000) {
        throw exception.UnauthorizedException({message: "token is expired"});
    }

    return {existing_user , decodedToken};
}

// authentication middleware
export const authentication = ({tokenType = TokenTypeEnum.ACCESS}) =>{
    return async(req,res,next)=>{
        const {existing_user , decodedToken} = await decodeToken({authorization: req.headers.authorization, tokenType}) || {};
        req.existing_user = existing_user;
        req.decodedToken = decodedToken;
        return next();
    }
}

// authorization middleware
export const authorization = ({accessRoles=[]})=>{
    return async(req,res,next)=>{
        if(!accessRoles.includes(req.existing_user.role)){
            throw exception.ForbiddenException("Unauthorized Access");
        }
        return next();
    }
}

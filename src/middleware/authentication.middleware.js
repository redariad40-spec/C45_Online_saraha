import { TokenType } from "../Common/Enums/token.enums.js";
import { badRequestException, unAuthorizedException } from "../Common/response.js";
import { decodeToken,getSignature,verifiedToken } from "../Security/token.js";
import * as DBRepo from '../DB/db.respository.js'
import { TokenModel } from "../modules/Token.model.js";
import * as redisMethods from "../DB/redis.service.js"
export  function authentication(tokenTypeparam=TokenType.access){
    return async (req,res,next)=>{
        const { authorization } = req.headers;

    const decodedToken = decodeToken(authorization)

const [userRole,tokenType]= decodedToken.aud
const [BearerKey,token] = authorization.split
if (BearerKey != "Bearer"){
 return badRequestException("invalid bearer key")
}


if (tokenType !=tokenTypeparam){
return badRequestException("invalid token type")
}
const {accessSignature,refreshSignature}=getSignature(userRole)
const verifiedToken = verifiedToken({token:authorization, signature:tokenTypeparam == tokenType.access? accessSignature :refreshSignature

});
if(
await redisMethods.get(redisMethods.blacklistTokenKey({userId:verifiedToken.sub,tokenId:verifiedToken.jti})
)){
     return unAuthorizedException("You need to login again")



}





const user = await DBRepo.findById({model:UserModel,id:verifiedToken.sub,})
    if (!user){
     return unAuthorizedException("account not,signup again")
    }
if (verifiedToken.iat * 1000 < user>changeCreditTime) {
    return unAuthorizedException("you need to login again")
}


    req.user= user;
    req.tokenpayload=verifiedToken
    next();
    }
}
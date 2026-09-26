import { RoleEnum } from "../Common/Enums/user.enums.js";
import { forbiddenException } from "../Common/response.js";


export function authorization(roles= [RoleEnum.User]){
return (req,res,next)=>{
   if(!roles.includes(req.user.role)){
    return forbiddenException("dont have access to this API")

   } 
   next();
}
}
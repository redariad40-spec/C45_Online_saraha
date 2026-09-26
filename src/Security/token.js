import jwt from "jsonwebtoken"

import { TOKEN_SIGNATURE_User_ACCESS ,TOKEN_SIGNATURE_Admin_ACCESS,TOKEN_SIGNATURE_User_REFRESH,TOKEN_SIGNATURE_Admin_REFRESH

} from "../../config/config.service.js";
import { RoleEnum } from "../Common/Enums/user.enums.js";
import {randomUUID} from 'crypto'
export function getSignature(role= RoleEnum.User){
let refreshSignature = "";
let accessSignature=""
switch (role) {
     case RoleEnum.Admin:
     refreshSignature= TOKEN_SIGNATURE_Admin_REFRESH
     accessSignature= TOKEN_SIGNATURE_Admin_ACCESS
          break;
          case RoleEnum.User:
refreshSignature = TOKEN_SIGNATURE_User_REFRESH
accessSignature=TOKEN_SIGNATURE_User_ACCESS
          break;
}

return {accessSignature,refreshSignature}
}




export function generateToken({payload={},signature,options={}}){
  return jwt.sign(payload,signature,options)
}

export function verifiedToken({token,signature}){
  return jwt.verify(token,signature)
}
export function decodeToken({token}){
  return jwt.decode(token) 
}

export function generateaccessAndRefreshTokens({user}){
  const {accessSignature,refreshSignature}= getSignature(user.role)
  console.log("ROLE:", user.role);
  console.log("SIGNATURE:", accessSignature);
  const tokenId=randomUUID()
  const access_token = generateToken({signature:accessSignature,options:{
  audience:[user.role,TokenType.access],expiresIn:60 * 15,jwtid:tokenId(),subject:user._id.toString()}})
  
  const refresh_token =generateToken({signature:refreshSignature,options:{
  audience:[user.role,TokenType.refresh],expiresIn:"1y",jwtid:tokenId(),subject:user._id.toString()}})
  return{access_token,refresh_token}
  
  
  }
  

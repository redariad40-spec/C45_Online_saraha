import { TokenType } from "../../Common/Enums/token.enums.js";
import {generateToken, getSignature } from "../../Security/token.js";
import * as DBRepo from '../../DB/db.respository.js'
import UserModel from "../Models/User.model.js";
import { decryptValue } from "../../Security/encrpt.js";
import { model } from "mongoose";
import * as redisMethods from "../../DB/redis.service.js"
import { compare } from "bcrypt";
import { badRequestException } from "../../Common/response.js";


export async function renewToken(userData) {
     const{accessSignature}= getSignature(userData.role)
const newAcessToken=generateToken({Signature:accessSignature,options:{
audience:[userData.role,TokenType.access],expiresIn:60 * 15,subject:userData._id.toString()}})

return newAcessToken;
}


export async function uploadprofilepic(userId,file) {
 await DBRepo.updateOne({model:UserModel,filter:{_id:userId},data:{profilepic:file.destination}})
  
}


export async function coverprofilepic(userId,file) {
  console.log(files)
// await DBRepo.updateOne({model:UserModel,filter:{_id:userId},data:{coverpics:file.destination}})
  
}



export async function getAnotherProfile(profileId) {
  const user =await DBRepo.findById({id:profileId,
    model:UserModel,
    select:"-password -role -confirmEmail -provider -createdAt -updatedAt- __v "})
    if(user.phone){
   user.phone=decryptValue({cipherText:user.phone})
    } 
   return user
}


export  async function logout(userId,tokenData,logoutOptions) {
if (logoutOptions == "all"){
  await DBRepo.updateOne({model:UserModel,filter:{_id:userId},data:{changeCreditTime:new Date()}})
 } else{
    await redisMethods.set({
      key:redisMethods.blacklistTokenKey({userId,tokenId:tokenData.jti}),
      value:tokenData.jti,
      exvalue:(60 * 60 * 24 * 365) - (Date.now) / 1000 - tokenData.iat})
  }
}



///import userCollection from "../Models/User.model.js";

//export async function getAllUser() {
  //   const users =await userCollection.find().toArray() 
    // return users;
//}


export async function updatePasword(bodyData,userData){
  const {newPassword,oldPassword} =bodyData
  const {password}= userData


  const isOldPasswordValid = await compareOperation({
    plainValue:oldPassword,
    hashedValue:password,
  })
  if(!isOldPasswordValid){
    return badRequestException("invalid old password")
  }
await DBRepo.updateOne({
  model:UserModel,
  filter:{_id:userData._id},
  data:{password:await hashedOperation({plainText:newPassword}),changeCreditTime: new Date()}
})

}
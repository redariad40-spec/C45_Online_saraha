import { badRequestException, conflictException, notFoundException } from "../../Common/response.js"
import UserModel from "../Models/User.model.js"
import * as DBRepo from '../../DB/db.respository.js'
import  bcrypt, { compare, hash }  from "bcrypt"
import { SALT_ROUND, TOKEN_SIGNATURE_Admin_ACCESS, TOKEN_SIGNATURE_User_ACCESS, TOKEN_SIGNATURE_Admin_REFRESH, TOKEN_SIGNATURE_User_REFRESH, GOOGLE_CLIENT_ID } from "../../../config/config.service.js"
import{ENCRYPTION_KEY} from "../../../config/config.service.js"
import  jwt from "jsonwebtoken"
import CryptoJS  from"crypto-js";
//import { TOKEN_SIGNATURE_User_REFRESH } from '../../../config/config.service.js'
import { provider, RoleEnum } from "../../Common/Enums/user.enums.js"
import { TokenType } from "../../Common/Enums/token.enums.js"
import { generateaccessAndRefreshTokens, generateToken, getSignature } from "../../Security/token.js"
import { OAuth2Client } from "google-auth-library"
import { encryptValue } from "../../Security/encrpt.js"
import { generateOTP } from "../../Common/OTP/Otp.service.js"
import sendMail from "../../Common/email/email.config.js"
import {  EmailTypeEnum } from "../../Common/Enums/email.enums.js"
import * as RedisMethods from "../../DB/redis.service.js"


async function sendEmailOtp({ email, emailType,subject }) {
  const pervOtpTTL = await RedisMethods.ttl(
    RedisMethods.getOTPKey({ email, emailType }),
  );

  if (pervOtpTTL > 0) {
    return badRequestException(
      `There is already OTP valid for ${pervOtpTTL} seconds`,
    );
  }

  const isBlocked = await RedisMethods.exists(
    RedisMethods.getOTPBlockedKey({
      email,
      emailType,
    }),
  );

  if (isBlocked) {
    return badRequestException(`Try again later`);
  }

  const reqNo = await RedisMethods.get(
    RedisMethods.getOTPReqNoKey({
      email,
      emailType ,
    }),
  );

  if (reqNo == 5) {
    await RedisMethods.set({
      key: RedisMethods.getOTPBlockedKey({
        email,
        emailType,
      }),
      value: 1,
      exValue: 10 * 60,
    });

    return badRequestException(`You cannot request more than 5 emails in 20m`);
  }

  const otp = generateOTP();

  await sendMail({
    to: email,
    subject ,
    html: `<h1> Your OTP ${otp} </h1>`,
  });

  await RedisMethods.set({
    key: RedisMethods.getOTPKey({
      email,
      emailType,
    }),
    value: await hashOperation({ plainText: otp }),
    exValue: 120,
  });

  await RedisMethods.incr(
    RedisMethods.getOTPReqNoKey({
      email,
      emailType,
    }),
  );
}


export async function signup(bodyData){
    const {email}=bodyData
    const isEmail= await DBRepo.findOne({model:UserModel,filters:{email}})
    if(isEmail){
return conflictException("email Already exists")
    }
    const hashedpassword=await bcrypt.hash(bodyData.password,SALT_ROUND)
    bodyData.password=hashedpassword
if(bodyData.phone){
  const phoneEncrypted = encryptValue({value:bodyData.phone})
bodyData.phone=phoneEncrypted;

}
     await  sendEmailOtp({email,emailType :EmailTypeEnum.confirmEmail,subject:"confirm your Email"})
return result;
}



export async function confirmEmail(bodyData){
    const {email,Otp}=bodyData
    const user = await DBRepo.findOne({
        model:UserModel,
        filters:{email,confirmEmail:false}
    })
    if(!user){
        return badRequestException("invalid email already confirmed")
    }
    const storedOtp = await RedisMethods.get(
            RedisMethods.getOTPKey({email,otpType:EmailTypeEnum.confirmEmail}),

    )

    if (!storedOtp){
                return badRequestException("OTP EXpired")
    }
const isOtpvalid=await compareOperation({
    plainvalue:Otp,
    hashedValue:storedOtp,
})

if(!isOtpvalid){
    return badRequestException("OTP NOT valid")
}
user.confirmEmail= true
await user.save()
    }




    export async function resendConfirmEmailOtp(email){
     await  sendEmailOtp({email,emailType :EmailTypeEnum.confirmEmail,subject:" Another OTP TO confirm your Email"})
    }


export async function resendforgetPasswordOtp(email){
     await  sendEmailOtp({email,emailType :EmailTypeEnum.forgetPassword,subject:" Another OTP TO  Reset Your password"})
    }




            export async function sendOtpForgetPassword(email){
                const user =await DBRepo.findOne({model:UserModel, filters:{ email}})
                if(!user){
                    return;
                }
                if(!user.confirmEmail){
return badRequestException("confirm your email first")
                }
     await  sendEmailOtp({email,emailType :EmailTypeEnum.forgetPassword,subject:" Reset Your password"})
    }


    export async function verifyOTPForgetPassword(bodyData) {
        const {email,otp} = bodyData
        const emailOTP = await RedisMethods.get(RedisMethods.getOTPKey({email, emailType:EmailTypeEnum.forgetPassword}))
        if(!emailOTP){
return badRequestException("OTP Expired")
        }
const isOtpvalid = await compareOperation({
    plainvalue:otp,
    hashedValue:storedOtp
})
if (!isOtpvalid){
    return badRequestException("OTP Not valid")
}

    }

export async function restPassword(bodyData) {
    const {email,password,otp}=bodyData
    await verifyOTPForgetPassword({email,otp})
    await DBRepo.updateOne({
        model:UserModel,
        filters:{email},
        data:{password:await hashOperation({plainText:password})}})
        return;
}


export async function login(bodyData,url) {
    const {email,password}=bodyData;
    const user= await DBRepo.findOne({model:UserModel,filters:{email,}})
    if (!user){
        return notFoundException("invalid info");
    }

if (!user.confirmEmail){
        return badRequestException("you need to confirm your email first");
    }


    console.log({user})
    const ispasswordvalid=await compare(password,user.password)
    if (!ispasswordvalid){
     return notFoundException("invalid info");

    }
    
 return generateaccessAndRefreshTokens({newuser})

}

 async function verifyGoogleToken(tokenId){
    const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
idToken:idToken ,
      audience: GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload();

}
export async function loginWithGoogle(idToken) {
    const payload = await verifyGoogleToken(idToken)
    if (!PayloadGoogleToken.email_verified){
    return badRequestException("email must be verified ")
}
const user = await DBRepo.findOne({model:UserModel,filters:{email:payload.email,provider:provider.Google}})
if(!user){
 return signupWithGmail(idToken)

}

}

export async function signupWithGmail(idToken) {
// const {idToken}= bodyData;
const PayloadGoogleToken = await verifyGoogleToken(idToken)
if (!PayloadGoogleToken.email_verified){
    return badRequestException("email must be verified ")
}
const user = await DBRepo.findOne({model:UserModel,filters:{email:PayloadGoogleToken}})

if(user){
    if(user.provider == provider.System){
        return badRequestException("Account already exists, signup with your email and password")
    }
    return{status:200,result:await loginWithGoogle(idToken)}
}
  const newuser=   await DBRepo.create({
    model:UserModel,
    insertedData:{
        email:PayloadGoogleToken.email,
        userName:PayloadGoogleToken.name,
        picturepic:PayloadGoogleToken.picture,
        confirmEmail:true,
        provider:provider.Google,
    },
})
return { status:201,result:generateaccessAndRefreshTokens(newuser)};
} 


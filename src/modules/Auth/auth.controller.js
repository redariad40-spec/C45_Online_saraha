import express from 'express'
import * as authService from './auth.service.js'
import { successResponse } from '../../Common/response.js'
import { validation } from '../../middleware/validation.middleware.js'
import { confirmEmailSchema, resendOtpConfirmEmailSchema, resetPasswordSchema, sendOtpForgetPasswordSchema, signupSchema, verifyOTPForgetPasswordSchema } from './auth.validation.js'
import { loginSchema } from './auth.validation.js'
import { localUpload,allowedFileFormats } from '../../multer/multer.config.js'

const authRouter = express.Router()
authRouter.get("/",(req,res)=> res.send("auth page"))
authRouter.post("/signup", validation(signupSchema), async (req, res) => {    
console.log(req.file)
console.log(req.files)

console.log(req.body)

   const validateResult=signupSchema.body.validate(req.body,{abortEarly:false})
if(validateResult.error?.details.length>0){

    return successResponse({res,statusCode:400,data:validateResult.error})

}
  // const result =await authService.signup(req.vbody)
    return successResponse({res,statusCode:201,data:result})

})
authRouter.post("/signup/gmail",async(req,res)=>{
    const {status,result} =await authService.signupWithGmail(req.body.idToken)
    return successResponse({res,statusCode:status,data:result})
})

authRouter.post("/send-male-forget-password",validation(sendOtpForgetPasswordSchema),async(req,res)=>{
    const result =await authService.verifyOTPForgetPassword(req.body)
    return successResponse({res,statusCode:201,data:"verified"})
})


authRouter.post("/verfiy-forget-password",validation(verifyOTPForgetPasswordSchema),async(req,res)=>{
    const result =await authService.sendOtpForgetPassword(req.body)
    return successResponse({res,statusCode:201,data:"check your inbox"})
})

authRouter.post("/reset-password",validation(resetPasswordSchema),async(req,res)=>{
    const result =await authService.restPassword(req.body)
    return successResponse({res,statusCode:201,data:"done"})
})


authRouter.post("/resend-otp-confirm.email",validation(resendOtpConfirmEmailSchema),async(req,res)=>{
    const {status,result} =await authService.resendConfirmEmailOtp(req.body.email)
    return successResponse({res,statusCode:201,data:"check your inbox"})
})




authRouter.post("/resend-otp-reset-password",validation(resendOtpConfirmEmailSchema),async(req,res)=>{
    const {status,result} =await authService.resendforgetPasswordOtp(req.body.email)
    return successResponse({res,statusCode:201,data:"check your inbox"})
})



authRouter.post("/login",validation(loginSchema),async(req,res)=>{
    const result =await authService.login(req.body,(`${req.protocol}://${req.host}`))
    return successResponse({res,statusCode:201,data:result})
})

export default authRouter





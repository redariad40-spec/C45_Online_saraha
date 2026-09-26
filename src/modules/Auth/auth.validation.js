import joi from "joi";
import { CommonfieldValidation } from "../../middleware/validation.middleware.js";
export const loginSchema = joi
  .object({
    userName: joi.string().alphanum().uppercase().messages({
      "string.alphanum": "userName cannot contain special chars",
      "any.required": "username required",
    }),
    email: joi.string().email().trim(),
    password: joi.string().min(6).max(18).required(),
  })
  .xor("userName", "email")
  .messages({
    "object.missing": "you must enter one of them only 'userName ,email'",
  })
  .required();

export const signupSchema ={ 
query:joi.object({}).keys({
    in:joi.string().valid("ar","en","fr").required(),
}),
body:joi
  .object({}).
  keys({
    userName: joi.string().alphanum().uppercase().required().messages({
      "string.alphanum": "userName cannot contain special chars",
      "any.required": "username required",
    }),
    email: CommonfieldValidation.email.required(),
    password: joi.string().min(6).max(18).required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required(),
    phone:joi.string(),
    DOB:joi.date(),
    gender:joi.string().valid("male","female"),
    in:joi.string().valid('ar','en','fr')
  })
  .required()
}

export const confirmEmailSchema={
  body:joi.object().keys({
        email: CommonfieldValidation.email.required(),
otp:CommonfieldValidation.OTP.required()
  }).required()
}



export const resendOtpConfirmEmailSchema={
  body:joi.object().keys({
        email: CommonfieldValidation.email.required(),
otp:CommonfieldValidation.OTP.required()
  }).required()
}



export const sendOtpForgetPasswordSchema={
  body:joi.object().keys({
        email: CommonfieldValidation.email.required(),
otp:CommonfieldValidation.OTP.required()
  }).required()
}




export const verifyOTPForgetPasswordSchema={
  body:joi.object().keys({
        email: CommonfieldValidation.email.required(),
otp:CommonfieldValidation.OTP.required()
  }).required()
}





export const resetPasswordSchema={
  body:joi.object().keys({
        email: CommonfieldValidation.email.required(),
otp:CommonfieldValidation.OTP.required(),
password:CommonfieldValidation.password.required()
  }).required()
}
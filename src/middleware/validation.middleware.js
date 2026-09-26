import { Types } from "mongoose"
import { badRequestException } from "../Common/response.js"
import Joi from "joi"
import { GenderEnum } from "../Common/Enums/user.enums.js"
export function validation(Schema){


return(req,res,next)=>{
    const validationErrors=[]
    for(const SchemaKey of Object.keys(Schema)){
        
const validateResult=Schema[SchemaKey].validate(req[SchemaKey],{
    abortEarly:false

    })
    console.log({SchemaKey,validateResultValue:validateResult.value,
        value:req[SchemaKey],
    })
    req["v"+"schemaKey"]=validateResult.value;
    if(validateResult.error?.details.length>0){
    validationErrors.push(validateResult.error)
    }
}
if(validationErrors.length>0){
return badRequestException("validation err",validationErrors)
}

next();
}
}

export const CommonfieldValidation = {
  userName: Joi
    .string()
    .pattern(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/)),
 // email: Joi
   // .string()
    //.pattern(
      //new RegExp(
        ///^\w{3,25}@(gmail|yahoo|outlook|icloud)(.com|.net|.co|.eg){1,4}$/,
      //),
    //)
    //.trim(),
    email:Joi.string().trim(),
  password: Joi
    .string()
    .pattern(
      new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,16}/),
    ),
  phone: Joi.string().pattern(new RegExp(/^(\+201|00201|01)(0|1|2|5)\d{8}$/)),
  DOB: Joi.date(),
  gender: Joi.string().valid(...Object.values(GenderEnum)),

 // OTP:Joi.number().min(100000).max(999999)
 OTP: Joi.string().pattern(new RegExp(/^\d{6}$/)) ,
 // يح
 id:Joi.string().custom(validateObjectIdfn).required(),
};


export function validateObjectIdfn (value,helpers){
            if(!Types.ObjectId.isValid(value)){
return helpers.message("invalid object id formate").required()
}
        }
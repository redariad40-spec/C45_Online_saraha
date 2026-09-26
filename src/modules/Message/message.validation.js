import Joi  from "joi";
import { CommonfieldValidation } from "../../middleware/validation.middleware.js";


export const sendMessageSchema={
    body:Joi
    .object({})
    .keys({
        content:Joi.string().min(3).max(1000),
        
    }),
    params:Joi.object({}).keys({
        receiverId:CommonfieldValidation.id.required()
    }).required(),

}


    export const getMessageByIdSchema={
params:Joi
.object({})
.keys({
    messageId:CommonfieldValidation.id.required(),
})
    }









    export const deleteMsgSchema={
params:Joi
.object({})
.keys({
    messageId:CommonfieldValidation.id.required(),
})
    }
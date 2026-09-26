import express from 'express'
import { allowedFileFormats, localUpload } from '../../multer/multer.config.js'
import { badRequestException, successResponse } from '../../Common/response.js'
import { authentication } from '../../middleware/authentication.middleware.js'
import { validation } from '../../middleware/validation.middleware.js'
import {  getMessageByIdSchema, sendMessageSchema } from './message.validation.js'
import { getAllMsgs, getMsgById, removeMsg } from './message.service.js'
const messageRouter = express.Router({caseSensitive:true})

messageRouter.post("/:receiverId",(req,res,next)=>{
const {authorization}=req.headers;
if(authorization){
const authMiddleware=authentication()
return authMiddleware(req,res,next)
}



    next()
}
,localUpload({
    folderName:"messages"
    ,allowedFormate:[...allowedFileFormats.img,...allowedFileFormats.video]})
.array("msgAttachments",5),

validation(sendMessageSchema),



async (req,res)=>{
if(!req.body  && !req.files){
return badRequestException("you need to send at least content or file")
}


    await sendmessage(req.params.receiverId,req.body.content,req.file,req.user?.id)
    return successResponse({res,statusCode:201,data:" Msg sended"})
}
)

messageRouter.get("/getMsgById/:messageId",

authentication(),
validation(getMessageByIdSchema),
async (req,res)=>{
    const result=await getMsgById(req.user,req.params.messageId)
    return successResponse({res,data:result})
})






messageRouter.get("/get-all-messages",

authentication(),

async (req,res)=>{
    const result=await getAllMsgs(req.user._id)
    return successResponse({res,data:result})
})






messageRouter.delete("/:messageId",

authentication(),
validation(getMessageByIdSchema),
async (req,res)=>{
    await removeMsg(req.user,req.params.messageId)
    return successResponse({res,data:"Msg Deleted"})
})




export default messageRouter
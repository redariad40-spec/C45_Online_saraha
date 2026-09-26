import { badRequestException, notFoundException } from '../../Common/response.js'
import * as DBRepo from '../../DB/db.respository.js'
import MessageModel from '../Models/message.model.js'
import UserModel from '../Models/User.model.js'

export async function sendmessage(receiverId,connect,filesData,senderId ) {
    
    const receiver =await DBRepo.findById({model:UserModel,id:receiverId})

if(!receiver){
return badRequestException("Receiver Not Found")
}

console.log({filesData})

await DBRepo.create({model:MessageModel,insertedData:{
    connect,
    attachments:filesData.map((file)=>file.finalPath),
    senderId,
    receiverId,
}})

}



export async function getMsgById(userData,messageId) {
   const msg= await DBRepo.findOne({
        model:MessageModel,
        filters:{
            _id:messageId,
            receiverId:userData._id
        },
        select:"-senderId"
    })
if(!msg){
    return notFoundException("invalid Msg Id")
}
return msg
}





export async function getAllMsgs(userId) {
   const msgs= await DBRepo.find({
        model:MessageModel,
        filters:{
    $or:[{receiverId:userId},{
        senderId:userId}]
    },
    select:"-senderId"

    
    })
if(!msgs.length){
    return notFoundException("no Msg found")
}
return msgs
}








export async function removeMsg(userData,messageId) {
   const msgs= await DBRepo.deleteOne({
        model:MessageModel,
        filters:{
            _id:messageId,
            receiverId:userData._id,
        }


    
    })
if(!msgs.length){
    return notFoundException("no Msg found")
}
return msgs
}



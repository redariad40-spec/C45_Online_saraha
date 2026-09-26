
import multer from 'multer'
import {randomUUID} from 'node:crypto'
import path from 'node:path'
import { existsSync,mkdirSync } from 'node:fs'

export  const allowedFileFormats={
    img:["image/png","image/jpg"],
    video:['video/mp4'],
    pdf:["application/pdf"],
}

 export function localUpload({folderName= "GeneralFile",allowedfileFormate=allowedFileFormats.img,fileSize=10}){
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const fullpath= `.uploads/${folderName}`
        if(!existsSync(fullpath)){
          mkdirSync(fullpath,{recursive:true})  
        }
        cb(null,path.resolve(fullpath))

    },
    filename:function(req,file,cb){

const fileName=randomUUID() + "_" + file.originalname
console.log({file})
console.log(`uploads/${folderName}/$(fileName)`)
file.finalpath=`.uploads/${folderName}`
       cb (null,fileName)
    }
})

function fileFilter(req,file,cb){
if(!allowedfileFormate.includes(file.mimetype)){
    return cb(new Error("invalid formate",{cause:{statuscode:400}}),
false,
)
}
return cb(null,true)
}
 return  multer({  storage ,fileFilter,limits:{fileSize:fileSize * 1024 * 1024}})

}

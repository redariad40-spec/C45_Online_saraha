import express from 'express'
import * as userService from './User.service.js'
import { authentication } from '../../middleware/authentication.middleware.js';
import { TokenType } from '../../Common/Enums/token.enums.js';
import { RoleEnum } from '../../Common/Enums/user.enums.js';
import { authorization } from '../../middleware/Authorization.middleware.js';
import { allowedFileFormats, localUpload } from '../../multer/multer.config.js';
import { successResponse } from '../../Common/response.js';
import { validation } from '../../middleware/validation.middleware.js';
import { profilePicSchema, updatePaswordSchema } from './user.validation.js';
const UserRouter = express.Router()
      

UserRouter.get("/", (req, res) =>
  res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>alert("test")</script>
  </body>

</html>
  `),
);






UserRouter.get("/",authentication(),authorization([RoleEnum.Admin]),async(req,res)=>{
    const result= await userService.getUserProfile(req.user);
    return res.json ({msg:"done",result})
})

UserRouter.post("/renew-token",authentication(TokenType.refresh),async(req,res)=>{
    const result= await userService.renewToken(req.user);
    return successResponse ({res,data:result})
})
UserRouter.post("/upload.coverpics",authentication(),localUpload({folderName:"user",allowedfileFormate:allowedFileFormats.img,fileSize:20}).array("coverPics",2),validation(profilePicSchema),async(req,res)=>{

    console.log(req.files)

    for (const file of files){
        profilepicPath.push(file.finalPath)
    }

const result= await userService.uploadprofilepic(req.user._id,req.files);
    return successResponse ({res,data:result})

})

UserRouter.get("/share,profile/:profileId ",validation(userService.getAnotherUserProfileSchema),async(req,res)=>{
    const result= await userService.getAnotherProfile(req.params.profileId  );
    return successResponse ({res,data:result})

})
UserRouter.post("/logout",authentication(),async(req,res)=>{
const result = await userService.logout(req.user_id,req.tokenPayload,req.body.logoutOption)
})

 UserRouter.patch(
    "/update-password",
    authentication(),
    validation(updatePaswordSchema),
    async (req,res)=>{
    await userService.updatePasword(req.body.req.user)
        return successResponse({res,date:"done"})
    }
 )






export default UserRouter




 
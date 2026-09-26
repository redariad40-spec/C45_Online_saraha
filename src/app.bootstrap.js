import express from 'express'
import authRouter from './modules/Auth/auth.controller.js'
import { SERVER_PORT, NODE_ENV } from '../config/config.service.js'
import  testDBConnection  from './DB/connection.js'
import userRouter from './modules/User/user.controller.js'
import { globalErrHandling } from './Common/response.js'
import cors from 'cors'
import path from 'path'
import { testRedisConnection } from './DB/redis.connection.js'
import sendMail from './Common/email/email.config.js'
import messageRouter from './modules/Message/message.controller.js'
import helmet from 'helmet'
import {ipKeyGenerator, rateLimit} from 'express-rate-limit'
import geolite from "geoip-lite"
import * as  redisMethods from "./DB/redis.service.js"
async function bootstrap() {
  const app = express()
  const port = SERVER_PORT

  await testDBConnection()
  await testRedisConnection()


 await sendMail({
  to:"wosecem131@airychen.com",
  subject:"this for test",
  html:`<h1>test </h1>
  <h2>test2 </h2>
  `
 })



app.set("trust proxy", true)

app.use(express.json(),cors({origin:""}),helmet({}),rateLimit({
  windowMs: 5 * 60 * 1000 ,
  limit:(req,res)=>{
const geoInfo= geolite.lookup(req.ip)
return geoInfo.country == 'EG'?3:0
  },
  legacyHeaders:false,
  message:"too many",
  statusCode:400,
  handler:(req,res)=>{
    return res.status(401).json({msg:"too many requests"})
  },
  requestPropertyName:"ratelimit",
  keyGenerator:(req)=>{
    const iP = ipKeyGenerator(req.ip)
    return `${iP}-${req.path}`
  },
store:{
  incr:async (key,cb)=>{

const hits = await redisMethods.incr(key)
if(hits == 1){
  await redisMethods.setExpire(key,60)
}



    cb(null,hits)
},
  async decrement(key){
    const isKeyExists = await redisMethods.exists(key)
if(isKeyExists){
await redisMethods.decr(ket);
}
}
  
},
skipSuccessfulRequests:true
}))

app.use((req,res,next)=>{
  console.log(req.headers["x-forwarded-for"])
  console.log(req.ip)
  next()
})


  app.use("/uploads",express.static(path.resolve("./uploads")))
  app.use('/auth', authRouter)
  app.use("/user",userRouter)
app.use("/message",messageRouter)
  app.use (globalErrHandling)
  

  app.listen(port, () => {
    console.log(`server is running on ${port}`)
  })
}

export default bootstrap
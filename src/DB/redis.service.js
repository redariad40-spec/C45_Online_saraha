import { EmailTypeEnum } from "../Common/Enums/email.enums.js";
import { client } from "./redis.connection.js";




export async function set(Key,value,exType="EX",exvalue=120) {
    console.log(exvalue)
    return await client.set(Key,value,{
        expiration:{type:exType,value:Math.floor(exvalue)},
    })
    
}
export async function get(key) {
    return await client.get(key)
    
}


export async function mget(keys) {
    return await client.mGet(keys)
    
}

export async function ttl(key) {
    return await client.ttl(key)
    
}
export async function exists(key) {
    return await client.exists(key)
    
}


export async function persist(key) {
    return await client.persist(key)
    
}

export async function del(keys) {
    return await client.del(keys)
    
}

export async function update(key,value) {
    if (!(await exists(key))){
        return 0;
    }
    await client.set(key,value)
    return 1;
    
}
export function blacklistTokenKey(userId,tokenId){
return `blacklistToken::${userId}::${tokenId}`
}

export function getOTPKey(email,emailType){
return `OTP::${email}::${email,emailType}`
}



export function getOTPReqNoKey(email,emailType){
return `OTP::${email}::${emailType}::No`
}



export function getOTPBlockedKey(email,emailType){
return `OTP::${email}::${emailType}::Blocked`
}




export async function incr(key) {
    return await client.incr(key)
}




export async function decr(key) {
    return await client.decr(key)
}
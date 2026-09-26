
import {connect} from "mongoose"
import { DB_URL_ATLAS } from "../../config/config.service.js";
async function testDBConnection() {
        
try {
 await connect(DB_URL_ATLAS)
 console.log("DB connected")
}catch(error){
console.log("DB connection failed",error)
}
}

export default testDBConnection;

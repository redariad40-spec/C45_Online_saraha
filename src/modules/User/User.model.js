import mongoose from "mongoose";

const userCollection = mongoose.connection.collection("users");

export default  userCollection;
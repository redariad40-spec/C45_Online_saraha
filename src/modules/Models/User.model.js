import mongoose from "mongoose";
import { GenderEnum, provider, RoleEnum } from "../../Common/Enums/user.enums.js";
import Joi from "joi";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: function(){
  return this.provider===provider.System
      },
    },
    phone: String,
    DOB: Date,
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    provider:{
      type:String,
      enum:Object.values(provider),
      default:provider.System,
    },
    profilepic:String,
    coverpics:[String],
  
  changeCreditTime : Date,
  },
  {
  
    timestamps: true,
  }
);

export const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
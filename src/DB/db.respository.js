import Joi from "joi";
import UserModel from "../modules/User/User.model.js";
export async function findOne({model,filters={},select="",populate=false,populatefield=""}) {
let result;

    if (populate){
      result = select ? await model.findOne(filters).select(select).populate(populatefield) : await model.findOne(filters).populate(populatefield);
    }else
    {
      result = select ? await model.findOne(filters).select(select) : await model.findOne(filters);
    }
    return result;
}





export async function find({model,filters={},select="",populate=false,populatefield=""}) {
let result;

    if (populate){
      result = select ? await model.find(filters).select(select).populate(populatefield) : await model.find(filters).populate(populatefield);
    }else
    {
      result = select ? await model.find(filters).select(select) : await model.find(filters);
    }
    return result;
}





export async function create({model,insertedData,options={}}){
  const result =await model.create(insertedData,options)
return result;
}

////


export async function findById({model,filter,data,options}) {
     const result=  await model.updateOne({filter,data,options})
    
    return result;
}

export async function updateOne({model,filter,data,options}) {
  const result = await model.updateOne(filter,data,options)
  
  return result;
}




export async function deleteOne({model,filter,options}) {
  const result = await model.deleteOne(filter,options)
  
  return result;
}
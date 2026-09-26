import joi from "joi";
import { CommonfieldValidation, validateObjectIdfn } from "../../middleware/validation.middleware.js";

export const profilePicSchema = {
    file: joi
        .object({})
        .keys({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().required(),
            finalPath: joi.string().required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().required(),
        })
        .required(),
};




export const coverPicsSchema = {
    files: joi.array().items(joi
        .object({})
        .keys({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().required(),
            finalPath: joi.string().required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().required(),
        })
        .required(),
    )
        .required()
}

export const getAnotherUserProfileSchema={
    params:joi.object().keys({
        profileId:joi.string().custom(validateObjectIdfn).required(),
        })
        .required()
    }
    

    export const updatePaswordSchema={
        body:joi.object({}).keys({
            oldPassword:CommonfieldValidation.password.required(),
                        newPassword:CommonfieldValidation.password.required(),
                     confirmNewPassword:joi.string().valid(joi.ref("newPassword")).required()
                     .required()

        })
    }
import Joi from 'joi';
import { generalFiled } from '../../middleware/validation.js';


export const signUp = Joi.object({
    name: Joi.string().required(),
    email: generalFiled.email.required(),
    password: generalFiled.password,
    role: Joi.string().optional(),
}).required()


export const signIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).required()

export const deleteComments = Joi.object({
    commentId: Joi.string().required()
}).required()

export const deleteReply = Joi.object({
    replyId: Joi.string().required()
}).required()




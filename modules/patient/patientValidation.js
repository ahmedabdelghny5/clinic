import Joi from 'joi';
import { generalFiled } from '../../middleware/validation.js';


export const signUp = Joi.object({
    name: Joi.string().required(),
    email: generalFiled.email.required(),
    password: generalFiled.password,
    DOB: Joi.string().required(),
    phone: Joi.string().required(),
    gender: Joi.string().required(),
    role: Joi.string().optional(),
}).required()


export const signIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).required()

export const bookingDate = Joi.object({
    dateOfBook: Joi.string().required()
}).required()


export const updateInfo = Joi.object({
    name: Joi.string().optional(),
    DOB: Joi.string().optional(),
    phone: Joi.string().optional(),
    gender: Joi.string().optional(),
}).required()

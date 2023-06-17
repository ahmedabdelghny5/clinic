import Joi from 'joi';
import { generalFiled } from '../../middleware/validation.js';


export const signUp = Joi.object({
    name: Joi.string().required(),
    email: generalFiled.email.required(),
    password: generalFiled.password,
    title: Joi.string().required(),
    phone: Joi.string().required(),
    dates: Joi.string().required(),
    dept: Joi.string().required(),
    address: Joi.string().required(),
}).required()


export const signIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).required()


export const updateInfo = Joi.object({
    name: Joi.string().optional(),
    title: Joi.string().optional(),
    phone: Joi.string().optional(),
    dates: Joi.string().optional(),
    dept: Joi.string().optional(),
    address: Joi.string().optional(),
}).required()

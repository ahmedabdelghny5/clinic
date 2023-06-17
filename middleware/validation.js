import Joi from 'joi';
import { AppError } from '../utils/globalError.js';

export const generalFiled = {
    email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required().min(4).max(30),
    rePassword: Joi.string().valid(Joi.ref('password')).required(),
   
   
}
export const validation = (schema) => {
    return (req, res, next) => {
        let arrErr = []
        const inputData = { ...req.body, ...req.query, ...req.params };
        const { error } = schema.validate(inputData, { abortEarly: false })
        if (error) {
            error.details.map((err) => {
                arrErr.push(err.message)
            })
        }
        if (arrErr.length > 0) {
            return next(new AppError(arrErr, 400))
        } else {
            next()
        }
    }
}
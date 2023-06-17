import jwt from 'jsonwebtoken'
import { AppError, asyncHandler } from '../utils/globalError.js';
import { connection } from '../DB/dbConnection.js';

export const role = {
    patient: "patient",
    admins: "admins",
    docters: "docters",
}

export const auth = (accessRole = []) => {
    return asyncHandler(async (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            return next(new AppError("token not found", 404))
        }
        if (!token.startsWith(process.env.SecretKey)) {
            return next(new AppError("invalid secret key", 400))
        }
        const mainToken = token.split(process.env.SecretKey)[1];
        const decoded = jwt.verify(mainToken, process.env.signature)
        if (!decoded?.id) {
            return next(new AppError("invalid token payload", 400))
        }
        if (accessRole.includes(decoded.role)) {
            const query = `select * from ${role[decoded.role]} where id='${decoded.id}'`
            connection.execute(query, (err, result) => {
                if (err) {
                    return next(new AppError(err, 401));
                }
                if (!result.length) {
                    return next(new AppError('user not found', 404));
                }
                req.user = result[0]
                next()
            })
        }else{
            return next(new AppError('you are not authorizes', 404));
        }
    })
}
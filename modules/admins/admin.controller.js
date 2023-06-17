import { connection } from "../../DB/dbConnection.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sendEmail } from "../../utils/sendEmail.js"
import { AppError, asyncHandler } from "../../utils/globalError.js"

export const getAdmins = (req, res, next) => {
    const query = `select name,email from admins `
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (result.length < 0) {
            return next(new AppError("there is no admins", 404))
        }
        res.json({ msg: "success", result })
    })
}

export const signUp = (req, res, next) => {
    const { name, email, password } = req.body
    const query = `select * from admins where email='${email}'`
    connection.execute(query, async (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (result.length) {
            return next(new AppError("email already exist", 401))
        }
        const token = jwt.sign({ email }, process.env.signature)
        const link = `${req.protocol}://${req.headers.host}/admins/confirmEmail/${token}`
        await sendEmail(email, "confirmEmail", `<a href='${link}'>confirm email</a>`)
        const hash =  bcrypt.hashSync(password, +process.env.saltOrRounds)
        const getQuery = `INSERT INTO admins(name, email, password) 
                VALUES('${name}', '${email}','${hash}')`
        connection.execute(getQuery, (err, result) => {
            if (err) {
                return next(new AppError(err, 400))
            }
            result.affectedRows ? res.json({ msg: "success" }) : next(new AppError("fail", 500))
        })
    })
}

export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    if (!token) {
        return next(new AppError("token not found", 404))
    }
    const decoded = jwt.verify(token, process.env.signature)
    const query = `select * from admins where email='${decoded.email}' and confirmed="${0}"`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("there is no admin or already confirmed", 404))
        }
        const getQuery = `update admins set confirmed=${1} where email='${decoded.email}'`
        connection.execute(getQuery, (err, result) => {
            if (err) {
                return next(new AppError(err, 400))
            }
            result.affectedRows ? res.json({ msg: "success plz log in" }) : next(new AppError("fail", 500))
        })
    })

})

export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const query = `select * from admins where email='${email}' and confirmed="${1}"`
    connection.execute(query, async (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("plz login first or confirm your email", 404))
        }
        const match = await bcrypt.compare(password, result[0].password)
        if (!match) {
            return next(new AppError("password not match", 400))
        }
        const token = jwt.sign({ email: result[0].email, id: result[0].id, role: result[0].role }, process.env.signature)
        res.status(200).json({ msg: "success ", token })
    })
})

export const deleteComments = asyncHandler(async (req, res, next) => {
    const { commentId } = req.body
    const getQuery = `delete from comments  where id='${commentId}' `
    connection.execute(getQuery, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        console.log(result);
        result.affectedRows ? res.json({ msg: "success" }) : next(new AppError(" Comment not found", 404))
    })
})

export const deleteReply = asyncHandler(async (req, res, next) => {
    const { replyId } = req.body
    const getQuery = `delete from reply  where id='${replyId}'`
    connection.execute(getQuery, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        result.affectedRows ? res.json({ msg: "success" }) : next(new AppError("reply not found", 404))
    })
})




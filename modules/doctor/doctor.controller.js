import { connection } from "../../DB/dbConnection.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { sendEmail } from "../../utils/sendEmail.js"
import { AppError, asyncHandler } from "../../utils/globalError.js"

export const getDoctors = (req, res, next) => {
    const query = `select name,title,phone,dates from docters `
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (result.length < 0) {
            return next(new AppError("there is no doctors", 404))
        }
        res.json({ msg: "success", result })
    })
}


export const signUp = asyncHandler((req, res, next) => {
    const { name, email, password, title, phone, dates, dept, address } = req.body
    const query = `select * from docters where email="${email}"`
    connection.execute(query, async (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (result.length) {
            return next(new AppError("email already exist", 401))
        }
        const getQuery = `select * from patient where email="${email}"`
        connection.execute(getQuery, async (err, result) => {
            if (err) {
                return next(new AppError(err, 400))
            }
            if (result.length) {
                return next(new AppError("email already exist", 401))
            }
            const token = jwt.sign({ email }, process.env.signature)
            const link = `${req.protocol}://${req.headers.host}/doctors/confirmEmail/${token}`
            await sendEmail(email, "confirmEmail", `<a href='${link}'>confirm email</a>`)
            const hash = bcrypt.hashSync(password, +process.env.saltOrRounds)
            const getQuery = `INSERT INTO docters(name, email, password, title, phone, dates,dept,address) 
                VALUES('${name}', '${email}','${hash}', '${title}', '${phone}', '${dates}', '${dept}', '${address}')`
            connection.execute(getQuery, (err, result) => {
                if (err) {
                    return next(new AppError(err, 400))
                }
                result.affectedRows ? res.json({ msg: "success", result }) : next(new AppError("fail", 500))
            })
        })
    })
})


export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    if (!token) {
        return next(new AppError("token not found", 404))
    }
    const decoded = jwt.verify(token, process.env.signature)
    const query = `select * from docters where email='${decoded.email}' and confirmed="${0}"`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("there is no docters or already confirmed", 404))
        }
        const getQuery = `update docters set confirmed=${1} where email='${decoded.email}'`
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
    const query = `select * from docters where email='${email}' and confirmed="${1}"`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("plz login first or confirm your email", 404))
        }
        const match = bcrypt.compareSync(password, result[0].password)
        if (!match) {
            return next(new AppError("password not match", 400))
        }
        const token = jwt.sign({ email: result[0].email, id: result[0].id, role: result[0].role }, process.env.signature)
        res.status(200).json({ msg: "success ", token })
    })
})


export const updateInfo = asyncHandler(async (req, res, next) => {
    const { name, title, phone, dates, dept, address } = req.body
    const query = `select * from docters where email='${req.user.email}'`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("invalid email", 404))
        }
        const getQuery = `update docters set name='${name}',title='${title}',dates='${dates}',phone='${phone}',
          dept='${dept}',address='${address}'  where email='${req.user.email}'`
        connection.execute(getQuery, (err, result) => {
            if (err) {
                return next(new AppError(err, 400))
            }
            return res.json({ msg: "success" })
        })

    })
})


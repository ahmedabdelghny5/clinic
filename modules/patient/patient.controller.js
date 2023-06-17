import { connection } from "../../DB/dbConnection.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { sendEmail } from "../../utils/sendEmail.js"
import { AppError, asyncHandler } from "../../utils/globalError.js"

export const getPatients = (req, res, next) => {
    const query = `SELECT name,phone,dateOfBook FROM patient where booking="${1}"`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 401));
        }
        if (result.length < 0) {
            return next(new AppError('no result', 404));
        }
        return res.json({ msg: "success", result });
    })
}

export const signUp = (req, res, next) => {
    const { name, email, password, DOB, phone, gender } = req.body
    const query = `select * from patient where email="${email}"`
    connection.execute(query, async (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (result.length) {
            return next(new AppError("email already exist", 401))
        }
        const token = jwt.sign({ email }, process.env.signature)
        const link = `${req.protocol}://${req.headers.host}/patients/confirmEmail/${token}`
        await sendEmail(email, "confirmEmail", `<a href='${link}'>confirm email</a>`)
        const hash = bcrypt.hashSync(password, +process.env.saltOrRounds)
        const getQuery = `INSERT INTO patient(name, email, password, DOB, phone, gender) 
                VALUES('${name}', '${email}','${hash}', '${phone}', '${DOB}', '${gender}')`
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
    const query = `select * from patient where email='${decoded.email}' and confirmed="${0}"`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("there is no patient or already confirmed", 404))
        }
        const getQuery = `update patient set confirmed=${1} where email='${decoded.email}'`
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
    const query = `select * from patient where email='${email}' and confirmed="${1}"`
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
}
)


export const updatePatient = asyncHandler(async (req, res, next) => {
    const { name, DOB, phone, gender } = req.body
    const query = `select * from patient where email='${req.user.email}'`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("invalid email", 404))
        }
        const getQuery = `update patient set name='${name}',DOB='${DOB}',gender='${gender}',phone='${phone}'
            where email='${req.user.email}'`
        connection.execute(getQuery, (err, result) => {
            if (err) {
                return next(new AppError(err, 400))
            }
            result.affectedRows ? res.json({ msg: "success" }) : res.json({ msg: "fail" })
        })
    })
})

export const bookingDate = asyncHandler(async (req, res, next) => {
    const { dateOfBook } = req.body
    const query = `select * from patient where email='${req.user.email}' and booking='${0}'`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("invalid email or already booked", 404))
        }
        const getQuery = `update patient set booking='${1}',dateOfBook='${dateOfBook}'
            where email='${req.user.email}'`
        connection.execute(getQuery, (err, result) => {
            if (err) {
                return next(new AppError(err, 400))
            }
            return res.json({ msg: "success" })
        })
    })
}
)
export const cancelBookingDate = asyncHandler(async (req, res, next) => {

    const query = `select * from patient where email='${req.user.email}' and booking='${1}'`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("invalid email or already booked", 404))
        }
        const getQuery = `update patient set booking='${0}',dateOfBook=''
            where email='${req.user.email}'`
        connection.execute(getQuery, (err, result) => {
            if (err) {
                return next(new AppError(err, 400))
            }
            return res.json({ msg: "success" })
        })
    })
})
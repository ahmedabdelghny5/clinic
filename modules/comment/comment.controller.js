import { connection } from "../../DB/dbConnection.js"
import { AppError, asyncHandler } from "../../utils/globalError.js"

export const getComments = (req, res, next) => {
    const { docId } = req.body
    const getQuery = `SELECT comment FROM comments where docId="${docId}"`
    connection.execute(getQuery, (err, result) => {
        if (err) {
            return next(new AppError(err, 401));
        }
        if (result.length < 0) {
            return next(new AppError('no result', 404));
        }
        return res.json({ msg: "success", result });
    })
}

export const makeComment = asyncHandler(async (req, res, next) => {
    const { docId, comment } = req.body
    const query = `SELECT * from docters where id="${docId}"`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("doc email not found", 404))
        }
        const getQuery = `SELECT * from patient where id="${req.user.id}"`
        connection.execute(getQuery, (err, result) => {
            if (err) {
                return next(new AppError(err, 400))
            }
            if (!result.length) {
                return next(new AppError("patient email not found", 404))
            }
            const lastQuery = `INSERT INTO comments (userId, docId, comment) 
            VALUES('${req.user.id}', '${docId}', '${comment}')`
            connection.execute(lastQuery, (err, result) => {
                if (err) {
                    return next(new AppError(err, 400))
                }
                result.affectedRows ? res.json({ msg: "success" }) : next(new AppError("fail", 500))
            })
        })
    })
})


export const updateComment = asyncHandler(async (req, res, next) => {
    const { commentId, comment } = req.body
    const getQuery = `update comments set comment='${comment}' where userId='${req.user.id}' and id='${commentId}'`
    connection.execute(getQuery, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("commentId or patient email not correct", 404))
        }
        return res.json({ msg: "success" })
    })
})

export const deleteComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.body
    const getQuery = `delete from comments  where id='${commentId}' and userId='${req.user.id}' `
    connection.execute(getQuery, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        result.affectedRows ? res.json({ msg: "success" }) : next(new AppError("commentId or patient email not correct", 404))
    })
})


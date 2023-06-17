import { connection } from "../../DB/dbConnection.js"
import { AppError, asyncHandler } from "../../utils/globalError.js"

export const getIllness = (req, res, next) => {
    const getQuery = `SELECT * FROM illness`
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

export const addIllness = asyncHandler(async (req, res, next) => {
    const { details } = req.body
    const query = `INSERT INTO illness (details, adminId ) 
            VALUES('${details}', '${req.user.id}')`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        result.affectedRows ? res.json({ msg: "success" }) : next(new AppError("fail", 500))
    })

})


export const updateIllness = asyncHandler(async (req, res, next) => {
    const { details, illnessId } = req.body
    const getQuery = `update illness set details='${details}' where id='${illnessId}' and adminId='${req.user.id}'`
    connection.execute(getQuery, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        result.affectedRows ? res.json({ msg: "success" }) : next(new AppError("not the owner or not found", 500))
    })
})

export const deleteIllness = asyncHandler(async (req, res, next) => {
    const { illnessId } = req.body
    const getQuery = `delete from illness  where id='${illnessId}' and adminId='${req.user.id}' `
    connection.execute(getQuery, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        result.affectedRows ? res.json({ msg: "success" }) : next(new AppError("doc or patient email or idComment not correct", 404))
    })
})


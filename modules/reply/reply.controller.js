import { connection } from "../../DB/dbConnection.js"
import { AppError, asyncHandler } from "../../utils/globalError.js"

export const getReplies = (req, res, next) => {
    const { docId } = req.query
    const getQuery = `SELECT reply FROM reply where docId="${docId}"`
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

export const makeReply = asyncHandler(async (req, res, next) => {
    const { commentId, reply } = req.body
    const query = `SELECT * from comments where id="${commentId}" and docId="${req.user.id}"`
    connection.execute(query, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("commentId or doc email not found", 404))
        }
        console.log(result);
        const lastQuery = `INSERT INTO reply (userId, docId, commentId, reply) 
            VALUES('${result[0].userId}', '${req.user.id}', '${result[0].id}','${reply}') `
        connection.execute(lastQuery, (err, result) => {
            if (err) {
                return next(new AppError(err, 400))
            }
            result.affectedRows ? res.json({ msg: "success" }) : next(new AppError("fail", 500))
        })
    })

})


export const updateReply = asyncHandler(async (req, res, next) => {
    const { replyId, commentId, reply } = req.body
    const getQuery = `update reply set reply='${reply}' where id='${replyId}' 
     and docId='${req.user.id}' and commentId='${commentId}'`
    connection.execute(getQuery, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        if (!result.length) {
            return next(new AppError("doc or patient email not correct", 404))
        }
        result.affectedRows ? res.json({ msg: "success" }) : res.json({ msg: "fail" })
    })
})

export const deleteReply = asyncHandler(async (req, res, next) => {
    const { replyId } = req.body
    const getQuery = `delete from reply  where id='${replyId}' and docId='${req.user.id}'`
    connection.execute(getQuery, (err, result) => {
        if (err) {
            return next(new AppError(err, 400))
        }
        result.affectedRows ? res.json({ msg: "success" }) : next(new AppError("doc or patient email or idComment not correct", 404))
    })
})


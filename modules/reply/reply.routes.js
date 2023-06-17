import { Router } from "express";
import * as RC from "./reply.controller.js"
import { auth, role } from "../../middleware/auth.js";
const router = Router();


router.get('/', RC.getReplies)
router.post('/', auth(role.docters), RC.makeReply)
router.put('/', auth(role.docters), RC.updateReply)
router.delete('/', auth(role.docters), RC.deleteReply)



export default router
import { Router } from "express";
import * as CC from "./comment.controller.js"
import { auth, role } from "../../middleware/auth.js";

const router = Router();


router.get('/', CC.getComments)
router.post('/', auth(role.patient), CC.makeComment)
router.put('/', auth(role.patient), CC.updateComment)
router.delete('/', auth(role.patient), CC.deleteComment)



export default router
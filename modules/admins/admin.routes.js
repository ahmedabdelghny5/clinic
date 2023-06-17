import { Router } from "express";
import * as AC from "./admin.controller.js"
import { validation } from "../../middleware/validation.js";
import * as AV from "./adminValidation.js";

import { auth, role } from "../../middleware/auth.js";

const router = Router();


router.get('/', AC.getAdmins)
router.post('/signUp', validation(AV.signUp), AC.signUp)
router.get('/confirmEmail/:token', AC.confirmEmail)
router.post('/signIn', validation(AV.signIn), AC.signIn)
router.delete('/deleteComments', validation(AV.deleteComments), auth(role.admins), AC.deleteComments)
router.delete('/deleteReply', validation(AV.deleteReply), auth(role.admins), AC.deleteReply)



export default router
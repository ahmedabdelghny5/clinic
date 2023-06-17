import { Router } from "express";
import * as DC from "./doctor.controller.js"
import { auth, role } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as DV from "./doctorValidation.js";

const router = Router();


router.get('/get', DC.getDoctors)
router.post('/signUp', validation(DV.signUp), DC.signUp)
router.get('/confirmEmail/:token', DC.confirmEmail)
router.post('/signIn', validation(DV.signIn), DC.signIn)
router.put('/', validation(DV.updateInfo), auth(role.docters), DC.updateInfo)


export default router
import { Router } from "express";
import * as IC from "./illness.controller.js"
import { auth, role } from "../../middleware/auth.js";

const router = Router();


router.get('/', IC.getIllness)
router.post('/', auth(role.admins), IC.addIllness)
router.put('/', auth(role.admins), IC.updateIllness)
router.delete('/', auth(role.admins), IC.deleteIllness)



export default router
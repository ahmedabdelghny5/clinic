import { Router } from "express";
import * as PC from "./patient.controller.js"
import { validation } from "../../middleware/validation.js";
import * as PV from "./patientValidation.js";
import { auth, role } from "../../middleware/auth.js";


const router = Router();


router.get('/get', PC.getPatients)


router.post('/signUp', validation(PV.signUp), PC.signUp)
router.get('/confirmEmail/:token', PC.confirmEmail)
router.post('/signIn', validation(PV.signIn), PC.signIn)
router.put('/update', auth(role.patient), validation(PV.updateInfo), PC.updatePatient)
router.put('/bookingDate', auth(role.patient), validation(PV.bookingDate), PC.bookingDate)
router.put('/cancelBookingDate', auth(role.patient), PC.cancelBookingDate)


export default router
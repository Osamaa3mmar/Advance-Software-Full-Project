import { Router } from "express";
import reservationController from "../Controllers/ReservationController.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isPatient } from "../Middleware/IsPatient.js";
import { isDoctor } from "../Middleware/IsDoctor.js";

const reservationRouter = Router();

reservationRouter.post(
  "/patient/create",
  isLogin,
  isPatient,
  reservationController.createReservation
);

reservationRouter.get(
  "/patient/my-reservations",
  isLogin,
  isPatient,
  reservationController.getPatientReservations
);

reservationRouter.get(
  "/doctor/reservations",
  isLogin,
  isDoctor,
  reservationController.getDoctorReservations
);

reservationRouter.put(
  "/doctor/update-status/:reservationId",
  isLogin,
  isDoctor,
  reservationController.updateReservationStatus
);

reservationRouter.put(
  "/doctor/update-pref/:reservationId",
  isLogin,
  isDoctor,
  reservationController.updateReservationPref
);

reservationRouter.post(
  "/doctor/create-appointment",
  isLogin,
  isDoctor,
  reservationController.createDoctorAppointment
);

reservationRouter.get(
  "/doctor/appointments",
  isLogin,
  isDoctor,
  reservationController.getDoctorAppointments
);

export default reservationRouter;

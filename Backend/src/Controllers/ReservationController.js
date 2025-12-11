import { ReservationService } from "../Services/ReservationService.js";

class ReservationController {
  createReservation = async (req, res) => {
    try {
      const patientId = req.user.id;
      const response = await ReservationService.createReservation(
        patientId,
        req.body
      );
      if (response.success) {
        return res.status(201).json({
          message: response.message,
          reservationId: response.reservationId,
        });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  getPatientReservations = async (req, res) => {
    try {
      const patientId = req.user.id;
      const response = await ReservationService.getPatientReservations(
        patientId
      );
      if (response.success) {
        return res.status(200).json({ reservations: response.reservations });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  getDoctorReservations = async (req, res) => {
    try {
      const doctorId = req.user.id;
      const response = await ReservationService.getDoctorReservations(doctorId);
      if (response.success) {
        return res.status(200).json({ reservations: response.reservations });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  updateReservationStatus = async (req, res) => {
    try {
      const doctorId = req.user.id;
      const { reservationId } = req.params;
      const { status } = req.body;
      const response = await ReservationService.updateReservationStatus(
        doctorId,
        reservationId,
        status
      );
      if (response.success) {
        return res.status(200).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  updateReservationPref = async (req, res) => {
    try {
      const doctorId = req.user.id;
      const { reservationId } = req.params;
      const { pref } = req.body;
      const response = await ReservationService.updateReservationPref(
        doctorId,
        reservationId,
        pref
      );
      if (response.success) {
        return res.status(200).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  createDoctorAppointment = async (req, res) => {
    // try {
      const doctorId = req.user.id;
      const response = await ReservationService.createDoctorAppointment(
        doctorId,
        req.body
      );
      if (response.success) {
        return res.status(201).json({
          message: response.message,
          appointmentId: response.appointmentId,
        });
      } else {
        return res.status(400).json({ message: response.message });
      }
    // } catch (error) {
    //   return res.status(500).json({ message: "Server Error", error });
    // }
  };

  getDoctorAppointments = async (req, res) => {
    try {
      const doctorId = req.user.id;
      const response = await ReservationService.getDoctorAppointments(doctorId);
      if (response.success) {
        return res.status(200).json({ appointments: response.appointments });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };
}

const reservationController = new ReservationController();
export default reservationController;

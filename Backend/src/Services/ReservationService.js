import { ReservationRepository } from "../Repositories/ReservationRepository.js";

export class ReservationService {
  static createReservation = async (patientId, reservationData) => {
    try {
      if (!reservationData.doctor_appointment_id) {
        return {
          success: false,
          message: "Doctor appointment ID is required",
        };
      }

      const appointment = await ReservationRepository.getDoctorAppointmentById(
        reservationData.doctor_appointment_id
      );
      if (!appointment) {
        return {
          success: false,
          message: "Doctor appointment not found",
        };
      }

      const reservationStartTime =
        reservationData.start_time || appointment.start_time;
      const reservationEndTime =
        reservationData.end_time || appointment.end_time;

      const parseMySQLDateTime = (dateTime) => {
        if (typeof dateTime === "string") {
          if (dateTime.includes("T")) {
            return dateTime.replace("T", " ").replace("Z", "");
          }
        }
        return dateTime;
      };

      const appointmentStart = parseMySQLDateTime(appointment.start_time);
      const appointmentEnd = parseMySQLDateTime(appointment.end_time);
      const resStart = parseMySQLDateTime(reservationStartTime);
      const resEnd = parseMySQLDateTime(reservationEndTime);

      if (resStart < appointmentStart || resEnd > appointmentEnd) {
        return {
          success: false,
          message: "Reservation time must be within doctor appointment hours",
        };
      }

      if (resStart >= resEnd) {
        return {
          success: false,
          message: "Reservation end time must be after start time",
        };
      }

      const overlappingReservations =
        await ReservationRepository.findOverlappingReservations(
          reservationData.doctor_appointment_id,
          reservationStartTime,
          reservationEndTime
        );

      if (overlappingReservations.length > 0) {
        return {
          success: false,
          message: "This time slot is already booked by another patient",
        };
      }

      const reservation = {
        patient_id: patientId,
        doctor_appointment_id: reservationData.doctor_appointment_id,
        pref: reservationData.pref || null,
        status: "PENDING",
        start_time: reservationStartTime,
        end_time: reservationEndTime,
      };

      const result = await ReservationRepository.createReservation(reservation);

      if (result.affectedRows > 0) {
        return {
          success: true,
          message: "Reservation created successfully",
          reservationId: result.insertId,
        };
      } else {
        return { success: false, message: "Failed to create reservation" };
      }
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static getPatientReservations = async (patientId) => {
    try {
      const reservations =
        await ReservationRepository.getReservationsByPatientId(patientId);
      return {
        success: true,
        reservations,
      };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static getDoctorReservations = async (doctorId) => {
    try {
      const reservations =
        await ReservationRepository.getReservationsByDoctorId(doctorId);
      return {
        success: true,
        reservations,
      };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static updateReservationStatus = async (
    doctorId,
    reservationId,
    newStatus
  ) => {
    try {
      if (!newStatus) {
        return { success: false, message: "Status is required" };
      }

      const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"];
      if (!validStatuses.includes(newStatus)) {
        return { success: false, message: "Invalid status value" };
      }

      const reservation = await ReservationRepository.getReservationById(
        reservationId
      );
      if (!reservation) {
        return { success: false, message: "Reservation not found" };
      }

      if (reservation.doctor_id !== doctorId) {
        return {
          success: false,
          message: "Unauthorized to update this reservation",
        };
      }

      const result = await ReservationRepository.updateReservationStatus(
        reservationId,
        newStatus
      );

      if (result.affectedRows > 0) {
        return {
          success: true,
          message: "Reservation status updated successfully",
        };
      } else {
        return { success: false, message: "Failed to update status" };
      }
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static updateReservationPref = async (doctorId, reservationId, newPref) => {
    try {
      const reservation = await ReservationRepository.getReservationById(
        reservationId
      );
      if (!reservation) {
        return { success: false, message: "Reservation not found" };
      }

      if (reservation.doctor_id !== doctorId) {
        return {
          success: false,
          message: "Unauthorized to update this reservation",
        };
      }

      const result = await ReservationRepository.updateReservationPref(
        reservationId,
        newPref
      );

      if (result.affectedRows > 0) {
        return {
          success: true,
          message: "Reservation preference updated successfully",
        };
      } else {
        return { success: false, message: "Failed to update preference" };
      }
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static createDoctorAppointment = async (doctorId, appointmentData) => {
    // try {
    if (!appointmentData.start_time || !appointmentData.end_time) {
      return {
        success: false,
        message: "Start time and end time are required",
      };
    }

    const startTime = new Date(appointmentData.start_time);
    const endTime = new Date(appointmentData.end_time);

    if (startTime >= endTime) {
      return {
        success: false,
        message: "End time must be after start time",
      };
    }

    const appointment = {
      doctor_id: doctorId,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
      category: appointmentData.category || null,
      additional_info: appointmentData.additional_info || null,
    };

    const result = await ReservationRepository.createDoctorAppointment(
      appointment
    );

    if (result.affectedRows > 0) {
      return {
        success: true,
        message: "Appointment schedule created successfully",
        appointmentId: result.insertId,
      };
    } else {
      return { success: false, message: "Failed to create appointment" };
    }
    // } catch (error) {
    //   return { success: false, message: "Server error", error };
    // }
  };

  static getDoctorAppointments = async (doctorId) => {
    try {
      const appointments =
        await ReservationRepository.getDoctorAppointmentsByDoctorId(doctorId);
      return {
        success: true,
        appointments,
      };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };
}

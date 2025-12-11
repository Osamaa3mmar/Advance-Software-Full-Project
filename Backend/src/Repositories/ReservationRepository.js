import { connection } from "../../Database/Connection.js";

export class ReservationRepository {
  static createReservation = async (reservation) => {
    const startTime = ReservationRepository.formatToMySQLDatetime(
      reservation.start_time
    );
    const endTime = ReservationRepository.formatToMySQLDatetime(
      reservation.end_time
    );
    let [rows] = await connection.query(
      "INSERT INTO reservations (patient_id, doctor_appointment_id, pref, status, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
      [
        reservation.patient_id,
        reservation.doctor_appointment_id,
        reservation.pref,
        reservation.status,
        startTime,
        endTime,
      ]
    );
    return rows;
  };

  static getReservationsByPatientId = async (patientId) => {
    let [rows] = await connection.query(
      `SELECT 
        r.id,
        r.patient_id,
        r.doctor_appointment_id,
        r.pref,
        r.status,
        r.start_time,
        r.end_time,
        r.created_at,
        u.first_name AS doctor_first_name,
        u.last_name AS doctor_last_name,
        u.email AS doctor_email,
        d.specialization AS doctor_specialization,
        da.start_time AS appointment_start_time,
        da.end_time AS appointment_end_time,
        da.category AS appointment_category
      FROM reservations r
      LEFT JOIN doctor_appointments da ON r.doctor_appointment_id = da.id
      LEFT JOIN doctors d ON da.doctor_id = d.user_id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE r.patient_id = ?
      ORDER BY r.created_at DESC`,
      [patientId]
    );
    return rows;
  };

  static getReservationsByDoctorId = async (doctorId) => {
    let [rows] = await connection.query(
      `SELECT 
        r.id,
        r.patient_id,
        r.doctor_appointment_id,
        r.pref,
        r.status,
        r.start_time,
        r.end_time,
        r.created_at,
        u.first_name AS patient_first_name,
        u.last_name AS patient_last_name,
        u.email AS patient_email,
        u.phone_number AS patient_phone,
        p.insurance_number AS patient_insurance,
        da.start_time AS appointment_start_time,
        da.end_time AS appointment_end_time,
        da.category AS appointment_category
      FROM reservations r
      LEFT JOIN patients p ON r.patient_id = p.user_id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN doctor_appointments da ON r.doctor_appointment_id = da.id
      WHERE da.doctor_id = ?
      ORDER BY r.created_at DESC`,
      [doctorId]
    );
    return rows;
  };

  static getReservationById = async (reservationId) => {
    let [rows] = await connection.query(
      `SELECT 
        r.*,
        da.doctor_id
      FROM reservations r
      LEFT JOIN doctor_appointments da ON r.doctor_appointment_id = da.id
      WHERE r.id = ?`,
      [reservationId]
    );
    return rows[0];
  };

  static updateReservationStatus = async (reservationId, status) => {
    let [rows] = await connection.query(
      "UPDATE reservations SET status = ? WHERE id = ?",
      [status, reservationId]
    );
    return rows;
  };

  static updateReservationPref = async (reservationId, pref) => {
    let [rows] = await connection.query(
      "UPDATE reservations SET pref = ? WHERE id = ?",
      [pref, reservationId]
    );
    return rows;
  };

  static getDoctorAppointmentById = async (appointmentId) => {
    let [rows] = await connection.query(
      "SELECT * FROM doctor_appointments WHERE id = ?",
      [appointmentId]
    );
    return rows[0];
  };

  static formatToMySQLDatetime = (value) => {
    if (!value) return null;
    if (typeof value === "string") {
      if (value.includes("T") && value.includes("Z")) {
        return value.replace("T", " ").replace("Z", "");
      }
      if (value.includes("T")) {
        return value.replace("T", " ");
      }
      return value;
    }
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      const hours = String(value.getHours()).padStart(2, "0");
      const minutes = String(value.getMinutes()).padStart(2, "0");
      const seconds = String(value.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    return value;
  };

  static createDoctorAppointment = async (appointment) => {
    const startTime = ReservationRepository.formatToMySQLDatetime(
      appointment.start_time
    );
    const endTime = ReservationRepository.formatToMySQLDatetime(
      appointment.end_time
    );
    let [rows] = await connection.query(
      "INSERT INTO doctor_appointments (doctor_id, start_time, end_time, category, additional_info) VALUES (?, ?, ?, ?, ?)",
      [
        appointment.doctor_id,
        startTime,
        endTime,
        appointment.category,
        appointment.additional_info,
      ]
    );
    return rows;
  };

  static getDoctorAppointmentsByDoctorId = async (doctorId) => {
    let [rows] = await connection.query(
      "SELECT * FROM doctor_appointments WHERE doctor_id = ? ORDER BY start_time DESC",
      [doctorId]
    );
    return rows;
  };

  static findOverlappingReservations = async (
    doctorAppointmentId,
    startTime,
    endTime
  ) => {
    const formattedStartTime =
      ReservationRepository.formatToMySQLDatetime(startTime);
    const formattedEndTime =
      ReservationRepository.formatToMySQLDatetime(endTime);

    let [rows] = await connection.query(
      `SELECT id, patient_id, start_time, end_time FROM reservations 
       WHERE doctor_appointment_id = ? 
       AND status NOT IN ('CANCELED') 
       AND (
         (start_time < ? AND end_time > ?) OR
         (start_time < ? AND end_time > ?) OR
         (start_time >= ? AND end_time <= ?)
       )`,
      [
        doctorAppointmentId,
        formattedEndTime,
        formattedStartTime,
        formattedStartTime,
        formattedStartTime,
        formattedStartTime,
        formattedEndTime,
      ]
    );
    return rows;
  };
}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

// Helper function to format appointment for frontend response (_id & docId aliases)
const formatAppointment = (app) => ({
  ...app,
  _id: app.id,
  docId: app.doctorId,
  userId: app.userId,
  slotDate: app.slotDate,
  slotTime: app.slotTime,
  userData: app.userData,
  docData: app.docData,
  isCompleted: app.isCompleted,
});

// API to change doctor availability status
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const doc = await prisma.doctor.findUnique({
      where: { id: docId },
    });

    if (!doc) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await prisma.doctor.update({
      where: { id: docId },
      data: { available: !doc.available },
    });

    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for frontend (with reconstructed slots_booked)
const doctorList = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        speciality: true,
        degree: true,
        experience: true,
        about: true,
        available: true,
        fees: true,
        address: true,
      },
    });

    const slots = await prisma.doctorSlot.findMany({
      select: {
        doctorId: true,
        slotDate: true,
        slotTime: true,
      },
    });

    // Group slots by doctor and date
    const slotsMap = {};
    for (const slot of slots) {
      if (!slotsMap[slot.doctorId]) slotsMap[slot.doctorId] = {};
      if (!slotsMap[slot.doctorId][slot.slotDate]) {
        slotsMap[slot.doctorId][slot.slotDate] = [];
      }
      slotsMap[slot.doctorId][slot.slotDate].push(slot.slotTime);
    }

    const formattedDoctors = doctors.map((doc) => ({
      ...doc,
      _id: doc.id,
      fees: Number(doc.fees),
      slots_booked: slotsMap[doc.id] || {},
    }));

    res.json({ success: true, doctors: formattedDoctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor.id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: docId },
    });

    res.json({ success: true, appointments: appointments.map(formatAppointment) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const result = await prisma.appointment.updateMany({
      where: { id: appointmentId, doctorId: docId },
      data: { isCompleted: true },
    });

    if (result.count > 0) {
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const result = await prisma.appointment.updateMany({
      where: { id: appointmentId, doctorId: docId },
      data: { cancelled: true },
    });

    if (result.count > 0) {
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: docId },
    });

    let earnings = 0;
    const patientIds = new Set();
    appointments.forEach((app) => {
      if (app.isCompleted || app.payment) {
        earnings += Number(app.amount);
      }
      patientIds.add(app.userId);
    });

    const latestAppointments = await prisma.appointment.findMany({
      where: { doctorId: docId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientIds.size,
      latestAppointments: latestAppointments.map(formatAppointment),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctor = await prisma.doctor.findUnique({
      where: { id: docId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        speciality: true,
        degree: true,
        experience: true,
        about: true,
        available: true,
        fees: true,
        address: true,
      },
    });

    if (!doctor) {
      return res.json({ success: false, message: "Doctor Profile Not Found" });
    }

    const profileData = {
      ...doctor,
      _id: doctor.id,
      fees: Number(doctor.fees),
    };

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

    await prisma.doctor.update({
      where: { id: docId },
      data: {
        fees: parseFloat(fees),
        address: parsedAddress,
        available,
      },
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};

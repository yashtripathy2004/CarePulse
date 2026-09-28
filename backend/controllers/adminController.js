import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
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
  date: app.date ? Number(app.date) : app.date,
  amount: app.amount ? Number(app.amount) : app.amount,
});

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

    await prisma.doctor.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: imageUrl,
        speciality,
        degree,
        experience,
        about,
        fees: parseFloat(fees),
        address: parsedAddress,
        date: BigInt(Date.now()),
      },
    });

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
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
        date: true,
      },
    });

    const formattedDoctors = doctors.map((doc) => ({
      ...doc,
      _id: doc.id,
      fees: Number(doc.fees),
      date: Number(doc.date),
    }));

    res.json({ success: true, doctors: formattedDoctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany();
    const formattedAppointments = appointments.map(formatAppointment);
    res.json({ success: true, appointments: formattedAppointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for appointment cancellation by admin
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.json({ success: false, message: "Appointment Not Found" });
    }

    await prisma.$transaction([
      prisma.appointment.update({
        where: { id: appointmentId },
        data: { cancelled: true },
      }),
      prisma.doctorSlot.deleteMany({
        where: {
          doctorId: appointment.doctorId,
          slotDate: appointment.slotDate,
          slotTime: appointment.slotTime,
        },
      }),
    ]);

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const [doctors, appointments, patients, latestAppointments] = await Promise.all([
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.user.count(),
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const dashData = {
      doctors,
      appointments,
      patients,
      latestAppointments: latestAppointments.map(formatAppointment),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};

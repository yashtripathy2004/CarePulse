import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import razorpay from "razorpay";
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

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        dob: true,
        gender: true,
        image: true,
      },
    });

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    res.json({ success: true, userData: { ...user, _id: user.id } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

    let imageURL = null;
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageURL = imageUpload.secure_url;
    }

    const updateData = {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    };
    if (imageURL) {
      updateData.image = imageURL;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await prisma.doctor.findUnique({
      where: { id: docId },
      select: {
        id: true,
        name: true,
        speciality: true,
        degree: true,
        experience: true,
        about: true,
        fees: true,
        address: true,
        image: true,
        available: true,
      },
    });

    if (!docData || !docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    const formattedDocData = {
      ...docData,
      _id: docData.id,
      fees: Number(docData.fees),
    };

    try {
      await prisma.$transaction(async (tx) => {
        // Atomic slot lock via unique constraint in doctor_slots table
        await tx.doctorSlot.create({
          data: {
            doctorId: docId,
            slotDate,
            slotTime,
          },
        });

        const userData = await tx.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            dob: true,
            gender: true,
            image: true,
          },
        });

        const formattedUserData = {
          ...userData,
          _id: userData.id,
        };

        await tx.appointment.create({
          data: {
            userId,
            doctorId: docId,
            slotDate,
            slotTime,
            userData: formattedUserData,
            docData: formattedDocData,
            amount: docData.fees,
            date: BigInt(Date.now()),
          },
        });
      });

      res.json({ success: true, message: "Appointment Booked" });
    } catch (err) {
      if (err.code === "P2002") {
        return res.json({ success: false, message: "Slot not available" });
      }
      throw err;
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await prisma.appointment.findMany({
      where: { userId },
    });

    res.json({ success: true, appointments: appointments.map(formatAppointment) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
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

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment of appointment using Razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    const options = {
      amount: Number(appointment.amount) * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify payment of Razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await prisma.appointment.update({
        where: { id: orderInfo.receipt },
        data: { payment: true },
      });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};

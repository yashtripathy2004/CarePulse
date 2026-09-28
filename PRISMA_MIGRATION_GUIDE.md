# 🚀 Raw SQL to Prisma ORM Migration Comparison

This document details every raw PostgreSQL query that was originally in the project and its equivalent **Clean Prisma ORM** implementation.

---

## 1. Database Connection & Ping

### ❌ **Earlier Raw SQL (pg Pool):**
```javascript
import pool from "./config/db.js";

pool.query("SELECT NOW()")
  .then(() => console.log("PostgreSQL Connected Successfully"))
  .catch((err) => console.error("Database connection error:", err));
```

### ✅ **Clean Prisma Way:**
```javascript
import prisma from "./config/prisma.js";

prisma.$connect()
  .then(() => console.log("PostgreSQL Connected Successfully via Prisma"))
  .catch((err) => console.error("Database connection error:", err));
```

---

## 2. Admin Controller (`adminController.js`)

### A. Insert New Doctor
#### ❌ **Earlier Raw SQL:**
```javascript
const insertQuery = `
  INSERT INTO doctors (name, email, password, image, speciality, degree, experience, about, fees, address, date)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING id;
`;
await query(insertQuery, [
  name, email, hashedPassword, imageUrl, speciality, degree, 
  experience, about, fees, JSON.stringify(parsedAddress), Date.now()
]);
```

#### ✅ **Clean Prisma Way:**
```javascript
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
```

---

### B. Fetch All Doctors
#### ❌ **Earlier Raw SQL:**
```javascript
const { rows } = await query(
  `SELECT id AS _id, name, email, image, speciality, degree, experience, about, available, fees, address, date 
   FROM doctors`
);
```

#### ✅ **Clean Prisma Way:**
```javascript
const doctors = await prisma.doctor.findMany({
  select: {
    id: true, name: true, email: true, image: true, speciality: true,
    degree: true, experience: true, about: true, available: true,
    fees: true, address: true, date: true,
  },
});
```

---

### C. Fetch All Appointments
#### ❌ **Earlier Raw SQL:**
```javascript
const { rows } = await query(
  `SELECT id AS _id, user_id AS "userId", doctor_id AS "docId", slot_date AS "slotDate", 
          slot_time AS "slotTime", user_data AS "userData", doc_data AS "docData", 
          amount, date, cancelled, payment, is_completed AS "isCompleted" 
   FROM appointments`
);
```

#### ✅ **Clean Prisma Way:**
```javascript
const appointments = await prisma.appointment.findMany();
```

---

### D. Cancel Appointment (Transaction & Slot Removal)
#### ❌ **Earlier Raw SQL:**
```javascript
await client.query("BEGIN");

const appRes = await client.query(
  `UPDATE appointments SET cancelled = true WHERE id = $1 RETURNING doctor_id, slot_date, slot_time`,
  [appointmentId]
);

const { doctor_id, slot_date, slot_time } = appRes.rows[0];

await client.query(
  `DELETE FROM doctor_slots WHERE doctor_id = $1 AND slot_date = $2 AND slot_time = $3`,
  [doctor_id, slot_date, slot_time]
);

await client.query("COMMIT");
```

#### ✅ **Clean Prisma Way:**
```javascript
const appointment = await prisma.appointment.findUnique({
  where: { id: appointmentId },
});

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
```

---

### E. Admin Dashboard Analytics & Latest Appointments
#### ❌ **Earlier Raw SQL:**
```javascript
const countsRes = await query(`
  SELECT 
    (SELECT COUNT(*) FROM doctors) AS doctors,
    (SELECT COUNT(*) FROM appointments) AS appointments,
    (SELECT COUNT(*) FROM users) AS patients
`);

const latestRes = await query(`
  SELECT id AS _id, user_id AS "userId", doctor_id AS "docId", slot_date AS "slotDate", 
         slot_time AS "slotTime", user_data AS "userData", doc_data AS "docData", 
         amount, date, cancelled, payment, is_completed AS "isCompleted" 
  FROM appointments 
  ORDER BY created_at DESC 
  LIMIT 5
`);
```

#### ✅ **Clean Prisma Way:**
```javascript
const [doctors, appointments, patients, latestAppointments] = await Promise.all([
  prisma.doctor.count(),
  prisma.appointment.count(),
  prisma.user.count(),
  prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  }),
]);
```

---

## 3. Doctor Controller (`doctorController.js`)

### A. Toggle Doctor Availability
#### ❌ **Earlier Raw SQL:**
```javascript
await query(`UPDATE doctors SET available = NOT available WHERE id = $1`, [docId]);
```

#### ✅ **Clean Prisma Way:**
```javascript
const doc = await prisma.doctor.findUnique({ where: { id: docId } });
await prisma.doctor.update({
  where: { id: docId },
  data: { available: !doc.available },
});
```

---

### B. Fetch Doctor List & Booked Slots
#### ❌ **Earlier Raw SQL:**
```javascript
const doctorsRes = await query(`SELECT id AS _id, name, image, speciality, degree, experience, about, available, fees, address FROM doctors`);
const slotsRes = await query(`SELECT doctor_id, slot_date, slot_time FROM doctor_slots`);
```

#### ✅ **Clean Prisma Way:**
```javascript
const doctors = await prisma.doctor.findMany({
  select: {
    id: true, name: true, image: true, speciality: true,
    degree: true, experience: true, about: true, available: true,
    fees: true, address: true,
  },
});

const slots = await prisma.doctorSlot.findMany({
  select: { doctorId: true, slotDate: true, slotTime: true },
});
```

---

### C. Doctor Login & Profile Lookup
#### ❌ **Earlier Raw SQL:**
```javascript
const { rows } = await query(`SELECT * FROM doctors WHERE email = $1`, [email]);
```

#### ✅ **Clean Prisma Way:**
```javascript
const doctor = await prisma.doctor.findUnique({
  where: { email },
});
```

---

### D. Complete / Cancel Doctor Appointment
#### ❌ **Earlier Raw SQL:**
```javascript
const { rowCount } = await query(
  `UPDATE appointments SET is_completed = true WHERE id = $1 AND doctor_id = $2`,
  [appointmentId, docId]
);
```

#### ✅ **Clean Prisma Way:**
```javascript
const result = await prisma.appointment.updateMany({
  where: { id: appointmentId, doctorId: docId },
  data: { isCompleted: true },
});
```

---

### E. Doctor Dashboard Stats (Earnings, Appointments, Patients)
#### ❌ **Earlier Raw SQL:**
```javascript
const statsRes = await query(
  `SELECT 
     COALESCE(SUM(CASE WHEN is_completed = true OR payment = true THEN amount ELSE 0 END), 0) AS earnings,
     COUNT(id) AS total_appointments,
     COUNT(DISTINCT user_id) AS total_patients
   FROM appointments 
   WHERE doctor_id = $1`,
  [docId]
);

const latestRes = await query(
  `SELECT id AS _id, user_id AS "userId", doctor_id AS "docId", slot_date AS "slotDate", 
          slot_time AS "slotTime", user_data AS "userData", doc_data AS "docData", 
          amount, date, cancelled, payment, is_completed AS "isCompleted" 
   FROM appointments 
   WHERE doctor_id = $1 
   ORDER BY created_at DESC 
   LIMIT 5`,
  [docId]
);
```

#### ✅ **Clean Prisma Way:**
```javascript
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
```

---

## 4. User Controller (`userController.js`)

### A. Register User
#### ❌ **Earlier Raw SQL:**
```javascript
const { rows } = await query(
  `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`,
  [name, email, hashedPassword]
);
```

#### ✅ **Clean Prisma Way:**
```javascript
const user = await prisma.user.create({
  data: { name, email, password: hashedPassword },
});
```

---

### B. User Login
#### ❌ **Earlier Raw SQL:**
```javascript
const { rows } = await query(`SELECT * FROM users WHERE email = $1`, [email]);
```

#### ✅ **Clean Prisma Way:**
```javascript
const user = await prisma.user.findUnique({ where: { email } });
```

---

### C. Update User Profile
#### ❌ **Earlier Raw SQL:**
```javascript
await query(
  `UPDATE users SET name = $1, phone = $2, address = $3, dob = $4, gender = $5, image = $6 WHERE id = $7`,
  [name, phone, JSON.stringify(parsedAddress), dob, gender, imageURL, userId]
);
```

#### ✅ **Clean Prisma Way:**
```javascript
await prisma.user.update({
  where: { id: userId },
  data: {
    name,
    phone,
    address: parsedAddress,
    dob,
    gender,
    ...(imageURL && { image: imageURL }),
  },
});
```

---

### D. Book Appointment with Atomic Slot Lock
#### ❌ **Earlier Raw SQL:**
```javascript
await client.query("BEGIN");
const docRes = await client.query(`SELECT ... FROM doctors WHERE id = $1`, [docId]);

await client.query(`INSERT INTO doctor_slots (doctor_id, slot_date, slot_time) VALUES ($1, $2, $3)`, [docId, slotDate, slotTime]);

const userRes = await client.query(`SELECT ... FROM users WHERE id = $1`, [userId]);

await client.query(`INSERT INTO appointments ... VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [...]);
await client.query("COMMIT");
```

#### ✅ **Clean Prisma Way:**
```javascript
await prisma.$transaction(async (tx) => {
  // Lock slot atomically via unique constraint (doctorId, slotDate, slotTime)
  await tx.doctorSlot.create({
    data: { doctorId: docId, slotDate, slotTime },
  });

  const userData = await tx.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, address: true, dob: true, gender: true, image: true },
  });

  await tx.appointment.create({
    data: {
      userId,
      doctorId: docId,
      slotDate,
      slotTime,
      userData: { ...userData, _id: userData.id },
      docData: formattedDocData,
      amount: docData.fees,
      date: BigInt(Date.now()),
    },
  });
});
```

---

### E. Verify Payment (Razorpay)
#### ❌ **Earlier Raw SQL:**
```javascript
await query(`UPDATE appointments SET payment = true WHERE id = $1`, [orderInfo.receipt]);
```

#### ✅ **Clean Prisma Way:**
```javascript
await prisma.appointment.update({
  where: { id: orderInfo.receipt },
  data: { payment: true },
});
```

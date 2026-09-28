# 🏥 CarePulse — Doctor Appointment Booking System

A full-stack doctor appointment booking platform built with **React**, **Node.js**, **Express**, **PostgreSQL**, and **Prisma ORM**. Features three separate interfaces — a patient-facing website, an admin dashboard, and a doctor panel — with integrated **Razorpay** payments and **Cloudinary** image uploads.

---

## ✨ Features

### 👤 Patient Portal
- User registration & JWT-based authentication
- Browse doctors by speciality (General Physician, Gynecologist, Dermatologist, Pediatrician, Neurologist, Gastroenterologist)
- View doctor profiles with availability status
- Book appointment slots with real-time availability checking
- Online payment via **Razorpay** (test mode supported)
- View, manage, and cancel appointments
- Update profile with image upload

### 🛡️ Admin Dashboard
- Secure admin login with environment-based credentials
- Add new doctors with profile image upload via **Cloudinary**
- View and manage all doctors
- Toggle doctor availability
- View all appointments across the platform
- Cancel appointments
- Dashboard with key metrics (total doctors, patients, appointments)

### 🩺 Doctor Panel
- Doctor login with hashed password authentication
- View assigned appointments
- Mark appointments as completed
- Update profile (fees, address, availability)
- Dashboard with earnings, patient count, and latest appointments

### 🔒 Security & Data Integrity
- **Race-condition safe booking**: PostgreSQL unique constraints + Prisma transactions prevent double-booking
- **JWT authentication** on all protected routes
- **Bcrypt** password hashing
- **Role-based middleware** (Admin, Doctor, User)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, React Router, Axios |
| **Admin Panel** | React 18, Vite, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | JSON Web Tokens (JWT) |
| **Payments** | Razorpay |
| **Image Storage** | Cloudinary |
| **Password Hashing** | Bcrypt |

---

## 📁 Project Structure

```
CarePulse/
├── backend/                  # Express.js REST API
│   ├── config/               # Database & Cloudinary config
│   ├── controllers/          # Route handlers (admin, doctor, user)
│   ├── middleware/            # Auth middleware (JWT verification)
│   ├── routes/               # API route definitions
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/       # PostgreSQL migrations
│   │   └── seed.js           # Seed script (30 sample doctors)
│   ├── server.js             # Entry point
│   └── .env.example          # Environment variables template
├── frontend/                 # Patient-facing React app
│   └── src/
│       ├── pages/            # Home, Doctors, Appointment, MyAppointments, Login, Profile
│       ├── components/       # Navbar, Footer, TopDoctors, Banner, etc.
│       └── context/          # AppContext (global state)
├── admin/                    # Admin & Doctor dashboard React app
│   └── src/
│       ├── pages/Admin/      # AddDoctor, DoctorsList, AllAppointments, Dashboard
│       ├── pages/Doctor/     # DoctorAppointments, DoctorDashboard, DoctorProfile
│       └── context/          # AdminContext, DoctorContext, AppContext
└── .gitignore
```

---

## 🗄️ Database Schema

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐
│  users   │     │   doctors   │     │ doctor_slots  │
├──────────┤     ├─────────────┤     ├──────────────┤
│ id (PK)  │     │ id (PK)     │◄────│ doctor_id    │
│ name     │     │ name        │     │ slot_date    │
│ email    │     │ email       │     │ slot_time    │
│ password │     │ password    │     │ (unique      │
│ image    │     │ speciality  │     │  constraint) │
│ address  │     │ degree      │     └──────────────┘
│ gender   │     │ fees        │
│ dob      │     │ available   │
│ phone    │     │ image       │
└────┬─────┘     │ address     │
     │           └──────┬──────┘
     │                  │
     │    ┌─────────────┴──────────┐
     └───►│     appointments       │
          ├────────────────────────┤
          │ id (PK)                │
          │ user_id (FK → users)   │
          │ doctor_id (FK → doctors)│
          │ slot_date, slot_time   │
          │ user_data, doc_data    │
          │ amount                 │
          │ cancelled, payment     │
          │ is_completed           │
          └────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (v14+)
- **Razorpay** test account — [Sign up here](https://dashboard.razorpay.com/signup)
- **Cloudinary** account — [Sign up here](https://cloudinary.com/users/register/free)

### 1. Clone the Repository

```bash
git clone https://github.com/yashtripathy2004/CarePulse.git
cd CarePulse
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/Carepulse?schema=public"
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR
```

Run database migrations and seed sample data:

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

Start the backend server:

```bash
npm run server
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend:

```bash
npm run dev
```

### 4. Setup Admin Panel

```bash
cd admin
npm install
```

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the admin panel:

```bash
npm run dev
```

---

## 🔑 API Endpoints

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Admin login |
| POST | `/add-doctor` | Add a new doctor (with image upload) |
| POST | `/all-doctors` | Get all doctors list |
| POST | `/change-availability` | Toggle doctor availability |
| GET | `/appointments` | Get all appointments |
| POST | `/cancel-appointment` | Cancel an appointment |
| GET | `/dashboard` | Get dashboard statistics |

### User Routes (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |
| GET | `/get-profile` | Get user profile |
| POST | `/update-profile` | Update user profile (with image) |
| POST | `/book-appointment` | Book an appointment |
| GET | `/appointments` | Get user's appointments |
| POST | `/cancel-appointment` | Cancel an appointment |
| POST | `/payment-razorpay` | Initiate Razorpay payment |
| POST | `/verify-razorpay` | Verify Razorpay payment |

### Doctor Routes (`/api/doctor`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list` | Get all doctors (public) |
| POST | `/login` | Doctor login |
| GET | `/appointments` | Get doctor's appointments |
| POST | `/complete-appointment` | Mark appointment completed |
| POST | `/cancel-appointment` | Cancel appointment |
| GET | `/dashboard` | Get doctor dashboard data |
| GET | `/profile` | Get doctor profile |
| POST | `/update-profile` | Update doctor profile |

---

## 💳 Test Payment Credentials (Razorpay)

| Field | Value |
|---|---|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g., `12/35`) |
| CVV | `123` |
| OTP | `1234` |

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Yash Tripathy** — [@yashtripathy2004](https://github.com/yashtripathy2004)

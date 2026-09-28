import express from "express";
import cors from "cors";
import "dotenv/config";
import prisma from "./config/prisma.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

prisma.$connect()
  .then(() => console.log("PostgreSQL Connected Successfully via Prisma"))
  .catch((err) => console.error("Database connection error:", err));

connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server started on PORT ${port}`));

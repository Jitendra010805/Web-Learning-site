import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Proper CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://fronted-seven-kappa.vercel.app",
  "https://fronted-jitendra-singh-rathores-projects.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies / auth headers
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 8080;

// ✅ Routes import
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

// ✅ Use routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Start database
connectDb();

// ✅ Start server
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
  });
}

export default app;

// Trigger Vercel rebuild after updating env vars
// Fresh deploy with Razorpay and JWT variables configured

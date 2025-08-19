import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión BD
await connectDB();

// Rutas
app.use("/api/auth", authRoutes);

// Arranque
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend encendido en http://localhost:${PORT}`);
});

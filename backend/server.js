import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import usuariosRoutes from "./routes/usuarios.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión BD
await connectDB();

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);

// Arranque
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend encendido en http://localhost:${PORT}`);
});

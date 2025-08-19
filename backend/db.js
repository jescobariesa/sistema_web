import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sistema_gestion", {
      autoIndex: true, // crea índices definidos en los esquemas
    });
    console.log("✅ Conectado a MongoDB (local) -> base: sistema_gestion");
  } catch (error) {
    console.error("❌ Error de conexión a MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;

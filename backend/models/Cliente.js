// backend/models/Cliente.js
import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true, required: true },   // CLI-0001
    secuencia: { type: Number, unique: true, required: true },// 1,2,3...
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    dpi: { type: String, required: true, unique: true },
    nit: { type: String, default: "CF" },                     // "CF" por defecto
  },
  {
    timestamps: { createdAt: "fecha_creacion", updatedAt: "updatedAt" }
  }
);

// índices
ClienteSchema.index({ codigo: 1 }, { unique: true });
ClienteSchema.index({ secuencia: 1 }, { unique: true });
ClienteSchema.index({ dpi: 1 }, { unique: true });

export default mongoose.model("Cliente", ClienteSchema);

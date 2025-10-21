// backend/models/Articulo.js
import mongoose from "mongoose";

const ArticuloSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true }, // "ART-0001"
    secuencia: { type: Number, required: true, unique: true }, // 1,2,3...
    proveedor: { type: String, required: true }, // guardamos el codigo del proveedor: "P-0001"
    nombre: { type: String, required: true }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// indices
ArticuloSchema.index({ codigo: 1 }, { unique: true });
ArticuloSchema.index({ secuencia: 1 }, { unique: true });

export default mongoose.model("Articulo", ArticuloSchema);

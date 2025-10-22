// backend/models/Stock.js
import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
  {
    codigo_articulo: { type: String, required: true, unique: true }, // "ART-0001"
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true, default: 0 },
    precio_costo: { type: Number, required: true, default: 0 },
    precio_venta: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

StockSchema.index({ codigo_articulo: 1 }, { unique: true });

export default mongoose.model("Stock", StockSchema);

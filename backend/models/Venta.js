import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  cliente: { type: String, required: true },
  articulo_codigo: { type: String, required: true },
  articulo_nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio_venta: { type: Number, required: true },
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model("Venta", ventaSchema);

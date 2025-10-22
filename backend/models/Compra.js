// backend/models/Compra.js
import mongoose from "mongoose";

const CompraSchema = new mongoose.Schema(
  {
    proveedor: { type: String, required: true },    // código proveedor: "P-0001"
    articulo_codigo: { type: String, required: true }, // código artículo: "ART-0001"
    articulo_nombre: { type: String, required: true }, // nombre del artículo (texto)
    no_factura: { type: String, required: true },   // manual
    costo: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    precio_venta: { type: Number, required: true },
    fecha_compra: { type: Date, default: Date.now } // fecha de la compra (puedes enviar una)
  },
  {
    timestamps: true
  }
);

// índice único para evitar duplicados por proveedor + no_factura (opcional)
CompraSchema.index({ proveedor: 1, no_factura: 1 }, { unique: true });

export default mongoose.model("Compra", CompraSchema);

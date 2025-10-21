// backend/models/Proveedor.js
import mongoose from "mongoose";

const ProveedorSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true }, // "P-0001"
    secuencia: { type: Number, required: true, unique: true }, // 1,2,3...
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    correo: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // validación simple de email
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} no es un correo válido`
      }
    },
    contacto: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// índices
ProveedorSchema.index({ codigo: 1 }, { unique: true });
ProveedorSchema.index({ secuencia: 1 }, { unique: true });

export default mongoose.model("Proveedor", ProveedorSchema);

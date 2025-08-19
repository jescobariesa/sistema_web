import mongoose from "mongoose";

// Definimos la estructura (Schema) del usuario
const UsuarioSchema = new mongoose.Schema(
  {
    usuario: { type: Number, unique: true },           // ID autoincremental
    dpi: { type: String, unique: true, required: true }, // DPI único y obligatorio

    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    sexo: { type: String, required: true },             // Ej: "M", "F", "Otro"
    fecha_nacimiento: { type: Date, required: true },

    password: { type: String, required: true },         // cifrada con bcrypt

    rol: {
      type: String,
      enum: ["rol_pendiente", "rol_admin", "rol_empleado"],
      default: "rol_pendiente"                           // por defecto empleado
    },

    estado: {
      type: String,
      enum: ["pendiente", "activo", "inactivo"],
      default: "pendiente"                              // siempre inicia pendiente
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },   // agrega createdAt y updatedAt
  }
);

// Índices para garantizar unicidad
UsuarioSchema.index({ usuario: 1 }, { unique: true });
UsuarioSchema.index({ dpi: 1 }, { unique: true });

// Exportamos el modelo para usarlo en rutas/controladores
export default mongoose.model("Usuario", UsuarioSchema);

// backend/routes/proveedores.js
import express from "express";
import Proveedor from "../models/Proveedor.js";

const router = express.Router();

// helper para formatear código P-0001
function formatCodigo(seq) {
  const num = Number(seq);
  return `P-${String(num).padStart(4, "0")}`;
}

/**
 * GET /api/proveedores/ultimo
 * Devuelve el último código y el siguiente calculado
 */
router.get("/ultimo", async (req, res) => {
  try {
    const ultimo = await Proveedor.findOne().sort({ secuencia: -1 }).select("codigo secuencia -_id");
    if (!ultimo) {
      // ningún proveedor aún
      return res.json({ ultimoCodigo: null, ultimoSecuencia: 0, siguienteCodigo: formatCodigo(1), siguienteSecuencia: 1 });
    }
    const siguienteSecuencia = ultimo.secuencia + 1;
    return res.json({
      ultimoCodigo: ultimo.codigo,
      ultimoSecuencia: ultimo.secuencia,
      siguienteCodigo: formatCodigo(siguienteSecuencia),
      siguienteSecuencia
    });
  } catch (error) {
    console.error("Error GET /api/proveedores/ultimo:", error);
    res.status(500).json({ msg: "Error al obtener último proveedor" });
  }
});

/**
 * GET /api/proveedores
 * Lista (opcional) - útil para debug/paginación si lo necesitas
 */
router.get("/", async (req, res) => {
  try {
    const list = await Proveedor.find().sort({ createdAt: -1 }).limit(200);
    res.json(list);
  } catch (error) {
    console.error("Error GET /api/proveedores:", error);
    res.status(500).json({ msg: "Error al listar proveedores" });
  }
});

/**
 * POST /api/proveedores
 * Crear proveedor: calcula secuencia/codigo y guarda.
 * Body esperado: { nombre, direccion, correo, contacto, telefono }
 * (El frontend no manda 'codigo' ni 'secuencia')
 */
router.post("/", async (req, res) => {
  try {
    const { nombre, direccion, correo, contacto, telefono } = req.body;

    // validaciones simples
    if (!nombre || !direccion || !correo || !contacto || !telefono) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    // Obtener la última secuencia y crear la siguiente
    // NOTA: este enfoque NO es 100% a prueba de race conditions en ambiente con alta concurrencia.
    const ultimo = await Proveedor.findOne().sort({ secuencia: -1 }).select("secuencia -_id");
    const siguienteSecuencia = ultimo ? ultimo.secuencia + 1 : 1;
    const codigo = formatCodigo(siguienteSecuencia);

    // Crear y guardar
    const nuevo = new Proveedor({
      codigo,
      secuencia: siguienteSecuencia,
      nombre,
      direccion,
      correo,
      contacto,
      telefono
    });

    await nuevo.save();

    return res.status(201).json({
      msg: "Proveedor creado con éxito",
      data: {
        id: nuevo._id,
        codigo: nuevo.codigo,
        secuencia: nuevo.secuencia,
        nombre: nuevo.nombre,
        direccion: nuevo.direccion,
        correo: nuevo.correo,
        contacto: nuevo.contacto,
        telefono: nuevo.telefono,
        createdAt: nuevo.createdAt
      }
    });

  } catch (error) {
    console.error("Error POST /api/proveedores:", error);

    // manejo de duplicados (por si algo genera conflicto)
    if (error.code === 11000) {
      // puede ser duplicado en codigo o secuencia
      return res.status(400).json({ msg: "Conflicto: proveedor duplicado (intente de nuevo)" });
    }

    res.status(500).json({ msg: "Error al crear proveedor" });
  }
});

export default router;

// backend/routes/clientes.js
import express from "express";
import Cliente from "../models/Cliente.js";

const router = express.Router();

function formatCodigo(seq) {
  return `CLI-${String(seq).padStart(4, "0")}`;
}

/**
 * GET /api/clientes/ultimo
 * Devuelve el siguiente codigo y secuencia para mostrar en frontend
 */
router.get("/ultimo", async (req, res) => {
  try {
    const ultimo = await Cliente.findOne().sort({ secuencia: -1 }).select("codigo secuencia -_id");
    if (!ultimo) {
      return res.json({
        ultimoCodigo: null,
        ultimoSecuencia: 0,
        siguienteCodigo: formatCodigo(1),
        siguienteSecuencia: 1
      });
    }
    const siguienteSecuencia = ultimo.secuencia + 1;
    res.json({
      ultimoCodigo: ultimo.codigo,
      ultimoSecuencia: ultimo.secuencia,
      siguienteCodigo: formatCodigo(siguienteSecuencia),
      siguienteSecuencia
    });
  } catch (error) {
    console.error("Error GET /api/clientes/ultimo:", error);
    res.status(500).json({ msg: "Error al obtener siguiente código" });
  }
});

/**
 * POST /api/clientes
 * Crea cliente: body { nombres, apellidos, dpi, nit? }
 * Código y secuencia calculados automáticamente.
 */
router.post("/", async (req, res) => {
  try {
    const { nombres, apellidos, dpi, nit } = req.body;

    if (!nombres || !apellidos || !dpi) {
      return res.status(400).json({ msg: "Faltan campos obligatorios (nombres, apellidos, dpi)" });
    }

    // validar dpi único
    const existeDpi = await Cliente.findOne({ dpi });
    if (existeDpi) {
      return res.status(400).json({ msg: "El DPI ya está registrado" });
    }

    // obtener ultimo secuencia y crear siguiente
    const ultimo = await Cliente.findOne().sort({ secuencia: -1 }).select("secuencia -_id");
    const siguienteSecuencia = ultimo ? ultimo.secuencia + 1 : 1;
    const codigo = formatCodigo(siguienteSecuencia);

    const nuevo = new Cliente({
      codigo,
      secuencia: siguienteSecuencia,
      nombres,
      apellidos,
      dpi,
      nit: nit && nit !== "" ? nit : "CF"
    });

    await nuevo.save();

    res.status(201).json({
      msg: "Cliente creado con éxito",
      data: {
        id: nuevo._id,
        codigo: nuevo.codigo,
        secuencia: nuevo.secuencia,
        nombres: nuevo.nombres,
        apellidos: nuevo.apellidos,
        dpi: nuevo.dpi,
        nit: nuevo.nit,
        fecha_creacion: nuevo.fecha_creacion
      }
    });
  } catch (error) {
    console.error("Error POST /api/clientes:", error);
    if (error.code === 11000) {
      // conflicto de unicidad
      return res.status(400).json({ msg: "Conflicto: dato duplicado (dpi/codigo). Intenta de nuevo." });
    }
    res.status(500).json({ msg: "Error al crear cliente" });
  }
});

/**
 * GET /api/clientes
 * Lista paginada: ?page=1&pageSize=10
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const pageSize = parseInt(req.query.pageSize || "10", 10);

    const total = await Cliente.countDocuments();
    const clientes = await Cliente.find()
      .sort({ fecha_creacion: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      data: clientes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error("Error GET /api/clientes:", error);
    res.status(500).json({ msg: "Error al listar clientes" });
  }
});

/**
 * GET /api/clientes/:id
 * Obtener 1 cliente por id
 */
router.get("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ msg: "Cliente no encontrado" });
    res.json({ data: cliente });
  } catch (error) {
    console.error("Error GET /api/clientes/:id:", error);
    res.status(500).json({ msg: "Error al obtener cliente" });
  }
});

export default router;

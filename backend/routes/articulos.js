// backend/routes/articulos.js
import express from "express";
import Articulo from "../models/Articulo.js";
import Proveedor from "../models/Proveedor.js"; // opcional, para validar existencia

const router = express.Router();

function formatCodigo(seq) {
  return `ART-${String(seq).padStart(4, "0")}`;
}

/**
 * GET /api/articulos/ultimo
 * Devuelve ultimo/siguiente codigo
 */
router.get("/ultimo", async (req, res) => {
  try {
    const ultimo = await Articulo.findOne().sort({ secuencia: -1 }).select("codigo secuencia -_id");
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
    console.error("Error GET /api/articulos/ultimo:", error);
    res.status(500).json({ msg: "Error al obtener último artículo" });
  }
});

/**
 * GET /api/articulos
 * Lista articulos paginada: query params: page, pageSize
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const pageSize = parseInt(req.query.pageSize || "10", 10);

    const total = await Articulo.countDocuments();
    const articulos = await Articulo.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      data: articulos,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error("Error GET /api/articulos:", error);
    res.status(500).json({ msg: "Error al listar artículos" });
  }
});

/**
 * GET /api/articulos/all
 * Devuelve todos los articulos (para exportar PDF)
 */
router.get("/all", async (req, res) => {
  try {
    const all = await Articulo.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    console.error("Error GET /api/articulos/all:", error);
    res.status(500).json({ msg: "Error al obtener artículos" });
  }
});

/**
 * POST /api/articulos
 * Crea articulo (calcula siguiente secuencia)
 * Body: { proveedor, nombre }
 */
router.post("/", async (req, res) => {
  try {
    const { proveedor, nombre } = req.body;
    if (!proveedor || !nombre) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    // Opcional: validar que proveedor exista
    const existeProv = await Proveedor.findOne({ codigo: proveedor });
    if (!existeProv) {
      return res.status(400).json({ msg: "Proveedor no encontrado" });
    }

    // Obtener ultimo y crear siguiente secuencia
    const ultimo = await Articulo.findOne().sort({ secuencia: -1 }).select("secuencia -_id");
    const siguienteSecuencia = ultimo ? ultimo.secuencia + 1 : 1;
    const codigo = formatCodigo(siguienteSecuencia);

    const nuevo = new Articulo({
      codigo,
      secuencia: siguienteSecuencia,
      proveedor,
      nombre
    });

    await nuevo.save();

    res.status(201).json({
      msg: "Artículo creado con éxito",
      data: {
        id: nuevo._id,
        codigo: nuevo.codigo,
        secuencia: nuevo.secuencia,
        proveedor: nuevo.proveedor,
        nombre: nuevo.nombre,
        createdAt: nuevo.createdAt,
        updatedAt: nuevo.updatedAt
      }
    });
  } catch (error) {
    console.error("Error POST /api/articulos:", error);
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Conflicto: artículo duplicado (intente de nuevo)" });
    }
    res.status(500).json({ msg: "Error al crear artículo" });
  }
});

/**
 * PUT /api/articulos/:id
 * Actualizar proveedor y nombre (no modificar codigo/secuencia)
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { proveedor, nombre } = req.body;
    if (!proveedor || !nombre) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    // validar proveedor
    const existeProv = await Proveedor.findOne({ codigo: proveedor });
    if (!existeProv) {
      return res.status(400).json({ msg: "Proveedor no encontrado" });
    }

    const updated = await Articulo.findByIdAndUpdate(
      id,
      { proveedor, nombre },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Artículo no encontrado" });

    res.json({ msg: "Artículo actualizado", data: updated });
  } catch (error) {
    console.error("Error PUT /api/articulos/:id:", error);
    res.status(500).json({ msg: "Error al actualizar artículo" });
  }
});

/**
 * DELETE /api/articulos/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Articulo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Artículo no encontrado" });
    res.json({ msg: "Artículo eliminado" });
  } catch (error) {
    console.error("Error DELETE /api/articulos/:id:", error);
    res.status(500).json({ msg: "Error al eliminar artículo" });
  }
});

export default router;

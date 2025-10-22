// backend/routes/compras.js
import express from "express";
import Compra from "../models/Compra.js";
import Stock from "../models/Stock.js";
import Proveedor from "../models/Proveedor.js";
import Articulo from "../models/Articulo.js"; // para validar existencia del artículo

const router = express.Router();

/**
 * POST /api/compras
 * Crear compra + actualizar/crear stock
 * Body esperado:
 * {
 *   proveedor: "P-0001",
 *   articulo_codigo: "ART-0001",
 *   articulo_nombre: "Nombre del artículo",
 *   no_factura: "FAC-123",
 *   costo: 12.5,
 *   cantidad: 10,
 *   precio_venta: 20.0,
 *   fecha_compra: "2025-10-20T00:00:00.000Z" // opcional
 * }
 */
router.post("/", async (req, res) => {
  try {
    const {
      proveedor,
      articulo_codigo,
      articulo_nombre,
      no_factura,
      costo,
      cantidad,
      precio_venta,
      fecha_compra
    } = req.body;

    // Validaciones básicas
    if (!proveedor || !articulo_codigo || !articulo_nombre || !no_factura ||
        costo == null || cantidad == null || precio_venta == null) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    // validar tipos numéricos
    const costoNum = Number(costo);
    const cantidadNum = Number(cantidad);
    const precioVentaNum = Number(precio_venta);
    if (isNaN(costoNum) || isNaN(cantidadNum) || isNaN(precioVentaNum) ||
        costoNum <= 0 || cantidadNum <= 0 || precioVentaNum <= 0) {
      return res.status(400).json({ msg: "Costo, cantidad y precio de venta deben ser números mayores que 0" });
    }

    // Validar existencia de proveedor y artículo
    const prov = await Proveedor.findOne({ codigo: proveedor });
    if (!prov) return res.status(400).json({ msg: "Proveedor no encontrado" });

    const art = await Articulo.findOne({ codigo: articulo_codigo });
    if (!art) return res.status(400).json({ msg: "Artículo no encontrado" });

    // Validar duplicado: mismo proveedor + misma factura
    const existeFactura = await Compra.findOne({ proveedor, no_factura });
    if (existeFactura) {
      return res.status(400).json({ msg: "Compra ya registrada: mismo proveedor y número de factura" });
    }

    // Crear registro de compra
    const compra = new Compra({
      proveedor,
      articulo_codigo,
      articulo_nombre,
      no_factura,
      costo: costoNum,
      cantidad: cantidadNum,
      precio_venta: precioVentaNum,
      fecha_compra: fecha_compra ? new Date(fecha_compra) : undefined
    });

    await compra.save();

    // Actualizar/crear stock con operación atómica
    // Reglas: sumar cantidad, actualizar precio_costo y precio_venta solo si el nuevo es mayor
    // Usamos $inc y $max. Además usamos upsert:true para crear si no existe.
    const stockActualizado = await Stock.findOneAndUpdate(
      { codigo_articulo: articulo_codigo },
      {
        $inc: { cantidad: cantidadNum },
        $max: { precio_costo: costoNum, precio_venta: precioVentaNum },
        $setOnInsert: {
          nombre: articulo_nombre
        }
      },
      { new: true, upsert: true }
    );

    return res.status(201).json({
      msg: "Compra registrada y stock actualizado",
      data: {
        compra,
        stock: stockActualizado
      }
    });

  } catch (error) {
    console.error("Error POST /api/compras:", error);
    // Manejo de duplicado por índice único
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Registro duplicado (conflicto)" });
    }
    res.status(500).json({ msg: "Error al registrar la compra" });
  }
});

/**
 * GET /api/compras
 * Lista compras paginada
 * query: page, pageSize
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const pageSize = parseInt(req.query.pageSize || "10", 10);

    const total = await Compra.countDocuments();
    const compras = await Compra.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      data: compras,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error("Error GET /api/compras:", error);
    res.status(500).json({ msg: "Error al listar compras" });
  }
});

/**
 * GET /api/compras/all
 * Devuelve todas las compras (útil para reportes)
 */
router.get("/all", async (req, res) => {
  try {
    const all = await Compra.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    console.error("Error GET /api/compras/all:", error);
    res.status(500).json({ msg: "Error al obtener compras" });
  }
});

/**
 * DELETE /api/compras/:id
 * (Opcional) Elimina un registro de compra — si quieres mantener la trazabilidad, podríamos en su lugar marcarlo como 'anulado'.
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Compra.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Compra no encontrada" });

    // Revertir stock: restar la cantidad comprada
    await Stock.findOneAndUpdate(
      { codigo_articulo: deleted.articulo_codigo },
      { $inc: { cantidad: -deleted.cantidad } }
    );

    res.json({ msg: "Compra eliminada y stock revertido" });
  } catch (error) {
    console.error("Error DELETE /api/compras/:id:", error);
    res.status(500).json({ msg: "Error al eliminar compra" });
  }
});

export default router;

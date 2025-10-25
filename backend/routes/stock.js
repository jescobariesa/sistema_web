import express from "express";
import Stock from "../models/Stock.js";

const router = express.Router();

/**
 * GET /api/stock
 * Devuelve todos los productos disponibles en el stock
 */
router.get("/", async (req, res) => {
  try {
    const stock = await Stock.find().sort({ codigo_articulo: 1 }).lean();

    // Transformamos la respuesta para que use "codigo" en lugar de "codigo_articulo"
    const data = stock.map(item => ({
      codigo: item.codigo_articulo, // 🔹 Cambiamos el nombre aquí
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio_costo: item.precio_costo,
      precio_venta: item.precio_venta,
      _id: item._id
    }));

    res.json(data);
  } catch (error) {
    console.error("Error GET /api/stock:", error);
    res.status(500).json({ msg: "Error al obtener stock" });
  }
});

export default router;

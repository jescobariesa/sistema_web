import express from "express";
import Proveedor from "../models/Proveedor.js";
import Compra from "../models/Compra.js";
import Venta from "../models/Venta.js";
import Cliente from "../models/Cliente.js";
import Stock from "../models/Stock.js";

const router = express.Router();

// Función para devolver datos según el tipo de reporte
router.get("/:tipo", async (req, res) => {
  try {
    const { tipo } = req.params;
    let data = [];

    switch (tipo) {
      case "proveedores":
        data = await Proveedor.find().sort({ createdAt: -1 });
        break;

      case "compras":
        data = await Compra.find().sort({ fecha_compra: -1 });
        break;

      case "ventas":
        data = await Venta.find().sort({ fecha: -1 });
        break;

      case "clientes":
        data = await Cliente.find().sort({ fecha_creacion: -1 });
        break;

      case "stock":
        data = await Stock.find().sort({ createdAt: -1 });
        break;

      default:
        return res.status(400).json({ msg: "Tipo de reporte no válido" });
    }

    res.json({ data });
  } catch (error) {
    console.error("Error generando reporte:", error);
    res.status(500).json({ msg: "Error al generar reporte", error });
  }
});

export default router;

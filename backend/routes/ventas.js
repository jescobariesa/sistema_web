import express from "express";
import Venta from "../models/Venta.js";
import Stock from "../models/Stock.js";

const router = express.Router();

// 🔹 Obtener todas las ventas con paginación
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const totalVentas = await Venta.countDocuments();
    const ventas = await Venta.find()
      .sort({ fecha: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      data: ventas,
      pagination: {
        total: totalVentas,
        totalPages: Math.ceil(totalVentas / pageSize),
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener ventas", error });
  }
});

// 🔹 Obtener el último código
router.get("/ultimo", async (req, res) => {
  try {
    const ultimaVenta = await Venta.findOne().sort({ _id: -1 });
    let nuevoCodigo = "VENT-0001";

    if (ultimaVenta) {
      const numero = parseInt(ultimaVenta.codigo.split("-")[1]) + 1;
      nuevoCodigo = `VENT-${numero.toString().padStart(4, "0")}`;
    }

    res.json({ codigo: nuevoCodigo });
  } catch (error) {
    res.status(500).json({ msg: "Error al generar código." });
  }
});

// 🔹 Registrar una nueva venta
router.post("/", async (req, res) => {
  try {
    const { cliente, articulo_codigo, cantidad } = req.body;

    // Validar existencia en stock
    const articuloStock = await Stock.findOne({ codigo_articulo: articulo_codigo });
    if (!articuloStock) {
      return res.status(404).json({ msg: "Artículo no encontrado en stock." });
    }

    // Validar cantidad disponible
    if (cantidad > articuloStock.cantidad) {
      return res.status(400).json({ msg: "Cantidad supera disponibilidad del stock." });
    }

    // Generar nuevo código incremental (VENT-0001, VENT-0002...)
    const ultimaVenta = await Venta.findOne().sort({ codigo: -1 });
    let nuevoCodigo = "VENT-0001";
    if (ultimaVenta && ultimaVenta.codigo) {
      const numero = parseInt(ultimaVenta.codigo.split("-")[1]) + 1;
      nuevoCodigo = `VENT-${numero.toString().padStart(4, "0")}`;
    }

    // Calcular total
    const total = articuloStock.precio_venta * cantidad;

    // Crear la nueva venta
    const nuevaVenta = new Venta({
      codigo: nuevoCodigo,
      cliente,
      articulo_codigo,
      articulo_nombre: articuloStock.nombre,
      cantidad,
      precio_venta: articuloStock.precio_venta,
      total,
      fecha: new Date()
    });

    // Guardar venta
    await nuevaVenta.save();

    // Actualizar stock restando la cantidad vendida
    articuloStock.cantidad -= cantidad;

    // Aseguramos que nunca quede negativo
    if (articuloStock.cantidad < 0) articuloStock.cantidad = 0;

    await articuloStock.save();

    res.json({
      msg: `Venta registrada correctamente. Código asignado: ${nuevoCodigo}`,
      data: nuevaVenta
    });
  } catch (error) {
    console.error("Error al registrar venta:", error);
    res.status(500).json({ msg: "Error al registrar venta.", error });
  }
});

// 🔹 Eliminar venta y revertir stock
router.delete("/:id", async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ msg: "Venta no encontrada." });

    // Revertir cantidad al stock (campo corregido)
    const articuloStock = await Stock.findOne({ codigo_articulo: venta.articulo_codigo });
    if (articuloStock) {
      articuloStock.cantidad += venta.cantidad;
      await articuloStock.save();
    }

    await Venta.findByIdAndDelete(req.params.id);
    res.json({ msg: "Venta eliminada y stock revertido correctamente." });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar venta.", error });
  }
});

export default router;

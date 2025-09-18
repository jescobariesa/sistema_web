// backend/routes/usuarios.js
import express from "express";
import Usuario from "../models/Usuario.js";

const router = express.Router();

/**
 * GET /api/usuarios/pendientes
 * Devuelve todos los usuarios con rol_pendiente y estado pendiente
 */
router.get("/pendientes", async (req, res) => {
  try {
    const usuariosPendientes = await Usuario.find({
      rol: "rol_pendiente",
      estado: "pendiente"
    }).sort({ createdAt: -1 }); // los más nuevos primero

    res.json(usuariosPendientes);
  } catch (error) {
    console.error("❌ Error obteniendo usuarios pendientes:", error);
    res.status(500).json({ msg: "Error al obtener usuarios pendientes" });
  }
});

/**
 * PUT /api/usuarios/:id/autorizar
 * Actualiza rol y estado de un usuario pendiente
 */
router.put("/:id/autorizar", async (req, res) => {
  try {
    const { rol, estado } = req.body;

    if (!rol || !estado) {
      return res.status(400).json({ msg: "Rol y estado son obligatorios" });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol, estado },
      { new: true }
    );

    res.json({ msg: "✅ Usuario autorizado con éxito", usuario });
  } catch (error) {
    console.error("❌ Error autorizando usuario:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

/**
 * PUT /api/usuarios/:id/rechazar
 * Marca al usuario como rechazado
 */
router.put("/:id/rechazar", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol: "rol_rechazo", estado: "rechazado" },
      { new: true }
    );

    res.json({ msg: "❌ Usuario rechazado", usuario });
  } catch (error) {
    console.error("❌ Error rechazando usuario:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// GET /api/usuarios/activos
router.get("/activos", async (req, res) => {
  try {
    const activos = await Usuario.find({ estado: "activo" });
    res.json(activos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener usuarios activos" });
  }
});

// PUT /api/usuarios/:id/inactivar
router.put("/:id/inactivar", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Usuario.findByIdAndUpdate(
      id,
      { estado: "inactivo" },
      { new: true }
    );

    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json({ msg: "Usuario inactivado con éxito", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al inactivar usuario" });
  }
});


export default router;

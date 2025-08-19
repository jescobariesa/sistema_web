import express from "express";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";

const router = express.Router();

/**
 * Ruta: POST /api/auth/register
 * Objetivo: Registrar un nuevo usuario
 */
router.post("/register", async (req, res) => {
  try {
    const {
      dpi,
      nombres,
      apellidos,
      sexo,
      fecha_nacimiento,
      password
    } = req.body;

    // 1. Validar que no falten campos
    if (!dpi || !nombres || !apellidos || !sexo || !fecha_nacimiento || !password) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    // 2. Validar que el DPI no exista
    const existeDpi = await Usuario.findOne({ dpi });
    if (existeDpi) {
      return res.status(400).json({ msg: "El DPI ya está registrado" });
    }

    // 3. Buscar el último usuario para asignar nuevo ID autoincremental
    const ultimo = await Usuario.findOne().sort({ usuario: -1 });
    const nuevoUsuario = ultimo ? ultimo.usuario + 1 : 65781;

    // 4. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Rol asignado automáticamente (el primero es admin)
    const rolAsignado = "rol_pendiente";

    // 6. Crear usuario en la BD
    const user = new Usuario({
      usuario: nuevoUsuario,
      dpi,
      nombres,
      apellidos,
      sexo,
      fecha_nacimiento: new Date(fecha_nacimiento),
      password: hashedPassword,
      rol: rolAsignado
      // estado = "pendiente" se asigna solo por default en el modelo
    });

    await user.save();

    // 7. Respuesta
    res.status(201).json({
      msg: "Usuario registrado con éxito",
      data: {
        usuario: user.usuario,
        rol: user.rol,
        estado: user.estado,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

/**
 * Ruta: POST /api/auth/login
 * Objetivo: Validar usuario y contraseña
 */
router.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // 1. Validar campos
    if (!usuario || !password) {
      return res.status(400).json({ msg: "Usuario y contraseña requeridos" });
    }

    // 2. Buscar usuario
    const user = await Usuario.findOne({ usuario });
    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    // 3. Validar contraseña
    const valido = await bcrypt.compare(password, user.password);
    if (!valido) {
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    // 4. (Opcional) Bloquear acceso si no está activo
    if (user.estado !== "activo") {
      return res.status(403).json({ msg: "Cuenta pendiente de activación" });
    }

    // 5. Respuesta
    res.json({
      msg: "Login exitoso",
      data: {
        usuario: user.usuario,
        rol: user.rol,
        estado: user.estado
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

export default router;

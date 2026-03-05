const User = require("../models/User");

async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ ok: false, error: "name e email são obrigatórios" });
    }

    const created = await User.create({ name, email });
    return res.json({ ok: true, user: created });

  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ ok: false, error: "E-mail já cadastrado" });
    }
    return res.status(500).json({ ok: false, error: err.message });
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ ok: true, users });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { createUser, listUsers };
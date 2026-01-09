const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, username, password, address } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO dealers (name, username, password, address) VALUES (?, ?, ?, ?)", 
            [name, username, hashedPassword, address]);
        res.status(201).json({ message: "Dealer berhasil didaftarkan" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM dealers WHERE username = ?", [username]);
        if (rows.length === 0) return res.status(400).json({ message: "Username salah" });

        const validPass = await bcrypt.compare(password, rows[0].password);
        if (!validPass) return res.status(400).json({ message: "Password salah" });

        const token = jwt.sign({ id: rows[0].id }, 'SECRET_KEY_KAMU', { expiresIn: '1d' });
        res.json({ token, dealer_name: rows[0].name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const db = require('../config/db');

exports.getAllSchedules = async (req, res) => {
    try {
        const [schedules] = await db.query("SELECT * FROM service_schedules");
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.upsertSchedule = async (req, res) => {
    const { schedule_date, quota } = req.body;
    try {
        const query = `
            INSERT INTO service_schedules (schedule_date, quota) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE quota = VALUES(quota)`;
        await db.query(query, [schedule_date, quota]);
        res.json({ message: "Jadwal berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
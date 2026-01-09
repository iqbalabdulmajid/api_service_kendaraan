const db = require('../config/db');


exports.getAllBookings = async (req, res) => {
    try {
        const query = `
            SELECT b.*, st.name AS status_name, s.schedule_date 
            FROM service_bookings b
            JOIN service_statuses st ON b.service_status_id = st.id
            JOIN service_schedules s ON b.service_schedule_id = s.id
            ORDER BY b.id DESC`;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT b.*, s.schedule_date, st.name as status_name 
            FROM service_bookings b
            JOIN service_schedules s ON b.service_schedule_id = s.id
            JOIN service_statuses st ON b.service_status_id = st.id
            WHERE b.id = ?`;
        
        const [rows] = await db.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Data booking tidak ditemukan" });
        }
        
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createBooking = async (req, res) => {
    const { name, phone_no, vehicle_type, license_plate, vehicle_problem, schedule_date, service_time } = req.body;

    // Validasi H+1
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);
    
    if (new Date(schedule_date) < tomorrow) {
        return res.status(400).json({ message: "Pemesanan minimal H+1" });
    }

    try {
        // Cek Kuota
        const [sch] = await db.query("SELECT * FROM service_schedules WHERE schedule_date = ?", [schedule_date]);
        if (sch.length === 0 || sch[0].quota <= 0) {
            return res.status(400).json({ message: "Kuota penuh atau jadwal belum dibuat" });
        }

        const conn = await db.getConnection();
        await conn.beginTransaction();

        try {
            // Simpan Booking
            await conn.query(`INSERT INTO service_bookings 
                (name, phone_no, vehicle_type, license_plate, vehicle_problem, service_schedule_id, service_time) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [name, phone_no, vehicle_type, license_plate, vehicle_problem, sch[0].id, service_time]);

            // Potong Kuota Otomatis
            await conn.query("UPDATE service_schedules SET quota = quota - 1 WHERE id = ?", [sch[0].id]);

            await conn.commit();
            res.status(201).json({ message: "Booking berhasil disimpan" });
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { service_status_id } = req.body;

    try {
        const [booking] = await db.query("SELECT * FROM service_bookings WHERE id = ?", [id]);
        if (booking.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

        const oldStatus = booking[0].service_status_id;
        const schId = booking[0].service_schedule_id;

        // Jika status diubah ke 'konfirmasi batal' (ID 2), kembalikan kuota
        if (service_status_id == 2 && oldStatus != 2) {
            await db.query("UPDATE service_schedules SET quota = quota + 1 WHERE id = ?", [schId]);
        }

        await db.query("UPDATE service_bookings SET service_status_id = ? WHERE id = ?", [service_status_id, id]);
        res.json({ message: "Status diperbarui" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
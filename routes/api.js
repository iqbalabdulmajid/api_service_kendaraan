const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const bookingCtrl = require('../controllers/bookingController');
const scheduleCtrl = require('../controllers/scheduleController');
const verify = require('../middleware/authMiddleware');

// --- Rute Publik (Customer) ---
router.post('/register-dealer', authCtrl.register); 
router.post('/login', authCtrl.login);
router.post('/bookings', bookingCtrl.createBooking);
router.get('/schedules', scheduleCtrl.getAllSchedules);

router.get('/bookings', verify, bookingCtrl.getAllBookings);
router.get('/bookings/:id', verify, bookingCtrl.getBookingById);
router.put('/bookings/:id/status', verify, bookingCtrl.updateStatus);
router.post('/schedules', verify, scheduleCtrl.upsertSchedule);

module.exports = router;
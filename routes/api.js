const express = require('express');
const router = express.Router();
const bookingCtrl = require('../controllers/bookingController');
const scheduleCtrl = require('../controllers/scheduleController');

// Customer
router.post('/bookings', bookingCtrl.createBooking);

// Dealer
router.post('/schedules', scheduleCtrl.upsertSchedule);
router.put('/bookings/:id/status', bookingCtrl.updateStatus);
router.get('/bookings', bookingCtrl.getAllBookings);
router.get('/schedules', scheduleCtrl.getAllSchedules);
router.get('/bookings/:id', bookingCtrl.getBookingById);

module.exports = router;
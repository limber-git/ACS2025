const express = require('express');
const router = express.Router();
const attendanceHandler = require('../handlers/attendanceHandler');

router.get('/status/:id', attendanceHandler.getAttendanceStatus);

module.exports = router;

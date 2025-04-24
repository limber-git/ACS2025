const { getAttendanceStatus } = require('../controllers/attendanceController');

const attendanceHandler = {
  getAttendanceStatus: async (req, res) => {
    await getAttendanceStatus(req, res);
  }
};

module.exports = attendanceHandler;

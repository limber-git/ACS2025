const express = require('express');
const { postApplication, getAllApplicationsById, getAllApplications,getApplicationsCountForCurrentMonthById, putApplication, getApplicationsByDateRange } = require('../handlers/applicationHandler');

const router = express();

router.post('/createApplications', postApplication);
router.get('/getAllApplications', getAllApplications);
router.put('/updateApplication/:applicationId', putApplication);
router.get('/getApplicationsById/:applicationId', getAllApplicationsById);
router.get('/date-range', getApplicationsByDateRange);
router.get('/getAppByDate/:userId', getApplicationsCountForCurrentMonthById);


module.exports = router;
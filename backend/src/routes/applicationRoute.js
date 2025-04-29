const express = require('express');
const { postApplication, getAllApplicationsById,deleteApplication, getAllApplications, getApplicationsCountForCurrentMonthById, putApplication, getApplicationsByDateRange, getApplicationsByUserId, uploadToImgBB } = require('../handlers/applicationHandler');

const router = express();

router.post('/createApplications', postApplication);
router.get('/getAllApplications', getAllApplications);
router.put('/updateApplication/:applicationId', putApplication);
router.get('/getApplicationsById/:applicationId', getAllApplicationsById);
router.get('/date-range', getApplicationsByDateRange);
router.get('/getAppByDate/:userId', getApplicationsCountForCurrentMonthById);
router.get('/getApplicationsByUser/:userId', getApplicationsByUserId);
router.post('/upload-image', uploadToImgBB);
router.delete('/deleteApplication/:applicationId', deleteApplication);

module.exports = router;
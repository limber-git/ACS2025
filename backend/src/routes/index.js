const { Router, application } = require('express');
const userRoute = require('./userRoute');
const uploadRoute = require('./uploadRoute');
const recordRoute = require('./recordRoute');
const applicationRoute=require('./applicationRoute');
const moduleRoute = require('./moduleRoute');
const router = Router()

router.use('/user', userRoute)
router.use('/upload', uploadRoute);
router.use('/record', recordRoute);
router.use('/application', applicationRoute);
router.use('/module', moduleRoute);

module.exports = router
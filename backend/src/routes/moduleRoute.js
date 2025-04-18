const express = require('express');
const { postModule, getAllModules, getModuleById, putModule, deleteModulePhysical, deleteModuleLogical } = require('../handlers/moduleHandler');

const router = express();

router.post('/createModule', postModule);
router.get('/getAllModules', getAllModules);
router.get('/getModulesById/:moduleId', getModuleById);
router.put('/updateModule/:moduleId', putModule);
router.delete('/deleteModulePhysical/:moduleId', deleteModulePhysical);
router.delete('/deleteModuleLogical/:moduleId', deleteModuleLogical);

module.exports = router;

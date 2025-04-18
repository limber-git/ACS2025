const express = require("express");
const {
  getAllRecords,
  getAllActiveRecords,
  getActiveRecordsByUser,
  getRecordsByUser,
  getRecordsByDateRange,
  updateRecordStateByDateRange,
  deleteRecords,
  updateRecordState
} = require("../handlers/recordHandler");
const router = express();
router.get("/getAllRecords", getAllRecords);
router.get("/getRecordsByUser/:userId", getRecordsByUser);
router.put("/updateRecordStateByDateRange", updateRecordStateByDateRange);
router.get("/date-range", getRecordsByDateRange);
router.get("/getAllActiveRecords", getAllActiveRecords);
router.get("/getActiveRecordsByUser/:userId", getActiveRecordsByUser);
router.delete("/deleteRecords", deleteRecords); // Usar directamente la función del controlador
router.post("/update-state", updateRecordState);

module.exports = router;

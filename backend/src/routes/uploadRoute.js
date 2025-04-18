const express = require('express');
const router = express();
const multer = require('multer');
const { upLoadFile } = require('../handlers/uploadHandler');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/Filexlsx', upload.single('file'), upLoadFile)

module.exports = router;
const express = require('express');
const router = express.Router();



router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: true }));


module.exports = router;
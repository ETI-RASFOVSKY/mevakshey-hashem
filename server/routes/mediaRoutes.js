const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ 
  limits: { fileSize: 50 * 1024 * 1024 } // הגבלת גודל קובץ ל-50MB
}); // אחסון בזיכרון בלבד

const mediaController = require('../controllers/mediaController');
const { adminOnly } = require('../middlewares/authMiddleware');

// נתיב לקבלת רשימת קבצים - פתוח לכולם (לקריאה בלבד)
router.get('/files', mediaController.getFiles);

// העלאה ומחיקה - דורשות הרשאות admin
router.post('/upload', adminOnly, upload.single('file'), mediaController.uploadFile);
router.delete('/delete', adminOnly, mediaController.deleteFile);

module.exports = router;

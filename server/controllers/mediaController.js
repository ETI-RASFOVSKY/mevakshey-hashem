const supabase = require('../services/supabaseService');
const bucketName = 'vaad-pickters';

// העלאת קובץ ל־bucket + folder
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const folder = req.body.folder || '';
    
    if (!file) {
      return res.status(400).json({ error: 'לא הועלה קובץ' });
    }

    // בדיקת גודל קובץ (50MB כבר מוגבל ב-multer)
    // בדיקת סוג קובץ
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
    
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'סוג קובץ לא נתמך. רק תמונות וסרטונים מותרים' });
    }

    // אם שם הקובץ כבר מכיל קטגוריה (format: category_timestamp_originalname), נשתמש בו
    // אחרת נוסיף timestamp
    let fileName;
    if (file.originalname.includes('_') && file.originalname.split('_').length >= 3) {
      // הקובץ כבר מכיל קטגוריה
      fileName = folder ? `${folder}/${file.originalname}` : file.originalname;
    } else {
      // נוסיף timestamp
      fileName = folder ? `${folder}/${Date.now()}_${file.originalname}` : `${Date.now()}_${file.originalname}`;
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }

    const { publicUrl } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    res.status(200).json({ message: 'קובץ הועלה בהצלחה', url: publicUrl });
  } catch (err) {
    console.error("Unexpected error in uploadFile:", err);
    res.status(500).json({ error: err.message || 'שגיאה בהעלאת קובץ' });
  }
};

// מחיקת קובץ לפי path
exports.deleteFile = async (req, res) => {
  try {
    const { path } = req.body; // path של הקובץ, כולל folder אם יש
    if (!path) {
      return res.status(400).json({ error: 'נתיב קובץ נדרש' });
    }

    const { data, error } = await supabase.storage.from(bucketName).remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      throw error;
    }

    res.status(200).json({ message: 'קובץ נמחק בהצלחה' });
  } catch (err) {
    console.error("Unexpected error in deleteFile:", err);
    res.status(500).json({ error: err.message || 'שגיאה במחיקת קובץ' });
  }
};
// פונקציה לקבלת רשימת הקבצים עם URL מלא
exports.getFiles = async (req, res) => {
  try {
    const folder = req.query.folder || '';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder, { limit: 100 });

    if (error) {
      console.error("Error fetching files:", error);
      throw error;
    }

    // השתמש ב־publicUrl במקום ב־path רגיל
    const filesWithURL = data
      .filter(file => file.name !== '.emptyFolderPlaceholder')
      .map(file => {
        const filePath = folder ? `${folder}/${file.name}` : file.name;
        const { publicUrl } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        return {
          ...file,
          url: publicUrl, // זהו ה־URL שנשלח ללקוח
        };
      });
    res.status(200).json(filesWithURL);
  } catch (err) {
    console.error("Unexpected error in getFiles:", err);
    res.status(500).json({ error: err.message || 'שגיאה בטעינת קבצים' });
  }
};

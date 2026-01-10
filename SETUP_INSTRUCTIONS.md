# הוראות הגדרה - פרויקט ועד מבקשי השם

## 📋 דרישות מוקדמות

1. Node.js (גרסה 14 ומעלה)
2. npm או yarn
3. חשבון Supabase
4. חשבון Gmail (לשליחת מיילים)

## 🚀 התקנה

### 1. התקנת תלויות

```bash
# התקנת תלויות שרת
cd server
npm install

# התקנת תלויות לקוח
cd ../client
npm install
```

### 2. הגדרת משתני סביבה

#### שרת (server/.env)

צור קובץ `.env` בספריית `server/` עם התוכן הבא:

```env
# Port
PORT=3001

# Supabase (Database + Storage)
# מומלץ להשתמש ב-Service Role Key כדי לאפשר גישה לטבלאות עם RLS
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# (אופציונלי) אם אין Service Role Key, ישמש המפתח הרגיל:
SUPABASE_KEY=your_supabase_anon_or_service_key

# JWT Secret
# ליצור עם: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_jwt_secret_here

# Admin Password Hash
# ליצור עם: node server/hash.js
# או ישירות ב-Supabase בטבלת admins (עמודת passwordhash)
ADMIN_HASH=your_bcrypt_hash_here

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password  # App Password מ-Gmail
CONTACT_EMAIL=recipient@email.com  # מייל לקבלת הודעות מצור קשר
```

#### לקוח (client/.env - אופציונלי)

אם השרת רץ על פורט אחר או כתובת אחרת:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 3. הגדרת Gmail לשליחת מיילים

1. עבור ל-[Google Account Settings](https://myaccount.google.com/)
2. הפעל "2-Step Verification"
3. צור "App Password":
   - עבור ל-[App Passwords](https://myaccount.google.com/apppasswords)
   - בחר "Mail" ו-"Other (Custom name)"
   - הכנס שם כמו "Vaad App"
   - העתק את הסיסמה שנוצרה והכנס ב-`EMAIL_PASS`

### 4. הגדרת Supabase

1. צור פרויקט חדש ב-Supabase
2. צור טבלה `users` עם העמודות:
   - `id` (uuid, primary key, auto-generate)
   - `fname` (text)
   - `Email` (text, unique)
   - `created_at` (timestamp, default now())
3. צור טבלה `admins` עם העמודות:
   - `id` (uuid, primary key, auto-generate)
   - `passwordhash` (text)
   - `role` (text, default: 'admin')
4. צור Storage Bucket בשם `vaad-pickters`:
   - אפשר להשאיר כ-Private (השרת מייצר Signed URLs אוטומטית)
   - הוסף folders: `images` ו-`videos`
   - אם ה-Bucket Private, אין צורך ב-Policies מיוחדות

## 🏃 הרצה

### Development Mode

```bash
# מהשורש של הפרויקט
npm run dev
```

זה יריץ את השרת והלקוח במקביל.

או בנפרד:

```bash
# Terminal 1 - שרת
cd server
npm run dev

# Terminal 2 - לקוח
cd client
npm start
```

### Production Build

```bash
# בניית הלקוח
cd client
npm run build

# הרצת השרת
cd ../server
npm start
```

## 📁 מבנה הפרויקט

```
vaad/
├── client/              # React Frontend
│   ├── src/
│   │   ├── features/    # קומפוננטות לפי תכונות
│   │   ├── api/         # קריאות API
│   │   ├── app/         # Redux store
│   │   └── config.js     # הגדרות מרכזיות
│   └── public/
│
├── server/              # Node.js Backend
│   ├── controllers/     # לוגיקה עסקית
│   ├── routes/          # נתיבי API
│   ├── middlewares/     # Middleware (auth)
│   ├── services/        # שירותים (Supabase)
│   └── index.js         # נקודת כניסה
│
└── .gitignore
```

## 🔐 אבטחה

- כל נתיבי המשתמשים דורשים JWT authentication
- העלאה ומחיקת קבצים דורשות authentication
- סיסמאות מאוחסנות כ-hash (bcrypt)
- JWT tokens עם תוקף של 24 שעות

## 📧 שליחת מיילים

המערכת תומכת בשני סוגי מיילים:

1. **מייל מצור קשר** - נשלח כאשר משתמש ממלא טופס צור קשר
2. **מייל ברכה למצטרף** - נשלח אוטומטית למשתמשים חדשים

## 🎨 תכונות

- ✅ Authentication עם JWT
- ✅ ניהול משתמשים
- ✅ גלריה עם סינון לפי נושאים
- ✅ העלאה ומחיקת תמונות/סרטונים
- ✅ שליחת מיילים
- ✅ עיצוב מודרני ו-responsive

## 🐛 פתרון בעיות

### שגיאת "Missing environment variables"
- ודא שקובץ `.env` קיים ב-`server/`
- ודא שכל המשתנים מוגדרים

### שגיאת "Email not sent"
- ודא ש-`EMAIL_USER` ו-`EMAIL_PASS` מוגדרים נכון
- ודא ש-App Password מ-Gmail תקין
- בדוק את ה-console לפרטי שגיאה

### שגיאת "Failed to fetch"
- ודא שהשרת רץ על הפורט הנכון
- בדוק את `REACT_APP_API_URL` ב-client
- ודא שאין בעיות CORS

## 📝 הערות

- הסינון לפי נושאים עובד לפי שם הקובץ: `category_timestamp_originalname`
- קטגוריות זמינות: חנוכה, פורים, פסח, שבועות, ראש השנה, יום כיפור, סוכות, ל"ג בעומר, אירועים, כללי




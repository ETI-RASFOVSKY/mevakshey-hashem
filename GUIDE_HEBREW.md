# מדריך שימוש מלא לאתר - בעברית

## 🚀 התקנה ראשונית

### 1. הכנת Supabase

#### יצירת טבלאות:

**טבלת `users`:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fname TEXT NOT NULL,
  Email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**טבלת `admins`:**
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passwordhash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### יצירת Storage Bucket:

1. היכנס ל-Supabase Dashboard → Storage
2. לחץ "New Bucket"
3. שם: `vaad-pickters`
4. **השאר Private** (השרת ייצור Signed URLs אוטומטית)
5. לחץ "Create bucket"
6. צור folders:
   - `images` - לתמונות
   - `videos` - לסרטונים

### 2. יצירת Admin ראשון

**אפשרות 1: דרך הסקריפט (מומלץ):**

```bash
cd server
node scripts/createAdmin.js
```

**או עם סיסמה מותאמת אישית:**
```bash
ADMIN_PASSWORD=your_password node scripts/createAdmin.js
```

**אפשרות 2: דרך hash.js:**

```bash
cd server
node hash.js
```

העתק את ה-hash שנוצר, ואז:

1. היכנס ל-Supabase Dashboard → Table Editor
2. בחר טבלה `admins`
3. לחץ "Insert" → "Insert row"
4. הכנס:
   - `passwordhash`: (הדבק את ה-hash)
   - `role`: `admin`
5. לחץ "Save"

**אפשרות 3: דרך .env (fallback):**

1. הרץ `node server/hash.js` כדי לקבל hash
2. הוסף ל-`server/.env`:
   ```env
   ADMIN_HASH=הדבק_כאן_את_ה_hash
   ```

### 3. הגדרת .env

**`server/.env`:**
```env
# Port
PORT=3001

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# או אם אין Service Role Key:
SUPABASE_KEY=your_anon_key

# JWT Secret
JWT_SECRET=your_jwt_secret_here
# ליצור עם: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Admin Hash (אופציונלי - fallback)
ADMIN_HASH=your_bcrypt_hash_here
# ליצור עם: node server/hash.js

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CONTACT_EMAIL=recipient@email.com
```

**`client/.env` (אופציונלי):**
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. הרצת הפרויקט

```bash
# מהשורש של הפרויקט
npm run dev
```

זה יריץ:
- שרת על `http://localhost:3001`
- לקוח על `http://localhost:3000`

---

## 👤 כניסת מנהל

### סיסמה ברירת מחדל:
- **סיסמה:** `1234!1234`
- **או:** הסיסמה שיצרת ב-`ADMIN_PASSWORD`

### שלבים:
1. פתח את האתר
2. לחץ על "כניסת מנהל" בתפריט
3. הכנס את הסיסמה
4. לחץ "התחבר"

**אם הסיסמה לא עובדת:**
- ודא שיצרת admin ב-Supabase (ראה סעיף "יצירת Admin ראשון")
- או שהוספת `ADMIN_HASH` ל-`.env`
- בדוק בקונסול של השרת אם יש שגיאות

---

## 📸 הוספת תמונות

### דרך האתר (כמנהל):

1. **התחבר כמנהל** (ראה "כניסת מנהל")
2. עבור ל-**"גלריה"** בתפריט
3. לחץ על טאב **"תמונות"** (אם לא שם כבר)
4. לחץ על כפתור **"העלה תמונה"** (מופיע רק למנהל)
5. בחר תמונה מהמחשב
6. בחר **קטגוריה** (חנוכה, פורים, פסח, וכו')
7. לחץ **"העלה"**
8. התמונה תופיע בגלריה

### דרך Supabase ישירות:

1. היכנס ל-Supabase Dashboard → Storage
2. בחר bucket `vaad-pickters`
3. פתח את folder `images`
4. לחץ "Upload file"
5. בחר תמונה והעלה

**⚠️ חשוב:** אם אתה מעלה דרך Supabase, שם הקובץ צריך להיות בפורמט:
```
קטגוריה_timestamp_שם_קובץ.jpg
```

דוגמאות:
- `hanukkah_1234567890_event1.jpg`
- `purim_1234567891_celebration.png`

---

## 🎬 הוספת סרטונים

### דרך האתר (כמנהל):

1. **התחבר כמנהל**
2. עבור ל-**"גלריה"** בתפריט
3. לחץ על טאב **"וידאו"**
4. לחץ על כפתור **"העלה סרטון"** (מופיע רק למנהל)
5. בחר סרטון מהמחשב (MP4, MOV, AVI)
6. בחר **קטגוריה**
7. לחץ **"העלה"**
8. הסרטון יופיע בגלריה

**⚠️ מגבלות:**
- גודל מקסימלי: 50MB
- פורמטים נתמכים: MP4, MPEG, MOV, AVI

### דרך Supabase ישירות:

1. היכנס ל-Supabase Dashboard → Storage
2. בחר bucket `vaad-pickters`
3. פתח את folder `videos`
4. לחץ "Upload file"
5. בחר סרטון והעלה

**⚠️ חשוב:** שם הקובץ צריך להיות בפורמט:
```
קטגוריה_timestamp_שם_קובץ.mp4
```

---

## 🗂️ סינון לפי קטגוריות

### קטגוריות זמינות:
- **הכל** - מציג את כל הקבצים
- **חנוכה** (`hanukkah`)
- **פורים** (`purim`)
- **פסח** (`pesach`)
- **שבועות** (`shavuot`)
- **ראש השנה** (`rosh-hashana`)
- **יום כיפור** (`yom-kippur`)
- **סוכות** (`sukkot`)
- **ל"ג בעומר** (`lag-baomer`)
- **אירועים** (`events`)
- **כללי** (`general`)

### איך להשתמש:
1. עבור ל-**"גלריה"**
2. בחר טאב **"תמונות"** או **"וידאו"**
3. בחר קטגוריה מהתפריט הנפתח **"סינון לפי נושא"**
4. הקבצים יסוננו אוטומטית

---

## 🗑️ מחיקת קבצים

### דרך האתר (כמנהל):

1. **התחבר כמנהל**
2. עבור ל-**"גלריה"**
3. **גע עם העכבר על תמונה/סרטון** - תופיע שכבה עם כפתור "מחיקה"
4. לחץ **"מחיקה"**
5. הקובץ ימחק

### דרך Supabase:

1. היכנס ל-Supabase Dashboard → Storage
2. בחר bucket `vaad-pickters`
3. פתח את ה-folder המתאים (`images` או `videos`)
4. סמן את הקובץ שברצונך למחוק
5. לחץ "Delete"

---

## 📧 הרשמה לניוזלטר

### איך להרשם:

1. גלול למטה בעמוד הראשי
2. תראה טופס ההרשמה בפינה השמאלית התחתונה
3. מלא:
   - **שם פרטי**
   - **מייל**
4. לחץ **"שלח"**
5. תופיע הודעת הצלחה: "נרשמת בהצלחה"

### אם ההרשמה לא עובדת:

**בדוק בקונסול של הדפדפן (F12):**
- אם יש שגיאת רשת (Network error)
- אם יש שגיאה ב-API

**בדוק בקונסול של השרת:**
- אם יש שגיאה בטבלת `users` ב-Supabase
- אם יש בעיה ב-Connection String

**בעיות נפוצות:**
1. **"מייל זה כבר רשום במערכת"** - המייל כבר קיים, נסה מייל אחר
2. **"פורמט מייל לא תקין"** - ודא שהמייל בפורמט תקין (למשל: name@example.com)
3. **"שגיאה בשליחת הפרטים"** - בדוק שהשרת רץ ושה-Supabase מוגדר נכון

### בדיקת מנויים:

**דרך Supabase:**
1. היכנס ל-Supabase Dashboard → Table Editor
2. בחר טבלה `users`
3. תראה את כל המנויים

**דרך האתר (כמנהל):**
1. התחבר כמנהל
2. עבור ל-**"תורמים"** בתפריט (דורש הרשאות)

---

## 🐛 פתרון בעיות

### בעיה 1: "סיסמה לא נכונה" בכניסת מנהל

**פתרונות:**
1. ודא שיצרת admin ב-Supabase:
   ```bash
   node server/scripts/createAdmin.js
   ```
2. או הוסף `ADMIN_HASH` ל-`.env`
3. ודא שאתה משתמש בסיסמה הנכונה: `1234!1234` (ברירת מחדל)
4. בדוק בקונסול של השרת אם יש שגיאות

### בעיה 2: סרטונים לא נפתחים

**פתרונות:**
1. **ודא שהסרטון בפורמט נתמך:** MP4, MPEG, MOV, AVI
2. **ודא שה-Signed URL תקין:** בדוק בקונסול של הדפדפן (F12) אם יש שגיאת network
3. **נסה לרענן את הדף** (Ctrl+F5)
4. **בדוק בקונסול של השרת:** אולי יש שגיאה ביצירת Signed URL
5. **ודא שה-Bucket לא Public:** זה בסדר, Signed URLs אמורים לעבוד גם עם Private buckets

### בעיה 3: תמונות לא נטענות

**פתרונות:**
1. בדוק בקונסול של הדפדפן (F12) אם יש שגיאות
2. ודא שה-Bucket `vaad-pickters` קיים ב-Supabase
3. ודא שה-folders `images` ו-`videos` קיימים
4. בדוק שהשרת רץ (`npm run dev`)

### בעיה 4: הרשמה לניוזלטר לא עובדת

**פתרונות:**
1. **בדוק שהטופס מלא נכון:** שם ומייל נדרשים
2. **בדוק בקונסול של הדפדפן:** אם יש שגיאת API
3. **בדוק בקונסול של השרת:** אם יש שגיאה ב-Supabase
4. **ודא שטבלת `users` קיימת** ב-Supabase (ראה "התקנה ראשונית")
5. **בדוק שה-API endpoint נכון:** `/api/users/subscribe`

### בעיה 5: "Cannot find module" או שגיאות Node.js

**פתרונות:**
1. **התקן dependencies מחדש:**
   ```bash
   cd server
   npm install
   
   cd ../client
   npm install
   ```
2. **ודא ש-Node.js מותקן:** `node --version` (צריך v14+)
3. **נקה cache:**
   ```bash
   cd server
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 📝 טיפים שימושיים

### 1. שינוי סיסמת מנהל:
```bash
ADMIN_PASSWORD=סיסמה_חדשה node server/scripts/createAdmin.js
```

### 2. בדיקת חיבור ל-Supabase:
- אם השרת מתחיל בלי שגיאות → החיבור תקין
- אם יש שגיאה → בדוק את `SUPABASE_URL` ו-`SUPABASE_KEY`

### 3. בדיקת Signed URLs:
- פתח קונסול של דפדפן (F12)
- עבור ל-Network
- טען גלריה
- בדוק שה-URLs מתחילים ב-`https://` ולא ב-`http://`

### 4. העלאת קבצים גדולים:
- אם הקובץ גדול מ-50MB, תצטרך להגדיל את הגבלה ב-`mediaRoutes.js`
- או לחלק את הקובץ

---

## 📞 תמיכה

אם יש לך בעיות נוספות:
1. בדוק את הקונסול של השרת והדפדפן
2. בדוק את הלוגים ב-Supabase Dashboard
3. ודא שכל המשתנים ב-`.env` נכונים

**הצלחה! 🎉**

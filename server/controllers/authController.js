const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../services/supabaseService");

const ENV_ADMIN_HASH = process.env.ADMIN_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

async function getAdminHash() {
  // עדיפות למסד נתונים כדי לאפשר ניהול דינמי
  try {
    console.log("🔍 מחפש admin ב-Supabase...");
    const { data, error } = await supabase
      .from("admins")
      .select("passwordhash")
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("❌ שגיאה בקריאת admin hash מ-Supabase:", error);
      if (error.code === 'PGRST116') {
        console.error("⚠️  טבלת admins ריקה או לא קיימת");
      }
    } else if (data && data.passwordhash) {
      console.log("✅ נמצא admin hash ב-Supabase");
      return data.passwordhash;
    } else {
      console.log("⚠️  לא נמצא admin hash ב-Supabase");
    }
  } catch (err) {
    console.error("❌ שגיאה בלתי צפויה בקריאת admin hash:", err);
  }

  // fallback ל-ENV לצורך תאימות לאחור
  if (ENV_ADMIN_HASH) {
    console.log("✅ משתמש ב-ADMIN_HASH מ-.env");
    return ENV_ADMIN_HASH;
  }

  console.error("❌ לא נמצא admin hash - לא ב-Supabase ולא ב-.env");
  return null;
}

exports.loginAdmin = async (req, res) => {
  try {
    const { password } = req.body;

    console.log("🔐 ניסיון התחברות מנהל...");

    // בדיקת input
    if (!password) {
      console.log("❌ סיסמה לא הועברה");
      return res.status(400).json({ error: "סיסמה נדרשת" });
    }

    console.log("🔍 מחפש admin hash...");
    const adminHash = await getAdminHash();
    if (!adminHash) {
      console.error("❌ לא נמצא admin hash - צריך ליצור admin");
      return res.status(500).json({ 
        error: "סיסמת המנהל לא הוגדרה. הרץ: node server/scripts/createAdmin.js" 
      });
    }

    console.log("🔐 משווה סיסמה עם hash...");
    // בדיקה אם הסיסמה נכונה
    const match = await bcrypt.compare(password, adminHash);
    if (!match) {
      console.log("❌ סיסמה לא תואמת");
      console.log(`   Hash בשימוש: ${adminHash.substring(0, 30)}...`);
      return res.status(401).json({ error: "סיסמה לא נכונה" });
    }

    console.log("✅ סיסמה תואמת! יוצר token...");
    // אם נכון – יוצרים טוקן
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });

    console.log("✅ התחברות הצליחה!");
    res.json({ token, message: "התחברות הצליחה" });
  } catch (err) {
    console.error("❌ שגיאה בהתחברות:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};

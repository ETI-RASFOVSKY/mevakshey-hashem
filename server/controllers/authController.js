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
    const { data, error } = await supabase
      .from("admins")
      .select("passwordhash")
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error reading admin hash from DB:", error);
    }

    if (data && data.passwordhash) {
      return data.passwordhash;
    }
  } catch (err) {
    console.error("Unexpected error fetching admin hash:", err);
  }

  // fallback ל-ENV לצורך תאימות לאחור
  if (ENV_ADMIN_HASH) {
    return ENV_ADMIN_HASH;
  }

  return null;
}

exports.loginAdmin = async (req, res) => {
  try {
    const { password } = req.body;

    // בדיקת input
    if (!password) {
      return res.status(400).json({ error: "סיסמה נדרשת" });
    }

    const adminHash = await getAdminHash();
    if (!adminHash) {
      return res.status(500).json({ error: "סיסמת המנהל לא הוגדרה" });
    }

    // בדיקה אם הסיסמה נכונה
    const match = await bcrypt.compare(password, adminHash);
    if (!match) {
      return res.status(401).json({ error: "סיסמה לא נכונה" });
    }

    // אם נכון – יוצרים טוקן
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });

    res.json({ token, message: "התחברות הצליחה" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};

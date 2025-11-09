const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ADMIN_HASH = process.env.ADMIN_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

exports.loginAdmin = async (req, res) => {
  try {
    const { password } = req.body;

    // בדיקת input
    if (!password) {
      return res.status(400).json({ error: "סיסמה נדרשת" });
    }

    if (!ADMIN_HASH) {
      return res.status(500).json({ error: "הגדרות שרת לא תקינות" });
    }

    // בדיקה אם הסיסמה נכונה
    const match = await bcrypt.compare(password, ADMIN_HASH);
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

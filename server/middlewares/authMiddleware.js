const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

function adminOnly(req, res, next) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ error: "חסר טוקן" });
  }

  const token = authHeader.split(" ")[1]; // Authorization: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "טוקן לא תקין" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "גישה אסורה" });
    }
    req.user = decoded; // שמירת מידע המשתמש ב-request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "טוקן פג תוקף" });
    }
    return res.status(401).json({ error: "טוקן לא תקף" });
  }
}

module.exports = { adminOnly };
